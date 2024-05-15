import OpenApiMerger from '../merger/OpenApiMerger'
import { LogLevel } from '../Logger'
import TestsRunner from './TestsRunner'
import { Command, Option } from '@commander-js/extra-typings'
import _ from 'lodash'

const command = new Command()
  .description('Run test stories against the OpenSearch spec.')
  .addOption(new Option('--spec, --spec_path <path>', 'path to the root folder of the multi-file spec').default('./spec'))
  .addOption(new Option('--tests, --tests_path <path>', 'path to the root folder of the tests').default('./tests'))
  .addOption(new Option('--tab_size <size>', 'tab size for displayed results').default('4'))
  .addOption(new Option('--verbose', 'whether to print the full stack trace of errors'))
  .allowExcessArguments(false)
  .parse()

const opts = command.opts()
const display_options = {
  verbose: opts.verbose ?? false,
  tab_size: Number.parseInt(opts.tab_size)
}
const spec = (new OpenApiMerger(opts.spec_path, LogLevel.error)).merge()
const runner = new TestsRunner(spec, opts.tests_path, display_options)
void runner.run().then(() => { _.noop() })
