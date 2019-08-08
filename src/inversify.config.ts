import { Container } from 'inversify';

import { Application } from './app';

import { UserDomain }                    from './domains/User';
import { CourseDomain }                  from './domains/Course';
import { IssuerDomain }                  from './domains/Issuer';
import { CertificateDomain }             from './domains/Certificate';
import { CredentialSubjectDomain }       from './domains/CredentialSubject';
import { CredentialSubjectDetailDomain } from './domains/CredentialSubjectDetail';

import { CertTemplateDomain } from './domains/CertTemplate';
import { CertItemDomain } from './domains/CertItem';
import { CertRelDomain } from './domains/CertRel';

import { Database } from './services/Database';
import { Logger }   from './services/Logger';
import { Email }    from './services/Email';
import { SmartContract }  from './services/SmartContract';

import { AuthMiddleware } from './middlewares/auth';
// declare metadata by @controller annotation
import './controllers/AuthController';
import './controllers/IssuerController';
import './controllers/UserController';
import './controllers/CertificateController';
import './controllers/CredentialSubjectController';
import './controllers/CredentialSubjectDetailController';
import './controllers/CourseController';
import './controllers/StudentController';

import './controllers/CertTemplateController';
import './controllers/CertItemController';
import './controllers/CertRelController';
// test
import './controllers/TestController';

const container = new Container();

container.bind<Logger>(Logger).to(Logger);
container.bind<Email>(Email).to(Email);
container.bind<UserDomain>(UserDomain).to(UserDomain);
container.bind<CourseDomain>(CourseDomain).to(CourseDomain);
container.bind<CertificateDomain>(CertificateDomain).to(CertificateDomain);
container.bind<CredentialSubjectDomain>(CredentialSubjectDomain).to(CredentialSubjectDomain);
container.bind<CredentialSubjectDetailDomain>(CredentialSubjectDetailDomain).to(CredentialSubjectDetailDomain);
container.bind<IssuerDomain>(IssuerDomain).to(IssuerDomain);
container.bind<SmartContract>(SmartContract).to(SmartContract);
container.bind<Application>(Application).to(Application);
container.bind<Database>(Database).to(Database);
container.bind<AuthMiddleware>(AuthMiddleware).to(AuthMiddleware);

container.bind<CertTemplateDomain>(CertTemplateDomain).to(CertTemplateDomain);
container.bind<CertItemDomain>(CertItemDomain).to(CertItemDomain);
container.bind<CertRelDomain>(CertRelDomain).to(CertRelDomain);

export { container };
