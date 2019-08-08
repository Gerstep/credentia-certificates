import { UserType } from '../models/user';

export interface ISendMailParams {
  html: string;
  text: string;
  subject: string;
  from: {
    name: string;
    email: string;
  };
  to: {
    name: string;
    email: string;
  };
}

export interface ISendSignUpMailParams {
  uuid: string;
  userType: UserType;
  fullName: string;
  email: string;
  password?: string;
  lang: string;
  domain: string;
}
