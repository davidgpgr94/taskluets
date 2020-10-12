
export class DuplicatedEntryError extends Error {

  constructor(msg?: string) {
    super(msg || 'Duplicated entry');
  }

}
