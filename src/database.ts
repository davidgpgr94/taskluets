import { DBConfig } from './config';
import knex from 'knex';

const db = knex({
  client: 'mysql2',
  connection: {
    host: DBConfig.host,
    port: DBConfig.port,
    user: DBConfig.user,
    password: DBConfig.password,
    database: DBConfig.database,
    typeCast: function(field: any, next: any) {
      if (field.type == 'TINY' && field.length == 1) {
        const value = field.string();
        return value ? (value == '1') : null;
      }
      return next();
    }
  },
  pool: {
    min: 0,
    max: 7
  }
});

export default db;
