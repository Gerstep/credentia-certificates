// import 'express-async-errors';
import 'reflect-metadata';
import 'marko/node-require';

import bluebird from 'bluebird';
global.Promise = bluebird;

import env from './environments/environment';
import { container }   from './inversify.config';
import { Application } from './app';
import { Logger }      from './services/Logger';

const app = container.resolve<Application>(Application);
const logger = container.resolve<Logger>(Logger);

// @ts-ignore
process.on('uncaughtException', (err: Error, origin: string) => {
  (<any>err).origin = origin;

  logger.error(err);
  process.exit(1);
});

// The 'unhandledRejection' event is emitted whenever a Promise is rejected
// and no error handler is attached to the promise within a turn of the event loop
process.on('unhandledRejection', (err: any, promise) => {
  if (err) {
    if (typeof err === 'string') {
      logger.error({
        message: err,
        promise
      });
    } else {
      (<any>err).promise = promise;
      logger.error(err);
    }
  }
});

const gracefulShutdown = async () => {
  try {
    logger.info('Server is shutting down...');
    await app.stop();
    logger.info('Successful graceful shutdown');
    process.exit(0);
  } catch (err) {
    logger.error(err);
    process.exit(1);
  }
};

if (env.env !== 'local') {
  process.on('SIGINT', gracefulShutdown);
  process.on('SIGTERM', gracefulShutdown);
}

app.start();
