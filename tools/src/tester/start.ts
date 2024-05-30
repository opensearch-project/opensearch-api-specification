import OpenApiMerger from '../merger/OpenApiMerger'
import { LogLevel } from '../Logger'
import TestsRunner from './TestsRunner'
import { Command, Option } from '@commander-js/extra-typings'
import _ from 'lodash'

const command = new Command()
  .description('Run test stories against the OpenSearch spec.')
  .addOption(new Option('--spec, --spec-path <path>', 'path to the root folder of the multi-file spec').default('./spec'))
  .addOption(new Option('--tests, --tests-path <path>', 'path to the root folder of the tests').default('./tests'))
  .addOption(new Option('--tab-size <size>', 'tab size for displayed results').default('4'))
  .addOption(new Option('--verbose', 'whether to print the full stack trace of errors'))
  .allowExcessArguments(false)
  .parse()

const opts = command.opts()
const display_options = {
  verbose: opts.verbose ?? false,
  tab_size: Number.parseInt(opts.tabSize)
}
const spec = (new OpenApiMerger(opts.specPath, LogLevel.error)).merge()
const runner = new TestsRunner(spec, opts.testsPath, display_options)
void runner.run().then(() => { _.noop() })
