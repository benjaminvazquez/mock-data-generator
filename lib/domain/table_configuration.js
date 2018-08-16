'use strict';

/**
 * @param {object} configuration
 */
var TableConfiguration = function (configuration) {
    this.tableName = configuration.table_name;
    this.generateData = configuration.generate_data === undefined ? true : configuration.generate_data;
    this.maxRegistries = configuration.max_number_registries || 0;
};

module.exports = TableConfiguration;
