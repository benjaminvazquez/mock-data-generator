'use strict'

var columnNames = require('./column_names');

var Column = function(columnDesc) {
    this.tableName = columnDesc[columnNames.table_name];
    this.columnName = columnDesc[columnNames.column_name];
    this.ordinalPosition = columnDesc[columnNames.ordinal_position];
    this.columnDefault = columnDesc[columnNames.column_default];
    this.isNullable = columnDesc[columnNames.is_nullable];
    this.dataType = columnDesc[columnNames.data_type];
    this.maxLength = columnDesc[columnNames.character_maximum_length];
}

module.exports = Column;