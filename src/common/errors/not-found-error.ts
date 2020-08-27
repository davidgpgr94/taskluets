import { HttpError } from "./http-error";

export class NotFoundError extends HttpError {
  constructor(msg?: string) {
    super(404, msg || 'Not found');
  }
}
