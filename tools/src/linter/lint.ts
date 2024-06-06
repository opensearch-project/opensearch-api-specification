/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

import { Command, Option } from '@commander-js/extra-typings'
import SpecValidator from './SpecValidator'
import { resolve } from 'path'
import { Logger, LogLevel } from '../Logger'

const command = new Command()
  .description('Validate the OpenSearch multi-file spec.')
  .addOption(new Option('-s, --source <path>', 'path to the root folder of the multi-file spec').default(resolve(__dirname, '../../../spec')))
  .addOption(new Option('--verbose', 'whether to print the full stack trace of errors').default(false))
  .allowExcessArguments(false)
  .parse()

const opts = command.opts()
const logger = new Logger(opts.verbose ? LogLevel.info : LogLevel.warn)
logger.log(`Validating ${opts.source} ...`)
const validator = new SpecValidator(opts.source, logger)
const errors = validator.validate()

if (errors.length === 0) {
  logger.log('No errors found.')
  process.exit(0)
} else {
  logger.error('Errors found:\n')
  errors.forEach(e => { console.error(e) })
  logger.error(`\nTotal errors:${errors.length}`)
  process.exit(1)
}
