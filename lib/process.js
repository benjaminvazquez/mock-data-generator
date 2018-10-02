'use strict'
var connection = require('./connection').get();
var queries = require('./vars/queries');
var Column  = require('./domain/column');
var Table = require('./domain/table');
var ForeignKey = require('./domain/foreign_key');
const util = require('util');

(async function(){
    var tables = await extractTables();
    await extractAndSetForeignKeys(tables);
    await setEnumValues(tables);
    // console.log(util.inspect(tables, {showHidden: false, depth: null}));
})();

async function extractTables(){
    var descriptions = await connection.query(queries.table_description_query);
    var tables = {};
    for(var description of descriptions){
        let column = new Column(description);
        let tableName = column.tableName;
        tables[tableName] = (tables[tableName] || new Table(tableName));
        tables[tableName].addColumn(column);
    }
    return tables;
}

/**
 * @param {Object} tables
 */
async function extractAndSetForeignKeys(tables){
    var foreignKeysDescriptions = await connection.query(queries.table_constraints_query);
    for(var description of foreignKeysDescriptions){
        let foreignKey = new ForeignKey(description);
        let tableName = foreignKey.tableName;
        tables[tableName].addForeignKey(foreignKey);
    }
}

/**
 * @param {Object} tables
 */
async function setEnumValues(tables){
    for(var element of Object.keys(tables)) {
        await tables[element].fillEnums();
    }
}