
import { isDbError } from './db-error';
import { DB_ERRORS } from '.';


export function handleDbError(err: any) {
  if (isDbError(err)) {
    return createError(err.errno, err.sqlMessage);
  } else {
    return err;
  }
}

function createError(code: number, msg: string) {
  const error = DB_ERRORS[code.toString()] || DB_ERRORS.default;
  return new error(msg);
}
