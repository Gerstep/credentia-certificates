import { inject, injectable }              from 'inversify';
import { NextFunction, Request, Response } from 'express';
import { interfaces }                      from 'inversify-express-utils';

import { UserDomain }      from '../domains/User';
import { IUser, UserType } from '../models/user';

class Principal implements interfaces.Principal {
  details: IUser;

  constructor(details: any) {
    this.details = details;
  }

  isAuthenticated(): Promise<boolean> {
    return Promise.resolve(Boolean(this.details._id));
  }

  isResourceOwner(): Promise<boolean> {
    throw new Error('Not implemented');
  }

  isInRole(role: UserType): Promise<boolean> {
    const userRole = this.details.type;

    return Promise.resolve(role === userRole);
  }
}

@injectable()
export class CustomAuthProvider implements interfaces.AuthProvider {

  @inject(UserDomain) private userDomain!: UserDomain;

  async getUser(
    req: Request,
    _res: Response,
    _next: NextFunction
  ): Promise<interfaces.Principal> {
    const session = req.session!;
    let principal;

    if (session.userId) {
      const user = await this.userDomain.getUser({id: session.userId});
      principal = new Principal(user);
    } else {
      principal = new Principal({});
    }

    return principal;
  }
}
