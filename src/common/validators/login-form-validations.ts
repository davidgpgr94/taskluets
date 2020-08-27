
import { body, ValidationChain } from 'express-validator';

export const LOGIN_FORM_VALIDATIONS: Array<ValidationChain> = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
];
