/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("response_values", (table) => {
    table.uuid("id").primary();
    table.string("value").notNullable();
    table.uuid("response_id").references("id").inTable("responses");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("response_values");
};
