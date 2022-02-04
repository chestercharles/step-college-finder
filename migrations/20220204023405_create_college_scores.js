/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("college_scores", (table) => {
    table.uuid("id").primary();
    table.integer("score").notNullable();
    table.uuid("college_id").references("id").inTable("colleges");
    table.uuid("assessment_id").references("id").inTable("assessments");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("response_values");
};
