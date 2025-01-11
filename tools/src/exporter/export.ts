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
import {
  AWS_ACCESS_KEY_ID_OPTION,
  AWS_REGION_OPTION,
  AWS_SECRET_ACCESS_KEY_OPTION,
  AWS_SERVICE_OPTION,
  AWS_SESSION_TOKEN_OPTION,
  get_opensearch_opts_from_cli,
  OPENSEARCH_CERT_OPTION,
  OPENSEARCH_INSECURE_OPTION,
  OPENSEARCH_KEY_OPTION,
  OPENSEARCH_PASSWORD_OPTION,
  OPENSEARCH_URL_OPTION,
  OPENSEARCH_USERNAME_OPTION,
  OpenSearchHttpClient
} from '../OpenSearchHttpClient'
import * as process from 'node:process'
import ChapterReader from 'tester/ChapterReader'
import SupplementalChapterEvaluator from 'tester/SupplementalChapterEvaluator'
import StoryValidator from 'tester/StoryValidator'
import StoryEvaluator from 'tester/StoryEvaluator'
import { ConsoleResultLogger } from 'tester/ResultLogger'
import TestRunner from 'tester/TestRunner'
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