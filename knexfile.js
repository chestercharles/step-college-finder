console.log("connection is", process.env.CONNECTION);
/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
  development: {
    client: "better-sqlite3",
    connection: {
      filename: "./dev.sqlite3",
    },
    migrations: {
      tableName: "knex_migrations",
    },
    useNullAsDefault: true,
  },

  production: {
    client: "postgresql",
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
    migrations: {
      tableName: "knex_migrations",
    },
  },
};
