import { injectable } from 'inversify';
import uuidv4         from 'uuid/v4';
import randomStr from 'crypto-random-string';
import argon          from 'argon2';
import Boom from 'boom';

import { IUser, IUserDocument, User, UserStatus, UserType } from '../models/user';
import { ILink, Link }                                      from '../models/link';
import { Email }                                            from '../services/Email';
import { Logger }                                           from '../services/Logger';
import { ICreateUserParams, IGetUserParams }                from '../interfaces/domains';
import { EmailErrorMessages, UserErrorMessages }            from '../errors';
import env                                                  from '../environments/environment';
import { SmartContract }                                    from '../services/SmartContract';

@injectable()
export class UserDomain {
  constructor(private logger: Logger, private emailService: Email, private smartContract: SmartContract) {}

  async getUser(params: IGetUserParams): Promise<IUserDocument> {
    const { id } = params;
    let user: IUserDocument | null;

    if (id) {
      user = await User.findById(id);
    }

    return user!;
  }

  async getIssuerUsers(issuerId: string): Promise<IUser[]> {
    return User.find({issuerIds: issuerId, type: UserType.Student }).lean().exec();
  }

  async createUser(params: ICreateUserParams): Promise<IUserDocument> {
    const { email, name, surname, issuerId, birthDate, userType, lang, domain } = params;
    let password = params.password;
    const uuid = uuidv4();
    let existingUser: IUserDocument | null;
    let newUser: IUserDocument;

    existingUser = await User.findOne({email});

    switch (userType) {
      case UserType.Student: {
        if (existingUser) {
          return existingUser.update({
            $push: {
              issuerIds: issuerId
            }
          });
        }
        password = randomStr({
          length: 10,
          type: 'base64'
        });
        break;
      }
      case UserType.IssuerAmbassador: {
        if (existingUser) {
          throw Boom.badRequest(UserErrorMessages.AlreadyExist);
        }
        break;
      }
    }

    const hash = await argon.hash(password!);

    newUser = await User.create({
      email,
      password: hash,
      name,
      surname,
      issuerIds: [issuerId],
      birthDate,
      type: userType,
      status: UserStatus.Unverified
    });

    await Link.create({
      userId: newUser!.id,
      code: uuid
    });

    if (env.env !== 'local') {
      const sendEmail = await this.emailService.sendSignupEmail({
        uuid,
        password,
        userType,
        fullName: `${name} ${surname}`,
        email,
        lang,
        domain
      });

      if (!sendEmail.result) {
        throw Boom.internal(EmailErrorMessages.EmailProviderError);
      }
    } else {
      this.logger.info(`Confirmation link: ${domain}${env.email.confirmUrl}${uuid}`);
      this.logger.info(`Password: ${password}`);
    }

    return newUser!;
  }

  async login(email: string, password: string) {
    const user: IUser = await User.findOne({email}).lean();

    if (!user) {
      throw Boom.badRequest(UserErrorMessages.InvalidEmailPassword);
    }

    const match = await argon.verify(user.password, password);

    if (!match) {
      throw Boom.badRequest(UserErrorMessages.InvalidEmailPassword);
    }

    return user;
  }

  async checkUserConfirmationLink(code: string) {
    const link: ILink = await Link.findOneAndDelete({
      code
    }).lean();
    const now = Date.now();

    if (!link) {
      return false;
    }

    if (now - link.createdAt.getTime() > env.confLinkMaxAge) {
      return false;
    } else {
      const wallet = this.smartContract.createAccount();
      await User.findOneAndUpdate({_id: link.userId}, {
        status: UserStatus.Active,
        hash: wallet.address,
        privateKey: wallet.privateKey
      });

      return true;
    }
  }
}
