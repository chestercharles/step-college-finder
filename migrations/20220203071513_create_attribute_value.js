/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("attribute_values", (table) => {
    table.uuid("id").primary();
    table.string("value").notNullable();
    table.uuid("attribute_id").references("id").inTable("attributes");
    table.uuid("college_id").references("id").inTable("colleges");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("attribute_values");
};
