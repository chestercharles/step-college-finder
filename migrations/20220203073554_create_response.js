/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("responses", (table) => {
    table.uuid("id").primary();
    table.uuid("assessment_id").references("id").inTable("assessments");
    table.uuid("attribute_id").references("id").inTable("attributes");
    table.boolean("skipped").notNullable();
    table.timestamp("created_date");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("responses");
};
