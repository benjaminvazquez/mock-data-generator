'use strict'
var connection = require('./connection').get();
var queries = require('./vars/queries');
var Column  = require('./domain/column');
var Table = require('./domain/table');
var ForeignKey = require('./domain/foreign_key');
var TableConfiguration = require('./domain/table_configuration');
var fs = require('fs');
var path = require('path');
const util = require('util');

(async function(){
    var configString = readConfigFile(path.resolve(__dirname + '/../configfile.json'));
    var configObject = transformConfiguration(configString);
    if(configObject){
        var configurations = processConfigurations(configObject);
        var tables = await extractTables(configurations);
        await extractAndSetForeignKeys(tables);
        await setEnumValues(tables);
        console.log(util.inspect(tables, {showHidden: false, depth: null}));
    }
})();

/**
 * @param {Array} configs
 */
function processConfigurations(configs){
    var allConfigs = {};
    for (let c of configs){
        let transformedConfig = new TableConfiguration(c);
        allConfigs[transformedConfig.tableName] = transformedConfig;
    }
    return allConfigs;
}

/**
 * @param {string} filePath
 */
function readConfigFile (filePath){
    var data;
    try{
        data = fs.readFileSync(filePath, 'utf8');
    }catch(err){
        console.log('An error ocurred trying to read the configuration file %s', err);
    }
    return data;
}

/**
 * @param {string} data
 */
function transformConfiguration(data){
    var obj;
    try{
        obj = JSON.parse(data);
    }catch(err){
        console.log('Incorrect config file format. %s', err);
    }
    return obj;
}

/**
 * @param {object} configurations
 */
async function extractTables(configurations){
    var descriptions = await connection.query(queries.table_description_query);
    var tables = {};
    for(var description of descriptions){
        let column = new Column(description);
        let tableName = column.tableName;
        tables[tableName] = (tables[tableName] || new Table(tableName, configurations[tableName]));
        tables[tableName].addColumn(column);
    }
    return tables;
}

/**
 * @param {Table[]} tables
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