'use strict';

var ForeignKey = require('./foreign_key');
var Column = require('./column');
var connection = require('../connection').get();
var queries = require('../vars/queries');
var TableConfiguration = require('./table_configuration');

/**
 * @param {string} tableName
 * @param {TableConfiguration} configuration
 */
var Table = function (tableName, conf) {
    this.hasDependency = false;
    this.name = tableName;
    this.columns = [];
    this.dependencyTables = [];
    this.configuration = conf || getDefaultConfiguration(tableName);
};

/**
 * @param {string} tableName
 */
function getDefaultConfiguration(tableName){
    return new TableConfiguration({
        table_name: tableName
    });
}

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
        columnEnum.possibleValues = await getEnumValues(columnEnum.udtName);
        columnEnum.default = await getEnumDefault(columnEnum.default);
    }
}

/**
 * @param {string} columnName
 */
async function getEnumValues(columnName){
    var values = await connection.queryParams(queries.enum_range_query, [columnName]);
    var result = [];
    values.reduce(function(prev, curr){
        return result.push(curr['enumname']);
    }, '');
    return result;
}

async function getEnumDefault(defaultDescription){
    var result = '';
    var values = await connection.queryParams(queries.enum_default, [defaultDescription]);
    var firstOcurrence = values[0];
    if(firstOcurrence){
        result = firstOcurrence['enumvalue'];
    }
    return result;
}

module.exports = Table;