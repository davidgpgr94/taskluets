import { HttpError } from "./http-error";

export class BadRequestError extends HttpError {
  constructor(msg?: string) {
    super(400, msg || 'Bad request');
  }
}
