/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

import { type Evaluation, Result, type EvaluationWithOutput, type StoryOutputs, type OutputReference } from './types/eval.types'
import { type ActualResponse, type ChapterRequest, type Output, type Parameter, type Story } from './types/story.types'
import _ from 'lodash'

export function overall_result (evaluations: Evaluation[]): Result {
  if (evaluations.some(e => e.result === Result.ERROR)) return Result.ERROR
  if (evaluations.some(e => e.result === Result.FAILED)) return Result.FAILED
  if (evaluations.some(e => e.result === Result.SKIPPED)) return Result.SKIPPED
  return Result.PASSED
}

export function extract_output_values (response: ActualResponse, chapter_output?: Output): EvaluationWithOutput | undefined {
  if (!chapter_output) return undefined
  const output: Record<string, any> = {}
  for (const [name, path] of Object.entries(chapter_output)) {
    const [source, ...rest] = path.split('.')
    const keys = rest.join('.')
    let value: any
    if (source === 'payload') {
      if (response.payload === undefined) {
        return { result: Result.ERROR, message: 'No payload found in response, but expected output: ' + path }
      }
      value = keys.length === 0 ? response.payload : _.get(response.payload, keys)
      if (value === undefined) {
        return { result: Result.ERROR, message: `Expected to find non undefined value at \`${path}\`.` }
      }
    } else {
      return { result: Result.ERROR, message: 'Unknown output source: ' + source }
    }
    output[name] = value
  }
  return { result: Result.PASSED, output }
}

export function resolve_params (parameters: Record<string, Parameter>, story_outputs: StoryOutputs): Record<string, Parameter> {
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

export function resolve_value (payload: any, story_outputs: StoryOutputs): any {
  const payload_type = typeof payload
  switch (payload_type) {
    case 'string':
      return resolve_string(payload as string, story_outputs)
    case 'object':
      if (Array.isArray(payload)) {
        const resolved_array: any[] = []
        for (const value of payload) {
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

function parse_reference (str: string): OutputReference | undefined {
  if (str.startsWith('${') && str.endsWith('}')) {
    const spl = str.slice(2, -1).split('.', 2)
    return { chapter_id: spl[0], output_name: spl[1] }
  }
  return undefined
}

export function resolve_string (str: string, story_outputs: StoryOutputs): any {
  const ref = parse_reference(str)
  if (ref) {
    return story_outputs[ref.chapter_id][ref.output_name]
  } else {
    return str
  }
}

function extract_params_variables (parameters: Record<string, Parameter>, variables: Set<OutputReference>): void {
  Object.values(parameters ?? {}).forEach((param) => {
    if (typeof param === 'string') {
      const ref = parse_reference(param)
      if (ref) {
        variables.add(ref)
      }
    }
  })
}

function extract_request_body_variables (request_body: any, variables: Set<OutputReference>): void {
  const request_body_type = typeof request_body
  switch (request_body_type) {
    case 'string': {
      const ref = parse_reference(request_body as string)
      if (ref !== undefined) {
        variables.add(ref)
      }
      break
    }
    case 'object': {
      if (Array.isArray(request_body)) {
        for (const value of request_body) {
          extract_request_body_variables(value, variables)
        }
      } else {
        for (const [, value] of Object.entries(request_body as Record<string, any>)) {
          extract_request_body_variables(value, variables)
        }
      }
      break
    }
    default: {
      break
    }
  }
}

export function check_used_variables (chapter: ChapterRequest, story_outputs: StoryOutputs): string | undefined {
  const variables = new Set<OutputReference>()
  extract_params_variables(chapter.parameters ?? {}, variables)
  extract_request_body_variables(chapter.request_body?.payload ?? {}, variables)
  for (const { chapter_id, output_name } of variables) {
    if (story_outputs[chapter_id] === undefined) {
      return `Chapter makes reference to non existent chapter "${chapter_id}`
    }
    if (story_outputs[chapter_id][output_name] === undefined) {
      return `Chapter makes reference to non existent output "${output_name}" in chapter "${chapter_id}"`
    }
  }
}

export function check_story_variables (story: Story): string | undefined {
  const story_outputs: StoryOutputs = {}
  const all_episodes = (story.prologues ?? []).concat(story.chapters ?? []).concat(story.epilogues ?? [])
  for (const episode of all_episodes) {
    const error = check_used_variables(episode, story_outputs)
    if (error !== undefined) {
      return error
    }
    if (episode.id === undefined && episode.output !== undefined) {
      return 'An episode must have an id to store its output'
    }
    if (episode.id !== undefined && episode.output !== undefined) {
      story_outputs[episode.id] = episode.output
    }
  }
}
