
export interface DbError extends Error {
  code: string;
  errno: number;
  sqlState: string;
  sqlMessage: string;
}

export function isDbError(err: any): err is DbError {
  return err.code && err.errno && err.sqlState && err.sqlMessage;
}
