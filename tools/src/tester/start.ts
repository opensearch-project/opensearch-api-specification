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
import TestsRunner from './TestsRunner'
import { Command, Option } from '@commander-js/extra-typings'
import _ from 'lodash'

const command = new Command()
  .description('Run test stories against the OpenSearch spec.')
  .addOption(new Option('--spec, --spec-path <path>', 'path to the root folder of the multi-file spec').default('./spec'))
  .addOption(new Option('--tests, --tests-path <path>', 'path to the root folder of the tests').default('./tests'))
  .addOption(new Option('--tab-width <size>', 'tab width for displayed results').default('4'))
  .addOption(new Option('--verbose', 'whether to print the full stack trace of errors'))
  .addOption(new Option('--dry-run', 'dry run only, do not make HTTP requests'))
  .allowExcessArguments(false)
  .parse()

const opts = command.opts()

const tests_runner_options = {
  dry_run: opts.dryRun,
  display: {
    verbose: opts.verbose ?? false,
    tab_width: Number.parseInt(opts.tabWidth)
  }
}

// The fallback password must match the default password specified in .github/opensearch-cluster/docker-compose.yml
process.env.OPENSEARCH_PASSWORD = process.env.OPENSEARCH_PASSWORD ?? 'myStrongPassword123!'
const spec = (new OpenApiMerger(opts.specPath, LogLevel.error)).merge()
const runner = new TestsRunner(spec, tests_runner_options)
void runner.run(opts.testsPath).then(() => { _.noop() })
