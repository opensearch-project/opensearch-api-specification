import SpecValidator from './SpecValidator'

const root_folder = process.argv[2] || '../spec'
const validator = new SpecValidator(root_folder)
const errors = validator.validate()

if (errors.length === 0) {
  console.log('No errors found.')
  process.exit(0)
} else {
  console.log('Errors found:\n')
  errors.forEach(e => console.error(e))
  console.log('\nTotal errors:', errors.length)
  process.exit(1)
}
