/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.renameTable("attributes", "questions");
  await knex.schema.alterTable("attribute_values", (table) => {
    table.renameColumn("attribute_id", "question_id");
  });
  await knex.schema.alterTable("responses", (table) => {
    table.renameColumn("attribute_id", "question_id");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {};
