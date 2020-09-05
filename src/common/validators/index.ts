import { ValidationChain, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export * from './login-form-validations';
export * from './signup-form-validations';

export function validate(validations: Array<ValidationChain>) {
  return async (req: Request, res: Response, next: NextFunction) => {
    await Promise.all(validations.map(validation => validation.run(req)));
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }
    res.locals.validationErrors = errors.mapped();
    return next();
  }
}
