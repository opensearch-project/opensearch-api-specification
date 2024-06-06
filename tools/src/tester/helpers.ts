import { type Evaluation, Result, EvaluationWithOutput, StoryOutputs, StoryEvaluation } from './types/eval.types'
import { ActualResponse, ChapterRequest, Output, Parameter, Payload, Story } from './types/story.types'
import _ from 'lodash'

export function overall_result(evaluations: Evaluation[]): Result {
  if (evaluations.some(e => e.result === Result.ERROR)) return Result.ERROR
  if (evaluations.some(e => e.result === Result.FAILED)) return Result.FAILED
  if (evaluations.some(e => e.result === Result.SKIPPED)) return Result.SKIPPED
  return Result.PASSED
}

export function extract_output_values(response: ActualResponse, chapterOutput?: Output): EvaluationWithOutput {
  const output: Record<string, any> = {}
  for (const [name, path] of Object.entries(chapterOutput ?? {})) {
    const [source, ...rest] = path.split('.')
    const keys = rest.join('.')
    let value: any
    if (source === 'payload') {
      if (!response.payload) {
        return { result: Result.ERROR, message: 'No payload found in response, but expected output: ' + path }
      }
      value = keys.length == 0 ? response.payload : _.get(response.payload, keys)
      if (value == undefined) {
        return { result: Result.ERROR, message: `Expected to find non undefined value at \`${path}\`.` }
      }
    } else {
      return { result: Result.ERROR, message: 'Unknown output source: ' + source }
    }
    output[name] = value
  }
  return { result: Result.PASSED, output: output }
}

export function resolve_params(parameters: { [k: string]: Parameter }, story_outputs: StoryOutputs): Record<string, Parameter> {
  const resolved_params: Record<string, Parameter> = {}
  for (const [param_name, param_value] of Object.entries(parameters ?? {})) {
    if (typeof param_value === 'string') {
      resolved_params[param_name] = resolve_string(param_value, story_outputs)
    } else {
      resolved_params[param_name] = param_value
    }
  }
  return resolved_params
}

export function resolve_value(payload: Payload, story_outputs: StoryOutputs): Payload {
  const payload_type = typeof payload
  switch (payload_type) {
    case 'string':
      return resolve_string(payload as string, story_outputs)
    case 'object':
      if (Array.isArray(payload)) {
        const resolved_array: any[] = []
        for (const value of payload as any[]) {
          resolved_array.push(resolve_value(value, story_outputs))
        }
        return resolved_array
      } else {
        const resolved_obj: Record<string, any> = {}
        for (const [key, value] of Object.entries(payload as Record<string, any>)) {
          resolved_obj[key] = resolve_value(value, story_outputs)
        }
        return resolved_obj
      }
    default:
      return payload
  }
}

function parse_reference(str: string): string[] | undefined {
  if (str.startsWith('${') && str.endsWith('}')) {
    return str.slice(2, -1).split('.', 2)
  }
  return undefined
}

export function resolve_string(str: string, story_outputs: StoryOutputs): any {
  const path = parse_reference(str)
  if (path) {
    const [chapter_id, output_name] = path
    return story_outputs[chapter_id][output_name]
  } else {
    return str
  }
}

function extract_params_variables(parameters: Record<string, Parameter>, variables: Set<string[]>): void {
  Object.values((parameters || {})).forEach((param) => {
    if (typeof param === 'string') {
      const ref = parse_reference(param)
      if(ref) {
        variables.add(ref)
      }
    }
  })
}

function extract_request_body_variables(request_body: Payload, variables: Set<string[]>): void {
  const request_body_type = typeof request_body
  switch (request_body_type) {
    case 'string':
      const ref = parse_reference(request_body as string)
      if(ref) {
        variables.add(ref)
      }
      break
    case 'object':
      if (Array.isArray(request_body)) {
        for (const value of request_body as any[]) {
          extract_request_body_variables(value, variables)
        }
      } else {
        for (const [_, value] of Object.entries(request_body as Record<string, any>)) {
          extract_request_body_variables(value, variables)
        }
      }
      break
    default:
      break
  }
}

export function check_used_variables(chapter: ChapterRequest, story_outputs: StoryOutputs): string | undefined {
  const variables = new Set<string[]>()
  extract_params_variables(chapter.parameters ?? {}, variables)
  extract_request_body_variables(chapter.request_body?.payload ?? {}, variables)
  for (const [chapter_id, output] of variables) {
    if (story_outputs[chapter_id] == undefined) {
      return `Chapter makes reference to non existent chapter "${chapter_id}`
    }
    if (story_outputs[chapter_id][output] == undefined) {
      return `Chapter makes reference to non existent output "${output}" in chapter "${chapter_id}"`
    }
  }
}

export function check_story_variables(story: Story): string | undefined {
  const story_outputs: StoryOutputs = {}
  const all_episodes = (story.prologues || []).concat(story.chapters || []).concat(story.epilogues || [])
  for(const episode of all_episodes) {
    const error = check_used_variables(episode, story_outputs)
    if (error) {
      return error
    }
    if(!episode.id && episode.output) {
      return "An episode must have an id to store its output"
    }
    if(episode.id && episode.output) {
      story_outputs[episode.id] = episode.output
    }
  }
}
