import { Router } from "express";


abstract class BaseController {

  protected _router: Router;
  public path: string;

  constructor(basePath: string) {
    this.path = basePath;
    this._router = Router();
    this.initRoutes();
  }

  public get router(): Router {
    return this._router;
  }

  protected abstract initRoutes(): void;
}

export default BaseController;
