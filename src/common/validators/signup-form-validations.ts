
import { body, ValidationChain } from 'express-validator';

export const SIGNUP_FORM_VALIDATIONS: Array<ValidationChain> = [
  body('login').notEmpty().isLength({min: 7, max: 7}),
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
  body('repeat_password').notEmpty().custom((value, { req }) => {
    if (value !== req.body.password) {
      return false;
    }
    return true;
  }).withMessage('Las contraseñas no coinciden')
]
