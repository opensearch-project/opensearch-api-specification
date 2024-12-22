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
 * Keeps only description: field values.
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
    var writer = fs.openSync(filename, 'w+')

    var inside_text = false
    contents.split(/\r?\n/).forEach((line) => {
      if (line.match(/^[\s]+((description|x-deprecation-message): \|)/)) {
        inside_text = true
      } else if (line.match(/^[\s]+((description|x-deprecation-message):)[\s]+/)) {
        fs.writeSync(writer, this.prune_vars(this.prune(line, /(description|x-deprecation-message):/, ' ')))
      } else if (inside_text && line.match(/^[\s]*[\w\\$]*:/)) {
        inside_text = false
      } else if (inside_text) {
        const cleanedLine = line.replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1');
        fs.writeSync(writer, this.prune_vars(cleanedLine));
      }
      if (line.length > 0) {
        fs.writeSync(writer, "\n")
      }
    })
  }

  prune_vars(line: string): string {
    return this.prune(line, /([`])(?:(?=(\\?))\2.)*?\1/g, '*')
  }

  prune(line: string, regex: RegExp, char: string): string {
    return line.replace(regex, (match) => {
      return Array(match.length + 1).join(char)
    })
  }
}
