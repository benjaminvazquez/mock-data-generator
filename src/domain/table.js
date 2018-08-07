'use strict';

var ForeignKey = require('./foreign_key');
var Column = require('./column');
var connection = require('../connection').get();
var queries = require('../vars/queries');

/**
 * @param {string} tableName
 */
var Table = function (tableName) {
    this.hasDependency = false;
    this.name = tableName;
    this.columns = [];
    this.dependencyTables = [];
};

/**
 * @param {Column} column
 */
Table.prototype.addColumn = function (column) {
    this.columns.push(column);
};

/**
 * @param {ForeignKey} foreignKey
 */
Table.prototype.addForeignKey = function (foreignKey) {
    this.hasDependency = true;
    this.dependencyTables.push(foreignKey.foreignTableName);
    var column = this.columns.find(function (element){ return element.name === foreignKey.columnName;});
    if (column) {
        column.foreignKey = foreignKey;
    } else {
         console.log('Cannot find column %s. Foreign key %s not assigned', foreignKey.columnName, foreignKey.constraintName);
    }
};

Table.prototype.fillEnums = async function () {
    var columnsWithEnumType = this.columns.filter(
        function (col) {
            return col.isEnum();
        });
    for(var columnEnum of columnsWithEnumType){
        columnEnum.possibleValues = await setEnumValues(columnEnum.udtName);
    }
}

/**
 * @param {string} columnName
 */
async function setEnumValues(columnName){
    var result = [];
    var values = await connection.queryParams(queries.enum_range_query, [columnName]);
    console.log(values);
    return result;
}

module.exports = Table;