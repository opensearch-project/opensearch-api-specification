/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

import fs from 'fs'
import tmp from 'tmp'
import { PostmanManager } from 'exporter/PostmanManager'
import ExportChapters from 'exporter/ExportChapters'
import { Logger, LogLevel } from 'Logger'

describe('OpenApiMerger', () => {
  var logger: Logger;
  var postman_manager: PostmanManager;
  var runner: ExportChapters;

  describe('defaults', () => {

    describe('write_to()', () => {
      var temp: tmp.DirResult
      var filename: string

      beforeEach(() => {
        temp = tmp.dirSync()
        filename = `${temp.name}/postman_collection.json`
        logger = new Logger(LogLevel.warn)
        postman_manager = new PostmanManager(filename);
        runner = new ExportChapters(logger, postman_manager)
      })

      afterEach(() => {
        fs.unlinkSync(filename)
        temp.removeCallback()
      })

      test('writes a spec', () => {
        runner.run('./tools/tests/exporter/fixtures')
        expect(fs.readFileSync('./tools/tests/exporter/fixtures/postman_collection.json', 'utf8'))
          .toEqual(fs.readFileSync(filename, 'utf8'))
      })
    })
  })
})
