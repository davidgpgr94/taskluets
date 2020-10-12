
export class UnexpectedError extends Error {
  constructor(msg?: string) {
    super(msg || 'Unexpected db error');
  }
}
