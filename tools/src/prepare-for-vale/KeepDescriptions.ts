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
    const files = fg.globSync([`${this.root_folder}/**/*.yaml`])
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
      if (line.match(/^[\s]+(description: \|)/)) {
        inside_description = true
      } else if (line.match(/^[\s]+(description:)[\s]+/)) {
        fs.writeSync(writer, line.replace("description:", "            "))
      } else if (inside_description && line.match(/^[\s]*[\w]*:/)) {
        inside_description = false
      } else if (inside_description) {
        fs.writeSync(writer, line)
      }
      if (line.length > 0) {
        fs.writeSync(writer, "\n")
      }
    })
  }
}
