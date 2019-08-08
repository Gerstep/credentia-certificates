import { UserType } from '../models/user';

export interface ISignUpParams {
  email: string;
  password: string;
  name: string;
  surname: string;
  fullName: string;
  userType: UserType;
  issuerId?: string;
  birthDate?: string;
}

export interface ICreateCourseParams {
  name: string;
}

export interface IDeleteCoursesParams {
  courseIds: string[];
}

export interface ICreateIssuerParams {
  name: string;
  address: string;
  phone: string;
  hash: string;
  privateKey: string;
}

export interface ICreateCertParams {
  hash: string; // eth address of smart contract
  issuerHash: string; // eth address of issuer
  issuerId: string; // issuer id
  createdAt: Date;
  issuanceDate: Date;
  proofs: {
      type: string;
      createdAt: Date;
      signature: string;
  };
  expirationDate: Date;
  status: string;
  credentialSubject: {
    _id: string; // Holder
    name: string; // Holder name
    hash: string; // Holder eth address
    course: [{
      _id: string; // course
      name: string; // course name
      grade: number; // total grade of the Course
    }]
  };
}

export interface IGrades {
  grade: string;
  courseId: string;
}

export interface ICreateCredentialSubjectParams {
  name: string; // Diplom name
  issuerId: string; // Issuer ref
  holderId: string; // Holder ref
  degreeId: string; // degree
  grades: IGrades[];  // IGradesArr;
}

export interface IUpdateCredentialSubjectParams {
  name?: string; // Diplom name
  issuerId?: string; // Issuer ref
  holderId?: string; // Holder ref
  degreeId?: string; // degree
  credentialSubjectDetailIds?: string[];
  txId?: string;
  abi?: string;
  expirationDate?: Date;
}

export interface ICreateCredentialSubjectDetailParams {
  credentialSubjectId: string; // Diplom ref
  coursesId: string; // Course ref (example, Math)
  grade: string; // 5+
}

export interface ICreateDegreeParams {
  name: string; // example, master
}

export interface ICreateCertTemplateParams {
  name: string;
  description: string;
}

export interface ICreateHolderParams extends Document {
  name: string;
  address: string;
  email: string;
  birthDate: Date;
  phone: string;
  hash: string;
  privateKey: string;
}

export interface ICertDeploy {
  credentialSubjectId: string;
}

export interface ICertItemParams {
  name: string;
  description: string;
  dataType: string;
  dataFormat: string;
  contextUrl: string;
}

export interface ICertRelParams {
  certItemId: string;
  certParentId: string;
  certTemplateId: string;
}
