import { Admin, Doctor, Patient, Prisma, User, UserRole, UserStatus } from '@prisma/client';
import prisma from '../../../shared/prisma';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';
import { hashedPassword } from './user.utils';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IUser, IUserFilterRequest } from './user.interface';
import { IGenericResponse } from '../../../interfaces/common';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { userSearchableFields } from './user.constant';

const createDoctor = async (doctor: Doctor, userData: any): Promise<Doctor> => {
  const hashPassword = await hashedPassword(userData.password);
  const result = await prisma.$transaction(async transactionClient => {
    const newUser = await transactionClient.user.create({
      data: {
        email: doctor.email,
        password: hashPassword,
        pushNotificationToken: userData.pushNotificationToken,
        role: UserRole.DOCTOR,
      },
    });
    const newDoctor = await transactionClient.doctor.create({
      data: doctor,
    });

    return newDoctor;
  });

  return result;
};

const createAdmin = async (admin: Admin, userData: any): Promise<Admin> => {
  const hashPassword = await hashedPassword(userData.password);
  const result = await prisma.$transaction(async transactionClient => {
    const newUser = await transactionClient.user.create({
      data: {
        email: admin.email,
        password: hashPassword,
        pushNotificationToken: userData.pushNotificationToken,
        role: UserRole.ADMIN,
      },
    });
    const newAdmin = await transactionClient.admin.create({
      data: admin,
    });

    return newAdmin;
  });

  return result;
};

const createPatient = async (
  patient: Patient,
  userData: any,
): Promise<Patient> => {
  const hashPassword = await hashedPassword(userData.password);
  const result = await prisma.$transaction(async transactionClient => {
    const newUser = await transactionClient.user.create({
      data: {
        email: patient.email,
        password: hashPassword,
        pushNotificationToken: userData.pushNotificationToken,
        role: UserRole.PATIENT,
      },
    });
    const newPatient = await transactionClient.patient.create({
      data: patient,
    });

    return newPatient;
  });

  return result;
};

const changeProfileStatus = async (userId: string, status: UserStatus) => {
  const isUserExist = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
  console.log(isUserExist);
  if (!isUserExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User does not exists!');
  }

  const updatedUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data: status,
  });

  return updatedUser;
};

const getAllUser = async (
  filters: IUserFilterRequest,
  options: IPaginationOptions,
): Promise<IGenericResponse<IUser[]>> => {
  const { limit, page, skip } = paginationHelpers.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: userSearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map(key => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  const whereConditions: Prisma.UserWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.user.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : {
          createdAt: 'desc',
        },
    select: {
      id: true,
      email: true,
      role: true,
      needPasswordChange: true,
      status: true,
      createdAt: true,
      updatedAt: true
    }
  });
  const total = await prisma.user.count({
    where: whereConditions,
  });

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

export const UserServices = {
  createDoctor,
  createAdmin,
  createPatient,
  changeProfileStatus,
  getAllUser
};
