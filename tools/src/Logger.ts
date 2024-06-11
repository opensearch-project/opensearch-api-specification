/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

export enum LogLevel {
  error = 1,
  warn = 2,
  info = 3
}

export class Logger {
  level: LogLevel

  static messages = {
    [LogLevel.error]: 'ERROR',
    [LogLevel.warn]: 'WARNING',
    [LogLevel.info]: 'INFO'
  }

  constructor (level: LogLevel = LogLevel.warn) {
    this.level = level
  }

  log (message: string): void {
    console.log(message)
  }

  info (message: string): void {
    this.#log(LogLevel.info, message)
  }

  warn (message: string): void {
    this.#log(LogLevel.warn, message)
  }

  error (message: string): void {
    this.#log(LogLevel.error, message)
  }

  #log (level: LogLevel, message: string): void {
    if (level > this.level) return
    const output = `[${Logger.messages[level]}] ${message}`
    console.log(output)
  }
}
