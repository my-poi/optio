"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path = require("path");
var query_1 = require("./objects/query");
var Queries = /** @class */ (function () {
    function Queries() {
        this.list = [];
    }
    Queries.prototype.generate = function () {
        var _this = this;
        var queries = [
            'select-shifts',
            'select-shift-durations'
        ];
        queries.forEach(function (queryName) {
            var sql = fs.readFileSync(path.join(__dirname, 'sql/', queryName + '.sql'), 'utf8');
            _this.list.push(new query_1.Query(queryName, sql));
        });
    };
    Queries.prototype.getSql = function (name) {
        var result = this.list.filter(function (query) { return query.name === name; })[0].sql;
        return result;
    };
    return Queries;
}());
exports.Queries = Queries;
//# sourceMappingURL=queries.js.map