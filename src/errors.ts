import { CustomError }                                             from 'ts-custom-error';

export enum ErrorMessages {
  NotAuthenticated = 'not_authenticated',
  Internal = 'internal_error',
  ValidationError = 'validation_error',
  InvalidCurrency = 'invalid_currency',
  TooManyRequests = 'too_many_requests',
  NotAuthorized = 'not_authorized',
  OperationNotAllowed = 'not_allowed',
}

export enum UserErrorMessages {
  AlreadyExist = 'already_exist',
  InvalidEmailPassword = 'invalid_login_password'
}

export enum EmailErrorMessages {
  EmailProviderError = 'email_internal_error'
}

export class ApiError extends CustomError {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}
