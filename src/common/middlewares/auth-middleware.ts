import { Request, Response, NextFunction } from "express";

function ensureIsAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (!req.session) {
    return res.redirect('/login');
  } else {
    if (!req.session.user) {
      return res.redirect('/login');
    } else {
      res.locals.user = req.session.user;
      return next();
    }
  }
}

export default ensureIsAuthenticated;
