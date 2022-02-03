import knex, { Knex } from "knex";

let client: Knex;

export default function getDbClient() {
  if (!client) {
    if (process.env.NODE_ENV === "production") {
      client = knex({
        client: "pg",
        connection: process.env.CONNECTION,
        pool: {
          min: 2,
          max: 10,
        },
      });
    } else {
      const [projectRoot] = __dirname.split("build");
      client = knex({
        client: "better-sqlite3",
        connection: {
          filename: `${projectRoot}/dev.sqlite3`,
        },
      });
    }
  }

  return client;
}
