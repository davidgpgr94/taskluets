
import { body, ValidationChain } from 'express-validator';

export const LOGIN_FORM_VALIDATIONS: Array<ValidationChain> = [
  body('email').isEmail().withMessage('Email no válido').normalizeEmail(),
  body('password').notEmpty().withMessage('Contraseña no válida')
];
