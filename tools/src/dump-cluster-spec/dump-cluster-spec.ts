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
import * as process from 'node:process'
import { write_yaml } from '../helpers'
import {
  get_opensearch_opts_from_cli,
  OPENSEARCH_INSECURE_OPTION,
  OPENSEARCH_PASSWORD_OPTION,
  OPENSEARCH_URL_OPTION,
  OPENSEARCH_USERNAME_OPTION, OpenSearchHttpClient,
  type OpenSearchHttpClientOptions
} from '../OpenSearchHttpClient'

interface CommandOpts {
  opensearch: OpenSearchHttpClientOptions
  output: string
}

async function main (opts: CommandOpts): Promise<void> {
  const client = new OpenSearchHttpClient(opts.opensearch)

  const info = await client.wait_until_available()
  console.log(info)

  const cluster_spec = await client.get('/_plugins/api')

  write_yaml(opts.output, cluster_spec.data)
}

const command = new Command()
  .description('Dumps an OpenSearch cluster\'s generated specification.')
  .addOption(OPENSEARCH_URL_OPTION)
  .addOption(OPENSEARCH_USERNAME_OPTION)
  .addOption(OPENSEARCH_PASSWORD_OPTION)
  .addOption(OPENSEARCH_INSECURE_OPTION)
  .addOption(new Option('--output <path>', 'path to the output file').default(resolve(__dirname, '../../../build/opensearch-openapi-CLUSTER.yaml')))
  .allowExcessArguments(false)
  .parse()

const opts = command.opts()

main({ output: opts.output, opensearch: get_opensearch_opts_from_cli({ opensearchResponseType: undefined, ...opts }) })
  .catch(e => {
    if (e instanceof Error) {
      console.error(`ERROR: ${e.stack}`)
      while (e.cause !== undefined) {
        console.error(`Caused by: ${e.stack}`)
        e = e.cause
      }
    } else {
      console.error('ERROR:', e)
    }
    process.exit(1)
  })
