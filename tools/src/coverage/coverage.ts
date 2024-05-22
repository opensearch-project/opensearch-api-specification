import { Command, Option } from '@commander-js/extra-typings'
import CoverageCalculator from './CoverageCalculator'
import { resolve } from 'path'

const command = new Command()
  .description('Calculates the coverage of a specification against an OpenSearch clusters generated specification.')
  .addOption(new Option('--cluster <path>', 'path to the cluster\'s generated specification.').default(resolve(__dirname, '../../../build/opensearch-openapi-CLUSTER.yaml')))
  .addOption(new Option('--specification <path>', 'path to the specification to calculate coverage of.').default(resolve(__dirname, '../../../build/opensearch-openapi.yaml')))
  .addOption(new Option('-o, --output <path>', 'path to the output file.').default(resolve(__dirname, '../../../build/coverage.json')))
  .allowExcessArguments(false)
  .parse()

const opts = command.opts()
const calculator = new CoverageCalculator(opts.cluster, opts.specification, opts.output)
calculator.calculate()
