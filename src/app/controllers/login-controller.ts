
import { Request, Response } from 'express';

import BaseController from "./base-controller";

import { validate, LOGIN_FORM_VALIDATIONS } from '../../common/validators';
import auth from '../../common/middlewares/auth-middleware';

class LoginController extends BaseController {

  constructor() {
    super('/login');
  }

  public initRoutes() {
    this._router.get(`${this.path}`, this.getLogin);
    this._router.post(`${this.path}`, validate(LOGIN_FORM_VALIDATIONS), this.login);
    this._router.post('/logout', auth, this.logout);
  }

  private login(req: Request, res: Response) {
    if (res.locals.errors) {
      return res.render('login');
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
    if (req.session && req.session.user) {
      res.redirect('/');
    } else {
      res.render('login');
    }
  }

}

export default LoginController;
