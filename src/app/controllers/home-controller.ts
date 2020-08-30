import BaseController from "./base-controller";
import { Request, Response } from "express";

import { ensureIsAuthenticated } from '../../common/middlewares/auth-middleware';

class HomeController extends BaseController {

  constructor() {
    super('/');
  }

  public initRoutes() {
    this._router.get(`${this.path}`, ensureIsAuthenticated, this.getHome);
  }

  getHome(req: Request, res: Response) {
    res.render('home');
  }

}

export default HomeController;
