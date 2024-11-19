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
    const files = fg.globSync([`${this.root_folder}/**/*.{yaml,yml}`])
    files.forEach((path) => {
      this.logger.log(path)
      this.process_file(path)
    })
  }

  process_file(filename: string): void {
    const contents = fs.readFileSync(filename, 'utf-8')
    var writer = fs.openSync(filename, 'w+')

    var inside_description = false
    contents.split(/\r?\n/).forEach((line) => {
      // TODO: keep x-deprecation-message
      if (line.match(/^[\s]+(description: \|)/)) {
        inside_description = true
      } else if (line.match(/^[\s]+(description:)[\s]+/)) {
        fs.writeSync(writer, this.prune(line).replace("description:", "            "))
      } else if (inside_description && line.match(/^[\s]*[\w\\$]*:/)) {
        inside_description = false
      } else if (inside_description) {
        fs.writeSync(writer, this.prune(line))
      }
      if (line.length > 0) {
        fs.writeSync(writer, "\n")
      }
    })
  }

  prune(line: string): string {
    return line.replace(/([`])(?:(?=(\\?))\2.)*?\1/g, (match) => {
      return Array(match.length + 1).join('*')
    })
  }
}
