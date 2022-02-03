import knex, { Knex } from "knex";

let client: Knex;

export default function getDbClient() {
  if (!client) {
    if (process.env.NODE_ENV === "production") {
      client = knex({
        client: "pg",
        connection: {
          user: process.env.PGUSER,
          password: process.env.PGPASSWORD,
          host: process.env.PGHOST,
          database: process.env.PGDATABASE,
          port: Number(process.env.PGPORT),
          ssl: {
            rejectUnauthorized: false,
            ca: process.env.CACERT,
          },
        },
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
