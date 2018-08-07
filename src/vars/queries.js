module.exports = {
    table_description_query: `select
                                table_name,
                                column_name,
                                ordinal_position,
                                column_default,
                                is_nullable,
                                data_type,
                                character_maximum_length,
                                udt_name
                            from
                                INFORMATION_SCHEMA.COLUMNS
                            where
                                table_schema = 'public'`,
    table_constraints_query: `  SELECT
                                    tc.table_schema,
                                    tc.constraint_name,
                                    tc.table_name,
                                    kcu.column_name,
                                    ccu.table_schema AS foreign_table_schema,
                                    ccu.table_name AS foreign_table_name,
                                    ccu.column_name AS foreign_column_name
                                FROM
                                    information_schema.table_constraints AS tc
                                    JOIN information_schema.key_column_usage AS kcu
                                    ON tc.constraint_name = kcu.constraint_name
                                    AND tc.table_schema = kcu.table_schema
                                    JOIN information_schema.constraint_column_usage AS ccu
                                    ON ccu.constraint_name = tc.constraint_name
                                    AND ccu.table_schema = tc.table_schema
                                WHERE constraint_type = 'FOREIGN KEY'
                            `,
    enum_range_query: `SELECT unnest(enum_range(NULL::$1)) `
};