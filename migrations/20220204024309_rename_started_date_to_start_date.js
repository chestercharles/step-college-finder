/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.alterTable("assessments", (table) => {
    table.dropColumn("started_date");
    table.timestamp("start_date");
    table.dropColumn("completed_date");
    table.timestamp("complete_date");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  table.dropColumn("start_date");
  table.timestamp("started_date");
  table.dropColumn("complete_date");
  table.timestamp("completed_date");
};
