
import express, { Application as ExpressApp, NextFunction, Response, Request, Express } from 'express';
import * as path from 'path';
import logger from 'morgan';
import { json, urlencoded } from 'body-parser';
import exphbs from 'express-handlebars';
import sassMiddleware from 'node-sass-middleware';
import session from 'express-session';

import * as helpers from './app/helpers';

export class TasklueApp {

  private app: ExpressApp;

  constructor(config?: TasklueApp.Config) {
    this.app = express();
    this.setViewEngine();
    this.setupMiddlewares();
    this.setRoutes();
  }

  private setupMiddlewares() {
    this.app.use(logger('dev'));
    this.app.use(json());
    this.app.use(urlencoded({ extended: false }));
    this.app.use(sassMiddleware({
      src: path.join(__dirname, 'public'),
      dest: path.join(__dirname, 'public'),
      indentedSyntax: false, // true = .sass and false = .scss
      sourceMap: true
    }));
    this.app.use(express.static(path.join(__dirname, 'public')));
  }

  private setViewEngine() {
    this.app.set('views', path.join(__dirname, 'app/views'));
    this.app.set('view engine', 'hbs');
    this.app.engine('hbs', exphbs({
      defaultLayout: 'base',
      extname: 'hbs',
      layoutsDir: path.join(__dirname, 'app/views/layouts'),
      partialsDir: path.join(__dirname, 'app/views'),
      helpers: helpers
    }));

    if (process.env.NODE_ENV === 'production') {
      this.app.enable('view cache');
    }
  }

  private setRoutes() {
    this.app.get('/', (req, res) => {
      res.render('home');
    });
  }


  public get server(): ExpressApp {
    return this.app;
  }

}

namespace TasklueApp {
  export interface Config {
    port?: number;
  }
}
