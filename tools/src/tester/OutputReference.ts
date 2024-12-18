/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

import { split } from "../helpers"

export class OutputReference {
  chapter_id: string
  output_name: string

  constructor(chapter_id: string, output_name: string) {
    this.chapter_id = chapter_id
    this.output_name = output_name
  }

  /**
   * Parses a string and returns a collection of output references that it may contain.
   *
   * @param str a string
   * @returns an array of output references
   */
  static parse(str: string): OutputReference[] {
    const pattern = /\$\{([^}]+)\}/g
    let match
    var result = []
    while ((match = pattern.exec(str)) !== null) {
      const spl = split(match[1], '.', 2)
      result.push(new OutputReference(spl[0], spl[1]))
    }
    return result
  }

  /**
   * Replaces occurrences of output references.
   * Takes special care of preserving the type of the reference value if the entire string is a reference.
   *
   * @param str a string that may contain output references
   * @param callback a callback for fetching reference values
   * @returns a string with output references replaced by their values
   */
  static replace(str: string, callback: (chapter_id: any, variable: any) => string): any {
    let full_match = str.match(/^\$\{([^}]+)\}$/)
    if (full_match) {
      // the entire string is a reference, preserve the type of the returned value
      const spl = split(full_match[1], '.', 2)
      return callback(spl[0], spl[1])
    } else return str.replace(/\$\{([^}]+)\}/g, (_, k) => {
      const spl = split(k, '.', 2)
      return callback(spl[0], spl[1])
    })
  }
}
