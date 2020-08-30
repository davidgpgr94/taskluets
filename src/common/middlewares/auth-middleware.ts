import { Request, Response, NextFunction } from "express";

export function ensureIsNotAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (req.session && req.session.user) {
    return res.redirect('/');
  } else {
    return next();
  }
}

export function ensureIsAuthenticated(req: Request, res: Response, next: NextFunction) {
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
