'use strict'

const { Client } = require('pg');
var variables = require('./variables');

module.exports = {
    get: function(){
        const client = new Client(variables.connection_string);

        async function open(){
            await client.connect().then(function(ok){
                console.log('Connection success');
            }).catch(function(err){
                console.log('Connection error');
                console.log(err);
            });
        }

        async function queryResult(queryText, closeWhenFinish = true){
            var resultQuery = [];
            if(!client.readyForQuery){
                await open();
            }
            await client.query(queryText).then(
                function (result) {
                    resultQuery = result.rows;
                }).catch(
                function(err){
                    console.log(err);
                });
            if(closeWhenFinish){
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
            query: queryResult
        }
    }
};
