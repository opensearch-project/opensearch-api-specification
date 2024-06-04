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

const command = new Command()
  .description('Validate the OpenSearch multi-file spec.')
  .addOption(new Option('-s, --source <path>', 'path to the root folder of the multi-file spec').default(resolve(__dirname, '../../../spec')))
  .allowExcessArguments(false)
  .parse()

const opts = command.opts()
console.log(`Validating ${opts.source} ...`)
const validator = new SpecValidator(opts.source)
const errors = validator.validate()

if (errors.length === 0) {
  console.log('No errors found.')
  process.exit(0)
} else {
  console.log('Errors found:\n')
  errors.forEach(e => { console.error(e) })
  console.log('\nTotal errors:', errors.length)
  process.exit(1)
}
