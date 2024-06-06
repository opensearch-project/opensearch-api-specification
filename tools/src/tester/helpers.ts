import { type Evaluation, Result, EvaluationWithOutput, StoryOutputs } from './types/eval.types'
import { ActualResponse, Output, Parameter, Payload } from './types/story.types'
import _ from 'lodash'

export function overall_result (evaluations: Evaluation[]): Result {
  if (evaluations.some(e => e.result === Result.ERROR)) return Result.ERROR
  if (evaluations.some(e => e.result === Result.FAILED)) return Result.FAILED
  if (evaluations.some(e => e.result === Result.SKIPPED)) return Result.SKIPPED
  return Result.PASSED
}

export function extract_output_values (response: ActualResponse, chapterOutput?: Output): EvaluationWithOutput {
  const output: Record<string, any> = {}
  for (const [name, path] of Object.entries(chapterOutput ?? {})) {
    console.log(`name: ${name}`)
    console.log(`path: ${path}`)
    const [source, ...rest] = path.split('.')
    const keys = rest.join('.')
    let value: any
    if (source === 'payload') {
      if(!response.payload) {
        return { result: Result.ERROR, message: 'No payload found in response, but expected output: ' + path}
      }
      console.log(`keys: ${keys}`)
      value = keys.length ==0 ? response.payload : _.get(response.payload, keys)
      if(value == undefined) {
        return { result: Result.ERROR, message: `Expected to find non undefined value at \`${path}\`.`}
      }
    } else {
      return { result: Result.ERROR, message: 'Unknown output source: ' + source}
    }
    output[name] = value
  }
  return { result: Result.PASSED, output: output }
}

export function resolve_params (parameters: {[k: string]: Parameter}, story_outputs: StoryOutputs): Record<string, Parameter> {
  const resolved_params: Record<string, Parameter> = {}
  for (const [param_name, param_value] of Object.entries(parameters ?? {})) {
    if(typeof param_value === 'string') {
      resolved_params[param_name] = resolve_string(param_value, story_outputs)
    } else {
      resolved_params[param_name] = param_value
    }
  }
  return resolved_params
}

export function resolve_value (payload: Payload, story_outputs: StoryOutputs): Payload {
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

export function resolve_string (str: string, story_outputs: StoryOutputs): any {
  if(str.startsWith('${') && str.endsWith('}')) {
    const path = str.slice(2, -1)
    const [chapter_id, output_name] = path.split('.', 2)
    return story_outputs[chapter_id][output_name]
  } else {
    return str
  }
}
