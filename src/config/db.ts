require('dotenv').config();

const Config: {[key: string]: DBConfigVariables} = {
  production: {
    host: (process.env.DB_HOST as string),
    port: parseInt(process.env.DB_PORT as string),
    user: (process.env.DB_USER as string),
    password: (process.env.DB_PWD as string),
    database: (process.env.DB_NAME as string)
  },
  development: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT as string) || 3306,
    user: process.env.DB_USER || 'tasklue',
    password: process.env.DB_PWD || 'taskluepwd',
    database: process.env.DB_NAME || 'tasklue'
  },
  test: {
    host: process.env.DB_TEST_HOST || 'localhost',
    port: parseInt(process.env.DB_TEST_PORT as string) || 3306,
    user: process.env.DB_TEST_USER || 'tasklue_test',
    password: process.env.DB_TEST_PWD || '123456',
    database: process.env.DB_TEST_NAME || 'tasklue_test'
  },
}

interface DBConfigVariables {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
}

export const DBConfig = Config[process.env.NODE_ENV as string];
