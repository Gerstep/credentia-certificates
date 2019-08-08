import bodyParser                                   from 'body-parser';
import Boom                                         from 'boom';
import mongoStoreFactory                            from 'connect-mongo';
import cors                                         from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import session                                      from 'express-session';
import http                                         from 'http';
import { injectable }                               from 'inversify';
import { InversifyExpressServer }                   from 'inversify-express-utils';
import { AddressInfo }                              from 'net';
import stoppable                                    from 'stoppable';
import i18next                                      from 'i18next';
import Backend                                      from 'i18next-node-fs-backend';
import i18nextMiddleware                            from 'i18next-express-middleware';
// @ts-ignore
import sendpulse                                    from 'sendpulse-api';

import env               from './environments/environment';
import { ErrorMessages } from './errors';
import { container }     from './inversify.config';
import { Database }      from './services/Database';
import { Logger }        from './services/Logger';
import { CustomAuthProvider } from './utils/auth';

// import compression from 'compression';

@injectable()
export class Application {
  app!: express.Application;
  readonly expressApp: express.Express;
  readonly httpServer: stoppable.StoppableServer;
  readonly iocServer: InversifyExpressServer;

  constructor(private logger: Logger, private database: Database) {
    const expressApp: express.Express = express();
    const httpServer = stoppable(http.createServer());
    const iocServer = new InversifyExpressServer(container, null,
      { rootPath: '/api' }, expressApp, CustomAuthProvider
    );

    this.expressApp = expressApp;
    this.iocServer = iocServer;
    this.httpServer = httpServer;
  }

  start = async () => {
    await this.database.listen();

    await this.setMiddlewares();

    this.app = this.iocServer.build();
    this.httpServer.on('request', this.app);

    this.httpServer.on('listening', () => {
      const {address} = <AddressInfo>this.httpServer.address();

      this.logger.info(`Server started on ${address}:${env.port}`);
    });

    this.httpServer.on('error', (err: Error) => {
      this.logger.error(err, 'Error starting server');
    });

    this.httpServer.listen(env.port);
  };

  async stop(): Promise<void> {
    await this.database.close();

    return new Promise(res => {
      this.httpServer.stop(() => {
        res();
      });
    });
  }

  private async setMiddlewares() {
    const app = this.expressApp;

    sendpulse.init(env.email.apiUserId, env.email.apiSecret, env.email.tokenStoragePath);

    await i18next
      .use(Backend)
      .use(i18nextMiddleware.LanguageDetector)
      .init(<i18next.InitOptions>env.i18next);

    const MongoStore = mongoStoreFactory(session);

    const sessionOptions = Object.assign({}, env.session, {
      store: new MongoStore({
        mongooseConnection: this.database.getConnection(),
        ttl: 14 * 24 * 60 * 60 // save session 14 days
      })
    });

    app.use(i18nextMiddleware.handle(i18next));
    app.use(session(sessionOptions));
    // app.use(helmet(env.helmet));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(cors(env.cors));

    // tslint:disable-next-line:no-shadowed-variable
    this.iocServer.setErrorConfig((app: express.Application) => {
      // @ts-ignore
      app.use((err: Boom, req: Request, res: Response, _next: NextFunction) => {
        const boomError = Boom.isBoom(err) ? err : Boom.internal(ErrorMessages.Internal);

        if (err.isServer || !Boom.isBoom(err)) {
          this.logger.error(err);
        }

        return res.status(boomError.output.statusCode).json({status: 'error', ...boomError.output.payload});
      });
    });
  }
}
