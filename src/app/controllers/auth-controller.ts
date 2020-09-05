
import { Request, Response } from 'express';

import BaseController from "./base-controller";

import { validate, LOGIN_FORM_VALIDATIONS, SIGNUP_FORM_VALIDATIONS } from '../../common/validators';
import { ensureIsAuthenticated, ensureIsNotAuthenticated } from '../../common/middlewares/auth-middleware';
import { User } from '../models/user';

import UserRepository from '../models/repositories/user-repository';

class AuthController extends BaseController {

  private userRepository: UserRepository;

  constructor() {
    super('/login');
    this.userRepository = new UserRepository();
  }

  public initRoutes() {
    this._router.get(`${this.path}`, ensureIsNotAuthenticated, this.getLogin);
    this._router.post(`${this.path}`, validate(LOGIN_FORM_VALIDATIONS), this.login.bind(this));
    this._router.post('/logout', ensureIsAuthenticated, this.logout);
    this._router.get('/signup', ensureIsNotAuthenticated, this.getSignup);
    this._router.post('/signup', validate(SIGNUP_FORM_VALIDATIONS), ensureIsNotAuthenticated, this.signup);
  }

  private async login(req: Request, res: Response) {
    if (res.locals.validationErrors) {
      return res.render('auth/login', {inputs: req.body});
    } else {
      const user: User|undefined = await this.userRepository.findOne({
        email: req.body.email
      });
      // TODO: el comparePassword falla porque userRepostory.findOne no devuelve un objeto User, sino que
      // devuelve un JSON con los valores de la columnas de la tabla User
      if (user && user.comparePassword(req.body.password)) {
        req.session!.user = user;
        res.redirect('/');
      } else {
        res.render('auth/login', {
          validationErrors: {
            email: {msg: 'Email no válido.'},
            password: {msg: 'Contraseña no válida.'}
          },
          inputs: {
            email: req.body.email
          }
        });
      }
    }
  }

  private logout(req: Request, res: Response) {
    if (req.session && req.session.user) {
      req.session.destroy((err) => {
        if (err) {
          res.render('error', {message: 'Fail at logout, try it again.', error: {status: 500}});
        } else {
          res.redirect('/login');
        }
      });
    } else {
      res.redirect('/login');
    }
  }

  private getLogin(req: Request, res: Response) {
    res.render('auth/login');
  }

  private getSignup(req: Request, res: Response) {
    res.render('auth/signup');
  }

  private async signup(req: Request, res: Response) {
    if (res.locals.validationErrors) {
      return res.render('auth/signup', {inputs: req.body});
    } else {
      const user = new User(
        req.body.login,
        req.body.email,
        req.body.password
      );
      try {
        await user.save();
        return res.redirect('/login');
      } catch (e) {
        res.locals.errors = [e];
        return res.render('auth/signup');
      }
    }
  }

}

export default AuthController;
