import { Queries } from './queries';
export {}

const queries = new Queries().generate();
const test = queries.getSql('select-shifts');
console.log(test);
