module.exports = {
    table_description_query: `select
                                table_name,
                                column_name,
                                ordinal_position,
                                column_default,
                                is_nullable,
                                data_type,
                                character_maximum_length
                            from
                                INFORMATION_SCHEMA.COLUMNS
                            where
                                table_schema = 'public'`
};