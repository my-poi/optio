var fs = require('fs')
var path = require('path')
var queryList = [];

class Query {
  constructor(name, sql) {
    this.name = name;
    this.sql = sql;
  }
}

module.exports = {
  generate: () => {
    queries = [
      'select-shifts',
      'select-shift-durations'
    ]
    
    queries.forEach(queryName => {
      const sql = fs.readFileSync(path.join(__dirname, 'sql/', queryName + '.sql'), 'utf8');
      queryList.push(new Query(queryName, sql));
    });
  },
  getSql: (name) => {
    return queryList.filter(query => query.name === name)[0].sql;
  }
}

