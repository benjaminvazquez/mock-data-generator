'use strict'
var connection = require('./connection').get();
var queries = require('./queries');
var Column  = require('./column');
var Table = require('./table');

(async function(){
    var descriptions = await connection.query(queries.table_description_query);
    var tables = extractTables(descriptions)

    console.log(tables);
})();

function extractTables(descriptions){
    var tables = {};
    for(var description of descriptions){
        let tableName = description["table_name"];
        let column = new Column(description);
        tables[tableName] = (tables[tableName] || new Table(tableName));
        tables[tableName].addColumn(column);
    }
    return tables;
}