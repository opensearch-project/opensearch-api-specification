/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

import { Logger, LogLevel } from '../Logger'
import { Command, Option } from '@commander-js/extra-typings'
import ExportChapters from './ExportChapters'
import { PostmanManager } from './PostmanManager'

const command = new Command()
  .description('Run test stories against the OpenSearch spec.')
  .addOption(new Option('--tests, --tests-path <path>', 'path to the root folder of the tests').default('./tests/default'))
  .allowExcessArguments(false)
  .parse()


const opts = command.opts()
const logger = new Logger(LogLevel.warn)
const postman_manager = new PostmanManager()
const runner = new ExportChapters(logger, postman_manager)

runner.run(opts.testsPath)