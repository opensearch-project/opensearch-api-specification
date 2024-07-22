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
import OpenApiMerger from './OpenApiMerger'
import OpenApiVersionExtractor from './OpenApiVersionExtractor'

const command = new Command()
  .description('Merges the multi-file OpenSearch spec into a single file for programmatic use.')
  .addOption(new Option('-s, --source <path>', 'path to the root folder of the multi-file spec').default(resolve(__dirname, '../../../spec')))
  .addOption(new Option('-o, --output <path>', 'output file name').default(resolve(__dirname, '../../../build/opensearch-openapi.yaml')))
  .addOption(new Option('--verbose', 'show merge details').default(false))
  .addOption(new Option('--opensearch-version <number>', 'target OpenSearch schema version').default(undefined))
  .allowExcessArguments(false)
  .parse()

const opts = command.opts()
const logger = new Logger(opts.verbose ? LogLevel.info : LogLevel.warn)
const merger = new OpenApiMerger(opts.source, logger)
if (opts.opensearchVersion === undefined) {
  logger.log(`Merging ${opts.source} into ${opts.output} ...`)
  merger.write_to(opts.output)
} else {
  logger.log(`Merging ${opts.source} into ${opts.output} (${opts.opensearchVersion}) ...`)
  const extractor = new OpenApiVersionExtractor(merger.spec(), opts.opensearchVersion)
  extractor.write_to(opts.output)
}
logger.log('Done.')
