'use strict'

var columnNames = require('./../vars/column_names');

/**
 * @param {*} columnDesc
 */
var Column = function(columnDesc) {
    this.tableName = columnDesc[columnNames.table_name];
    this.name = columnDesc[columnNames.column_name];
    this.ordinalPosition = columnDesc[columnNames.ordinal_position];
    this.default = columnDesc[columnNames.column_default];
    this.isNullable = columnDesc[columnNames.is_nullable];
    this.dataType = columnDesc[columnNames.data_type];
    this.maxLength = columnDesc[columnNames.character_maximum_length];
    this.udtName = columnDesc[columnNames.udt_name];
    this.possibleValues = [];
    this.foreignKey = null;
}

Column.prototype.isEnum = function(){
    var result = false;
    if(this.dataType == 'USER-DEFINED'){
        result = true;;
    }

    return result;
}

module.exports = Column;