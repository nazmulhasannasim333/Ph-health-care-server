import prisma from '../../../shared/prisma';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IAuthUser, IGenericResponse } from '../../../interfaces/common';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { Prescription, Prisma, UserRole } from '@prisma/client';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';
import {
  prescriptionRelationalFields,
  prescriptionRelationalFieldsMapper,
} from './prescription.constants';

const insertIntoDB = async (data: Prescription): Promise<Prescription> => {
  const isAppointmentExists = await prisma.appointment.findFirstOrThrow({
    where: {
      id: data.appointmentId,
    },
  });

  if (!isAppointmentExists) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Appointment doesn't exists!");
  }

  const isDoctorExists = await prisma.doctor.findFirstOrThrow({
    where: {
      id: data.doctorId,
    },
  });

  if (!isDoctorExists) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Doctor doesn't exists!");
  }

  const isPatientExists = await prisma.patient.findFirstOrThrow({
    where: {
      id: data.patientId,
    },
  });

  if (!isPatientExists) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Patient doesn't exists!");
  }

  console.log(data);
  const result = await prisma.prescription.create({
    data: data,
  });

  return result;
};

const patientPrescriptions = async (
  patientId: string,
  filters: any,
  options: IPaginationOptions,
): Promise<IGenericResponse<Prescription[]>> => {
  const { limit, page, skip } = paginationHelpers.calculatePagination(options);
  const { ...filterData } = filters;
  const andConditions = [];
  if (patientId) {
    andConditions.push({
      patient: {
        id: patientId,
      },
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map(key => {
        if (prescriptionRelationalFields.includes(key)) {
          return {
            [prescriptionRelationalFieldsMapper[key]]: {
              email: (filterData as any)[key],
            },
          };
        } else {
          return {
            [key]: {
              equals: (filterData as any)[key],
            },
          };
        }
      }),
    });
  }
  const whereConditions: Prisma.PrescriptionWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.prescription.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : {
            createdAt: 'desc',
          },
    include: {
      doctor: true,
      patient: true,
      appointment: true,
    },
  });
  const total = await prisma.prescription.count({
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

const getAllFromDB = async (
  filters: any,
  options: IPaginationOptions,
): Promise<IGenericResponse<Prescription[]>> => {
  const { limit, page, skip } = paginationHelpers.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;
  const andConditions = [];

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map(key => {
        if (prescriptionRelationalFields.includes(key)) {
          return {
            [prescriptionRelationalFieldsMapper[key]]: {
              email: (filterData as any)[key],
            },
          };
        } else {
          return {
            [key]: {
              equals: (filterData as any)[key],
            },
          };
        }
      }),
    });
  }

  const whereConditions: Prisma.PrescriptionWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.prescription.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : {
            createdAt: 'desc',
          },
    include: {
      doctor: true,
      patient: true,
      appointment: true,
    },
  });
  const total = await prisma.prescription.count({
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

const getByIdFromDB = async (id: string): Promise<Prescription | null> => {
  const result = await prisma.prescription.findUnique({
    where: {
      id,
    },
    include: {
      doctor: true,
      patient: true,
      appointment: true,
    },
  });
  return result;
};

export const PrescriptionService = {
  insertIntoDB,
  patientPrescriptions,
  getAllFromDB,
  getByIdFromDB,
};
