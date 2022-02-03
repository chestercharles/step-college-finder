/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("assessments", (table) => {
    table.uuid("id").primary();
    table.uuid("user_id").references("id").inTable("users");
    table.timestamp("started_date");
    table.timestamp("completed_date");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("assessments");
};
