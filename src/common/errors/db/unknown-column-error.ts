
export class UnknownColumnError extends Error {
  constructor(msg?: string) {
    super(msg || 'Unknown column');
  }
}
