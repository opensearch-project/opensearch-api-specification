import SpecValidator from "./SpecValidator";


const validator = new SpecValidator('../spec');
const errors = validator.validate();
errors.forEach(e => console.error(e));
console.log('\nTotal errors:', errors.length)