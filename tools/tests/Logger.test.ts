/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

import { Logger, LogLevel } from '../src/Logger'

describe('Logger', () => {
  let log: jest.Mock

  beforeEach(() => {
    log = console.log = jest.fn()
  })

  afterEach(() => {
    log.mockClear()
  })

  describe('at default log level', () => {
    const logger = new Logger()

    test('sets log level at warn', () => {
      expect(logger.level).toEqual(LogLevel.warn)
    })

    test('does not log info level messages', () => {
      logger.log('log')
      logger.error('error')
      logger.warn('warn')
      logger.info('info')
      expect(log.mock.calls).toEqual([
        ['log'],
        ['[ERROR] error'],
        ['[WARNING] warn']
      ])
    })
  })

  describe('at info log level', () => {
    const logger = new Logger(LogLevel.info)

    test('sets log level at info', () => {
      expect(logger.level).toEqual(LogLevel.info)
    })

    test('logs all messages', () => {
      logger.log('log')
      logger.error('error')
      logger.warn('warn')
      logger.info('info')
      expect(log.mock.calls).toEqual([
        ['log'],
        ['[ERROR] error'],
        ['[WARNING] warn'],
        ['[INFO] info']
      ])
    })
  })

  describe('at warn log level', () => {
    const logger = new Logger(LogLevel.warn)

    test('sets log level at warn', () => {
      expect(logger.level).toEqual(LogLevel.warn)
    })

    test('does not log info messages', () => {
      logger.log('log')
      logger.error('error')
      logger.warn('warn')
      logger.info('info')
      expect(log.mock.calls).toEqual([
        ['log'],
        ['[ERROR] error'],
        ['[WARNING] warn']
      ])
    })
  })

  describe('at error log level', () => {
    const logger = new Logger(LogLevel.error)

    test('sets log level at error', () => {
      expect(logger.level).toEqual(LogLevel.error)
    })

    test('does not log warn and info messages', () => {
      logger.log('log')
      logger.error('error')
      logger.warn('warn')
      logger.info('info')
      expect(log.mock.calls).toEqual([
        ['log'],
        ['[ERROR] error']
      ])
    })
  })
})
