'use strict'

const { Client } = require('pg');
var variables = require('./variables');

module.exports = {
    get: function(){
        var client;

        async function open(){
            client = new Client(variables.connection_string);
            await client.connect().catch(function(err){
                console.log('Connection error');
                console.log(err);
            });
        }

        async function queryResult(queryText, manageConnection = true){
            var resultQuery = [];
            if(manageConnection){
                await open();
            }
            await client.query(queryText).then(
                function (result) {
                    resultQuery = result.rows;
                }).catch(
                function(err){
                    console.log(err);
                });
            if(manageConnection){
                await close();
            }

            return resultQuery;
        }

        /**
         * @param {string} queryText
         * @param {Array} params
         * @param {boolean} manageConnection
         */
        async function queryResultParams(queryText, params, manageConnection = true){
            for(let i = 0; i < params.length; i++){
                let str = '%param'+i+'%';
                queryText = queryText.replace(str, params[i]);
            }
            return await queryResult(queryText, manageConnection);
        }

        async function close(){
            await client.end().catch(function(err){
                    console.log('Ocurrió un error al cerrar la conexión: %s', err);
                    console.log(err);
                }
            );
        }

        return {
            open:  open,
            close: close,
            query: queryResult,
            queryParams: queryResultParams
        }
    }
};
