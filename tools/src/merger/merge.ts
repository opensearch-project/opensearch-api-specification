import { Command, Option } from '@commander-js/extra-typings'
import OpenApiMerger from './OpenApiMerger'
import { resolve } from 'path'

const command = new Command()
  .description('Merges the multi-file OpenSearch spec into a single file for programmatic use.')
  .addOption(new Option('-s, --source <path>', 'path to the root folder of the multi-file spec').default(resolve(__dirname, '../../../spec')))
  .addOption(new Option('-o, --output <path>', 'output file name').default(resolve(__dirname, '../../../build/opensearch-openapi.yaml')))
  .addOption(new Option('--x-include <option...>', 'only include paths with x-values defined, e.g. --x-include x-tested').default([]))
  .allowExcessArguments(false)
  .parse()

const opts = command.opts()
const merger = new OpenApiMerger(opts.source, { x_include: opts.xInclude })
console.log(`Merging ${opts.source} into ${opts.output} ...`)
merger.merge(opts.output)
console.log('Done.')
