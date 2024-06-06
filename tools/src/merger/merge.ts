/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

import { Command, Option } from '@commander-js/extra-typings'
import OpenApiMerger from './OpenApiMerger'
import { resolve } from 'path'
import { Logger, LogLevel } from '../Logger'

const command = new Command()
  .description('Merges the multi-file OpenSearch spec into a single file for programmatic use.')
  .addOption(new Option('-s, --source <path>', 'path to the root folder of the multi-file spec').default(resolve(__dirname, '../../../spec')))
  .addOption(new Option('-o, --output <path>', 'output file name').default(resolve(__dirname, '../../../build/opensearch-openapi.yaml')))
  .addOption(new Option('--verbose', 'show merge details').default(false))
  .allowExcessArguments(false)
  .parse()

const opts = command.opts()
const logger = new Logger(opts.verbose ? LogLevel.info : LogLevel.warn)
const merger = new OpenApiMerger(opts.source, logger)
logger.log(`Merging ${opts.source} into ${opts.output} ...`)
merger.merge(opts.output)
logger.log('Done.')
