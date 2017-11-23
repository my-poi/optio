var queries = require('./queries');

queries.generate();
var test = queries.getSql('select-shifts');
console.log(test);
