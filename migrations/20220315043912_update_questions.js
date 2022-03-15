/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.alterTable("questions", (table) => {
    table.string("exclude_value").defaultTo("");
    table.string("match_value").defaultTo("");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.alterTable("questions", (table) => {
    table.dropColumn("exclude_value");
    table.dropColumn("match_value");
  });
};
