
export class HttpError extends Error {

  public status: number;

  constructor(status: number, msg: string) {
    super(msg);
    this.status = status;
  }
}
