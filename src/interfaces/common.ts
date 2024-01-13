import { ENUM_USER_ROLE } from '../enums/user';
import { IGenericErrorMessage } from './error';

export type IGenericResponse<T> = {
  meta: {
    page: number;
    limit: number;
    total: number;
  };
  data: T;
};

export type IGenericErrorResponse = {
  statusCode: number;
  message: string;
  errorMessages: IGenericErrorMessage[];
};


export type IAuthUser = {
  userId: string;
  role: ENUM_USER_ROLE,
  email: string
} | null
