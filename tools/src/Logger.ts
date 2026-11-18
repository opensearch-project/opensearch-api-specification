/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

import * as fs from 'fs'
import * as path from 'path'

export enum LogLevel {
  error = 1,
  warn = 2,
  info = 3
}

export class Logger {
  level: LogLevel
  log_file?: string

  static messages = {
    [LogLevel.error]: 'ERROR',
    [LogLevel.warn]: 'WARNING',
    [LogLevel.info]: 'INFO'
  }

  constructor(level: LogLevel = LogLevel.warn, log_file?: string) {
    this.level = level
    this.log_file = log_file

    if (this.log_file !== undefined) {
      const logs_path = path.dirname(this.log_file)
      if (!fs.existsSync(logs_path)) {
        fs.mkdirSync(logs_path, { recursive: true })
      }
    }
  }

  log(message: string): void {
    console.log(message)
    this.#write(message)
  }

  info(message: string): void {
    this.#log(LogLevel.info, message)
  }

  warn(message: string): void {
    this.#log(LogLevel.warn, message)
  }

  error(message: string): void {
    this.#log(LogLevel.error, message)
  }

  #log(level: LogLevel, message: string): void {
    const output = `[${Logger.messages[level]}] ${message}`
    this.#write(output)
    if (level > this.level) return
    console.log(output)
  }

  #write(message: string): void {
    if (this.log_file !== undefined) {
      fs.appendFileSync(this.log_file, message + '\n')
    }
  }
}
