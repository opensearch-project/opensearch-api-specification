/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

import OpenApiMerger from '../merger/OpenApiMerger'
import { LogLevel } from '../Logger'
import TestRunner from './TestRunner'
import { Command, Option } from '@commander-js/extra-typings'
import {
  get_opensearch_opts_from_cli,
  OPENSEARCH_INSECURE_OPTION,
  OPENSEARCH_PASSWORD_OPTION,
  OPENSEARCH_URL_OPTION,
  OPENSEARCH_USERNAME_OPTION, OpenSearchHttpClient
} from '../OpenSearchHttpClient'
import ChapterReader from './ChapterReader'
import ChapterEvaluator from './ChapterEvaluator'
import OperationLocator from './OperationLocator'
import SchemaValidator from './SchemaValidator'
import StoryEvaluator from './StoryEvaluator'
import { ConsoleResultLogger } from './ResultLogger'
import * as process from 'node:process'

const command = new Command()
  .description('Run test stories against the OpenSearch spec.')
  .addOption(new Option('--spec, --spec-path <path>', 'path to the root folder of the multi-file spec').default('./spec'))
  .addOption(new Option('--tests, --tests-path <path>', 'path to the root folder of the tests').default('./tests'))
  .addOption(
    new Option('--tab-width <size>', 'tab width for displayed results')
      .default(4)
      .argParser<number>((v, _) => Number.parseInt(v))
  )
  .addOption(new Option('--verbose', 'whether to print the full stack trace of errors').default(false))
  .addOption(new Option('--dry-run', 'dry run only, do not make HTTP requests').default(false))
  .addOption(OPENSEARCH_URL_OPTION)
  .addOption(OPENSEARCH_USERNAME_OPTION)
  .addOption(OPENSEARCH_PASSWORD_OPTION)
  .addOption(OPENSEARCH_INSECURE_OPTION)
  .allowExcessArguments(false)
  .parse()

const opts = command.opts()

const spec = (new OpenApiMerger(opts.specPath, LogLevel.error)).merge()

const http_client = new OpenSearchHttpClient(get_opensearch_opts_from_cli(opts))
const chapter_reader = new ChapterReader(http_client)
const chapter_evaluator = new ChapterEvaluator(new OperationLocator(spec), chapter_reader, new SchemaValidator(spec))
const story_evaluator = new StoryEvaluator(chapter_reader, chapter_evaluator)
const result_logger = new ConsoleResultLogger(opts.tabWidth, opts.verbose)
const runner = new TestRunner(story_evaluator, result_logger)

runner.run(opts.testsPath, opts.dryRun)
  .then(
    ({ failed }) => {
      if (failed) process.exit(1)
    },
    err => { throw err })
