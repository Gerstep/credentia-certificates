import { BaseMiddleware }                  from 'inversify-express-utils';
import { injectable }                      from 'inversify';
import { Request, Response, NextFunction } from 'express';
import Boom                                from 'boom';

import { ErrorMessages }                   from '../errors';

@injectable()
export class AuthMiddleware extends BaseMiddleware {
  handler(
    _req: Request,
    _res: Response,
    next: NextFunction
  ) {
    this.httpContext.user.isAuthenticated()
      .then(isAuthenticated => {
        if (isAuthenticated) {
          next();
        } else {
          next(Boom.unauthorized(ErrorMessages.NotAuthenticated));
        }
      });
  }
}
