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
  .allowExcessArguments(false)
  .parse()

const opts = command.opts()
const display_options = {
  verbose: opts.verbose ?? false,
  tab_width: Number.parseInt(opts.tabWidth)
}
const spec = (new OpenApiMerger(opts.specPath, LogLevel.error)).merge()
const runner = new TestsRunner(spec, opts.testsPath, display_options)
void runner.run().then(() => { _.noop() })
