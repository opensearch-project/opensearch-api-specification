/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

import { Command, Option } from '@commander-js/extra-typings'
import { resolve } from 'path'
import { Logger, LogLevel } from '../Logger'
import { read_yaml, write_json, write_text } from '../helpers'
import ClientModelBuilder from './ClientModelBuilder'
import TypeScriptRenderer from './TypeScriptRenderer'

const command = new Command()
  .description('Builds the resolved client model from the bundled spec (run `npm run merge` first).')
  .addOption(new Option('-i, --input <path>', 'bundled spec').default(resolve(__dirname, '../../../build/opensearch-openapi.yaml')))
  .addOption(new Option('-o, --output <path>', 'client model file').default(resolve(__dirname, '../../../build/opensearch-client-model.json')))
  .addOption(new Option('--typescript <path>', 'also render the model as TypeScript declarations to this file'))
  .addOption(new Option('--verbose', 'list every diagnostic').default(false))
  .allowExcessArguments(false)
  .parse()

const opts = command.opts()
const logger = new Logger(opts.verbose ? LogLevel.info : LogLevel.warn)
const model = new ClientModelBuilder(read_yaml(opts.input)).build()
write_json(opts.output, model)
if (opts.typescript !== undefined) write_text(opts.typescript, new TypeScriptRenderer().render(model))

const kinds: Record<string, number> = {}
for (const entry of Object.values(model.types)) kinds[entry.type_kind] = (kinds[entry.type_kind] ?? 0) + 1
logger.log(`Wrote ${Object.keys(model.types).length} types to ${opts.output} (${JSON.stringify(kinds)}).`)
for (const d of model.diagnostics) logger.info(`${d.type}: ${d.message}`)
if (model.diagnostics.length > 0) logger.warn(`${model.diagnostics.length} diagnostics (use --verbose to list them).`)
