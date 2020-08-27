
import express, { Application as ExpressApp, NextFunction, Response, Request, Express } from 'express';
import * as path from 'path';
import logger from 'morgan';
import { json, urlencoded } from 'body-parser';
import exphbs from 'express-handlebars';
import sassMiddleware from 'node-sass-middleware';
import session, { SessionOptions } from 'express-session';
import connectSessionKnex from 'connect-session-knex';
import csurf from 'csurf';

import * as helpers from './app/helpers';
import CONTROLLERS from './app/controllers/index';
import { NotFoundError, HttpError } from './common/errors';
import db from './database';

export class TasklueApp {

  private app: ExpressApp;
  private port: number;

  constructor(config: TasklueApp.Config) {
    this.app = express();
    this.port = config.port || parseInt(process.env.APP_PORT || '3000');
    this.setViewEngine();
    this.setupMiddlewares();
    this.setupStatics();
    this.setRoutes();
    this.set404();
    this.setHandlerError();
  }

  private setupMiddlewares() {
    this.app.use(logger('dev'));
    this.app.use(json());
    this.app.use(urlencoded({ extended: false }));
    this.setupSession();
    this.app.use(sassMiddleware({
      src: path.join(__dirname, 'public'),
      dest: path.join(__dirname, 'public'),
      indentedSyntax: false, // true = .sass and false = .scss
      sourceMap: true
    }));
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      res.locals.csrfToken = req.csrfToken;
      next();
    });
  }

  private setupSession() {
    const KnexSessionStore = connectSessionKnex(session);
    const store = new KnexSessionStore({
      knex: db,
      tablename: 'sessions'
    });
    let sess: SessionOptions = {
      name: 'my-session',
      secret: process.env.SESSION_SECRET || 'my-awesome-secret-key',
      store: store,
      resave: false,
      saveUninitialized: false,
      cookie: {}
    };
    this.app.use(session(sess));
    this.app.use(csurf({sessionKey: 'session'}));
  }

  private setupStatics() {
    this.app.use(express.static(path.join(__dirname, 'public')));
    this.app.use('/js', express.static(path.join(__dirname, '../node_modules/jquery/dist')));
    this.app.use('/js', express.static(path.join(__dirname, '../node_modules/@popperjs/core/dist/umd')))
    this.app.use('/js', express.static(path.join(__dirname, '../node_modules/bootstrap/dist/js')));
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
    CONTROLLERS.forEach(c => {
      this.app.use('/', c.router)
    });
  }

  private set404() {
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      let err: HttpError = new NotFoundError();
      next(err);
    });
  }

  private setHandlerError() {
    this.app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
      let data: {message: string, status: number} = {
        message: err.message,
        status: err.status
      };
      if (process.env.NODE_ENV === 'development') {
        // console.error(err);
      }
      res.status(err.status || 500);
      res.render('error', { data });
    });
  }

  public listen(): void {
    this.app.listen(this.port, (err) => {
      if (err) {
        console.error(err);
        process.exit(1);
      }
      console.log(`TasklueApp running on port ${this.port}`);
    });
  }

}

namespace TasklueApp {
  export interface Config {
    port?: number;
  }
}
