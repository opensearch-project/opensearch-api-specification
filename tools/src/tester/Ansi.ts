/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

export function b (text: string): string { return `\x1b[1m${text}\x1b[0m` }
export function i (text: string): string { return `\x1b[3m${text}\x1b[0m` }

export function padding (text: string, length: number, prefix: number = 0): string {
  const spaces = length - text.length > 0 ? ' '.repeat(length - text.length) : ''
  return `${' '.repeat(prefix)}${text}${spaces}`
}

export function green (text: string): string { return `\x1b[32m${text}\x1b[0m` }
export function red (text: string): string { return `\x1b[31m${text}\x1b[0m` }
export function yellow (text: string): string { return `\x1b[33m${text}\x1b[0m` }
export function cyan (text: string): string { return `\x1b[36m${text}\x1b[0m` }
export function gray (text: string): string { return `\x1b[90m${text}\x1b[0m` }
export function magenta (text: string): string { return `\x1b[35m${text}\x1b[0m` }
