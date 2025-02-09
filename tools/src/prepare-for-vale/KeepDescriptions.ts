/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

import fs from 'fs'
import fg from 'fast-glob'
import { Logger } from '../Logger'

/**
 * Keeps only description: field values and type: number with its next line.
 */
export default class KeepDescriptions {
  root_folder: string
  logger: Logger

  constructor (root_folder: string, logger: Logger = new Logger()) {
    this.logger = logger
    this.root_folder = fs.realpathSync(root_folder)
  }

  process(): void {
    this.root_folder
    const files = fg.globSync([`${this.root_folder}/**/*.{yaml,yml}`], { dot: true })
    files.forEach((path) => {
      this.logger.log(path)
      this.process_file(path)
    })
  }

  process_file(filename: string): void {
    const contents = fs.readFileSync(filename, 'utf-8')
    const lines = contents.split(/\r?\n/)
    const writer = fs.openSync(filename, 'w+')

    let inside_text = false
    for (let i = 0; i < lines.length; i++) {
      let line = lines[i]

      if (line.match(/^[\s]+((description|x-deprecation-message): \|)/)) {
        inside_text = true
      } else if (line.match(/^[\s]+((description|x-deprecation-message):)[\s]+/)) {
        let cleaned_line = this.prune(line, /(description|x-deprecation-message):/, ' ')
        cleaned_line = this.prune_vars(cleaned_line)
        cleaned_line = this.remove_links(cleaned_line)
        fs.writeSync(writer, cleaned_line + "\n")
      } else if (inside_text && line.match(/^[\s]*[\w\\$]*:/)) {
        inside_text = false
      } else if (inside_text) {
        let cleaned_line = this.remove_links(line)
        cleaned_line = this.prune_vars(cleaned_line)
        fs.writeSync(writer, cleaned_line + "\n")
      } else if (line.includes("type: number")) {
        fs.writeSync(writer, line + "\n")
        if (i + 1 < lines.length) {
          fs.writeSync(writer, lines[i + 1] + "\n")
        }
      }

      if (line.length > 0) {
        fs.writeSync(writer, "\n")
      }
    }
  }

  prune_vars(line: string): string {
    return this.prune(line, /([`])(?:(?=(\\?))\2.)*?\1/g, '*')
  }

  prune(line: string, regex: RegExp, char: string): string {
    return line.replace(regex, (match) => {
      return Array(match.length + 1).join(char)
    })
  }

  remove_links(line: string): string {
    return line.replace(/\[([^\]]+)\]\([^)]+\)/g, (match, p1) => {
      const spaces = ' '.repeat(match.length - p1.length - 1)
      return ' ' + p1 + spaces
    })
  }
}
