
import { DuplicatedEntryError } from './duplicated-entry-error';
import { UnknownColumnError } from './unknown-column-error';
import { UnexpectedError } from './unexpected-error';

type ErrorsList = {
  default: any;
  [code: string]: any;
}

export const DB_ERRORS: ErrorsList = {
  "1062": DuplicatedEntryError,
  "1054": UnknownColumnError,
  default: UnexpectedError
}
