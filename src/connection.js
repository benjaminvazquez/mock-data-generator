'use strict'

const { Client } = require('pg');
var variables = require('./variables');

module.exports = {
    get: function(){
        var client;

        async function open(){
            client = new Client(variables.connection_string);
            await client.connect().then(function(ok){
                console.log('Connection success');
            }).catch(function(err){
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

        async function queryResultParams(queryText, params, manageConnection = true){
            var resultQuery = [];
            if(manageConnection){
                await open();
            }
            await client.query(queryText,...params).then(
                function (result) {
                    resultQuery = result.rows;
                }).catch(
                function (err) {
                    console.log(err);
                });
            if(manageConnection){
                await close();
            }

            return resultQuery;
        }

        async function close(){
            await client.end().then(
                function (ok){
                    console.log('Connection closed');
                },
                function(err){
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
