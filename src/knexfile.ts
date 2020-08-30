import { config as loadEnvs } from 'dotenv';
loadEnvs({ path: `../.env` });
import { DBConfig } from './config';

module.exports = {

  development: {
    client: "mysql2",
    connection: DBConfig,
    migrations: {
      directory: __dirname + '/knex/migrations',
      tableName: "knex_migrations"
    },
    seeds: {
      directory: __dirname + '/knex/seeds',
    }
  },

  staging: {
    client: "mysql2",
    connection: DBConfig,
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      directory: __dirname + '/knex/migrations',
      tableName: "knex_migrations"
    },
    seeds: {
      directory: __dirname + '/knex/seeds',
    }
  },

  production: {
    client: "mysql2",
    connection: DBConfig,
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      directory: __dirname + '/knex/migrations',
      tableName: "knex_migrations"
    },
    seeds: {
      directory: __dirname + '/knex/seeds',
    }
  }

};
