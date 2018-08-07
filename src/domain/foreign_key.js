'use strict'

var columnNames = require('./../vars/column_names');

/**
 * @param {*} description
 */
var ForeignKey = function (description) {
    this.constraintName = description[columnNames.constraint_name];
    this.tableName = description[columnNames.table_name];
    this.columnName = description[columnNames.column_name];
    this.foreignTableName = description[columnNames.foreign_table_name];
    this.foreignColumnName = description[columnNames.foreign_column_name];
}

module.exports = ForeignKey;