
import { Request, Response } from 'express';

import BaseController from "./base-controller";

import { validate, LOGIN_FORM_VALIDATIONS } from '../../common/validators';
import { ensureIsAuthenticated, ensureIsNotAuthenticated } from '../../common/middlewares/auth-middleware';

class AuthController extends BaseController {

  constructor() {
    super('/login');
  }

  public initRoutes() {
    this._router.get(`${this.path}`, ensureIsNotAuthenticated, this.getLogin);
    this._router.post(`${this.path}`, validate(LOGIN_FORM_VALIDATIONS), this.login);
    this._router.post('/logout', ensureIsAuthenticated, this.logout);
    this._router.get('/signup', ensureIsNotAuthenticated, this.getSignup);
    this._router.post('/signup', ensureIsNotAuthenticated, this.signup);
  }

  private login(req: Request, res: Response) {
    if (res.locals.errors) {
      return res.render('auth/login');
    } else {
      const user = {
        email: 'davidgpgr94@gmail.com',
        login: 'dgonzalez'
      };
      req.session!.user = user;
      res.redirect('/');
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

  private signup(req: Request, res: Response) {
    res.send({ok: 'ok'});
  }

}

export default AuthController;
