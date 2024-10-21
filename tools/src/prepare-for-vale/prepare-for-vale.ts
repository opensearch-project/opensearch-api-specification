/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

import { Command, Option } from '@commander-js/extra-typings'
import { Logger, LogLevel } from '../Logger'
import { resolve } from 'path'
import KeepDescriptions from './KeepDescriptions'

const command = new Command()
  .description('Convert YAML files to text.')
  .addOption(new Option('-s, --source <path>', 'path to the root folder of the multi-file spec').default(resolve(__dirname, '../../../spec')))
  .addOption(new Option('--verbose', 'show merge details').default(false))
  .allowExcessArguments(false)
  .parse()

const opts = command.opts()
const logger = new Logger(opts.verbose ? LogLevel.info : LogLevel.warn)
const keep_descriptions = new KeepDescriptions(opts.source, logger)
logger.log(`Preparing ${opts.source} ...`)
keep_descriptions.process()
logger.log('Done.')
