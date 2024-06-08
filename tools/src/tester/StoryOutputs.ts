/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

import { ChapterOutput } from './ChapterOutput'
import { OutputReference } from './types/eval.types'
import { type Output, type Parameter } from './types/story.types'

export class StoryOutputs {
  private outputs: Record<string, ChapterOutput>

  constructor (outputs: Record<string, ChapterOutput> = {}) {
    this.outputs = outputs
  }

  has_chapter (chapter_id: string): boolean {
    return this.outputs[chapter_id] !== undefined
  }

  has_output_value (chapter_id: string, output_name: string): boolean {
    return this.has_chapter(chapter_id) && this.outputs[chapter_id].get_output(output_name) !== undefined
  }

  set_chapter (chapter_id: string, output: ChapterOutput): void {
    this.outputs[chapter_id] = output
  }

  set_episode_output (chapter_id: string, output: Output): void {
    if (this.outputs[chapter_id] === undefined) {
      this.outputs[chapter_id] = new ChapterOutput({})
    }
    this.outputs[chapter_id].set_output(output.name, output.value)
  }

  get_output_value (chapter_id: string, output_name: string): any {
    return this.outputs[chapter_id].get_output(output_name)
  }

  resolve_params (parameters: Record<string, Parameter>): Record<string, Parameter> {
    const resolved_params: Record<string, Parameter> = {}
    for (const [param_name, param_value] of Object.entries(parameters ?? {})) {
      if (typeof param_value === 'string') {
        resolved_params[param_name] = this.resolve_string(param_value)
      } else {
        resolved_params[param_name] = param_value
      }
    }
    return resolved_params
  }

  resolve_string (str: string): any {
    const ref = OutputReference.parse(str)
    if (ref) {
      return this.get_output_value(ref.chapter_id, ref.output_name)
    } else {
      return str
    }
  }

  resolve_value (payload: any): any {
    const payload_type = typeof payload
    switch (payload_type) {
      case 'string':
        return this.resolve_string(payload as string)
      case 'object':
        if (Array.isArray(payload)) {
          const resolved_array: any[] = []
          for (const value of payload) {
            resolved_array.push(this.resolve_value(value))
          }
          return resolved_array
        } else {
          const resolved_obj: Record<string, any> = {}
          for (const [key, value] of Object.entries(payload as Record<string, any>)) {
            resolved_obj[key] = this.resolve_value(value)
          }
          return resolved_obj
        }
      default:
        return payload
    }
  }
}
