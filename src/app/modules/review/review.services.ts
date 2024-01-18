import prisma from '../../../shared/prisma';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IGenericResponse } from '../../../interfaces/common';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { Prisma, Review } from '@prisma/client';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';
import {
  reviewRelationalFields,
  reviewRelationalFieldsMapper,
} from './review.constants';

const insertIntoDB = async (data: Review): Promise<Review> => {
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

  const result = await prisma.review.create({
    data: data,
  });

  return result;
};

const getAllFromDB = async (
  filters: any,
  options: IPaginationOptions,
): Promise<IGenericResponse<Review[]>> => {
  const { limit, page, skip } = paginationHelpers.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;
  const andConditions = [];

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map(key => {
        if (reviewRelationalFields.includes(key)) {
          return {
            [reviewRelationalFieldsMapper[key]]: {
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

  const whereConditions: Prisma.ReviewWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.review.findMany({
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
  const total = await prisma.review.count({
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

export const ReviewService = {
  insertIntoDB,
  getAllFromDB,
};
