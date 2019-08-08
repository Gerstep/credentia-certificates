import { UserType } from '../models/user';

export interface ICreateUserParams {
  email: string;
  password?: string;
  name?: string;
  surname?: string;
  fullName?: string;
  issuerId?: string;
  birthDate?: string;
  userType: UserType;
  lang: string;
  domain: string;
}

export interface IGetUserParams {
  id?: string;
}
