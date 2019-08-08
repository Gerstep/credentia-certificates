import { injectable }                  from 'inversify';
import pino                       from 'pino';
import { LogFn, Logger as PinoLogger } from 'pino';

import env from '../environments/environment';

@injectable()
export class Logger {

  readonly logger: PinoLogger;

  constructor() {
    const stream = pino.destination(1);
    this.logger = pino(env.logger, stream);
  }

  error: LogFn = function() {
    // @ts-ignore
    this.logger.error.apply(this.logger, arguments);
  };

  warn: LogFn = function() {
    // @ts-ignore
    this.logger.warn.apply(this.logger, arguments);
  };

  info: LogFn = function() {
    // @ts-ignore
    this.logger.info.apply(this.logger, arguments);
  };

  debug: LogFn = function() {
    // @ts-ignore
    this.logger.debug.apply(this.logger, arguments);
  };
}
