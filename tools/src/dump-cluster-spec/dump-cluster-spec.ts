import { Command, Option } from '@commander-js/extra-typings'
import { resolve } from 'path'
import axios from 'axios'
import * as https from 'node:https'
import * as process from 'node:process'
import { sleep, write_yaml } from '../../helpers'

interface CommandOpts {
  host: string
  https: boolean
  insecure: boolean
  port: string | number
  username: string
  password?: string
  output: string
}

async function main (opts: CommandOpts): Promise<void> {
  const url = `http${opts.https ? 's' : ''}://${opts.host}:${opts.port}`
  const client = axios.create({
    httpsAgent: new https.Agent({
      rejectUnauthorized: !opts.insecure
    }),
    auth: opts.password !== undefined
      ? {
          username: opts.username,
          password: opts.password
        }
      : undefined
  })

  let attempt = 0
  while (true) {
    attempt += 1
    try {
      const info = await client.get(url)
      console.log(info.data)
      break
    } catch (e) {
      if (attempt >= 20) {
        throw e
      }
      await sleep(5000)
    }
  }

  const cluster_spec = await client.get(`${url}/_plugins/api`)

  write_yaml(opts.output, cluster_spec.data)
}

const command = new Command()
  .description('Dumps an OpenSearch cluster\'s generated specification.')
  .addOption(new Option('--host <host>', 'cluster\'s host').default('localhost'))
  .addOption(new Option('--no-https', 'disable HTTPS'))
  .addOption(new Option('--insecure', 'disable SSL/TLS certificate verification').default(false))
  .addOption(new Option('--port <port>', 'cluster\'s port to connect to').default(9200))
  .addOption(new Option('--username <username>', 'username to authenticate with the cluster').default('admin'))
  .addOption(new Option('--password <password>', 'password to authenticate with the cluster').env('OPENSEARCH_PASSWORD'))
  .addOption(new Option('--output <path>', 'path to the output file').default(resolve(__dirname, '../../../build/opensearch-openapi-CLUSTER.yaml')))
  .allowExcessArguments(false)
  .parse()

main(command.opts())
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
