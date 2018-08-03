'use strict';
const Column = require('./column');

var Table = function (tableName) {
    this.columns = [];
    this.tableName = tableName;
};

Table.prototype.addColumn = function(column){
    this.columns.push(column);
}

module.exports = Table;