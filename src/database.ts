import { DBConfig } from './config';
import knex from 'knex';

const db = knex({
  client: 'mysql2',
  connection: {
    host: DBConfig.host,
    port: DBConfig.port,
    user: DBConfig.user,
    password: DBConfig.password,
    database: DBConfig.database
  },
  pool: {
    min: 0,
    max: 7
  }
});

export default db;
