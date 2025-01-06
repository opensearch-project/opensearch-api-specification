/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

import { Logger, LogLevel } from '../Logger'
import TestRunner from './TestRunner'
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
import ChapterReader from './ChapterReader'
import ChapterEvaluator from './ChapterEvaluator'
import OperationLocator from './OperationLocator'
import SchemaValidator from './SchemaValidator'
import StoryEvaluator from './StoryEvaluator'
import { ConsoleResultLogger } from './ResultLogger'
import * as process from 'node:process'
import SupplementalChapterEvaluator from './SupplementalChapterEvaluator'
import MergedOpenApiSpec from './MergedOpenApiSpec'
import StoryValidator from "./StoryValidator";
import TestResults from './TestResults'

const command = new Command()
  .description('Run test stories against the OpenSearch spec.')
  .addOption(new Option('--spec, --spec-path <path>', 'path to the root folder of the multi-file spec').default('./spec'))
  .addOption(new Option('--tests, --tests-path <path>', 'path to the root folder of the tests').default('./tests/default'))
  .addOption(
    new Option('--tab-width <size>', 'tab width for displayed results')
      .default(4)
      .argParser<number>((v, _) => Number.parseInt(v))
  )
  .addOption(new Option('--verbose', 'display verbose log output').default(false))
  .addOption(new Option('--log <path>', 'save verbose log output into a file').default(undefined))
  .addOption(new Option('--dry-run', 'dry run only, do not make HTTP requests').default(false))
  .addOption(new Option('--opensearch-version <number>', 'target OpenSearch schema version').default(undefined))
  .addOption(new Option('--opensearch-distribution <key>', 'OpenSearch distribution')
    .default('opensearch.org')
    .env('OPENSEARCH_DISTRIBUTION'))
  .addOption(OPENSEARCH_URL_OPTION)
  .addOption(OPENSEARCH_USERNAME_OPTION)
  .addOption(OPENSEARCH_PASSWORD_OPTION)
  .addOption(OPENSEARCH_INSECURE_OPTION)
  .addOption(OPENSEARCH_CERT_OPTION)
  .addOption(OPENSEARCH_KEY_OPTION)
  .addOption(AWS_ACCESS_KEY_ID_OPTION)
  .addOption(AWS_SECRET_ACCESS_KEY_OPTION)
  .addOption(AWS_SESSION_TOKEN_OPTION)
  .addOption(AWS_REGION_OPTION)
  .addOption(AWS_SERVICE_OPTION)
  .addOption(new Option('--coverage <path>', 'path to write test coverage results to'))
  .addOption(new Option('--coverage-report', 'display a detailed test coverage report'))
  .allowExcessArguments(false)
  .parse()

const opts = command.opts()
const logger = new Logger(opts.verbose ? LogLevel.info : LogLevel.warn, opts.log)

const spec = new MergedOpenApiSpec(opts.specPath, opts.opensearchVersion, opts.opensearchDistribution, new Logger(LogLevel.error))
const http_client = new OpenSearchHttpClient(get_opensearch_opts_from_cli({ responseType: 'arraybuffer', logger, ...opts }))
const chapter_reader = new ChapterReader(http_client, logger)
const chapter_evaluator = new ChapterEvaluator(new OperationLocator(spec.spec()), chapter_reader, new SchemaValidator(spec.spec(), logger), logger)
const supplemental_chapter_evaluator = new SupplementalChapterEvaluator(chapter_reader, logger)
const story_validator = new StoryValidator()
const story_evaluator = new StoryEvaluator(chapter_evaluator, supplemental_chapter_evaluator)
const result_logger = new ConsoleResultLogger(opts.tabWidth, opts.verbose)
const runner = new TestRunner(http_client, story_validator, story_evaluator, result_logger, logger)

runner.run(opts.testsPath, spec.api_version(), opts.opensearchDistribution, opts.dryRun)
  .then(
    ({ results, failed }) => {

      const test_results = new TestResults(spec, results)
      result_logger.log_coverage(test_results)
      if (opts.coverageReport) result_logger.log_coverage_report(test_results)
      if (opts.coverage !== undefined) {
        console.log(`Writing ${opts.coverage} ...`)
        test_results.write_coverage(opts.coverage)
      }

      if (failed) process.exit(1)
    },
    err => { throw err })
