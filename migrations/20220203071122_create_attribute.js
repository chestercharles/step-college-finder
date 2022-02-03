/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("attributes", (table) => {
    table.uuid("id").primary();
    table.string("name").notNullable();
    table.boolean("is_boolean").notNullable();
    table.boolean("exclusive").notNullable();
    table.string("skip_value");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("attributes");
};
