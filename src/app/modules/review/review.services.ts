import prisma from '../../../shared/prisma';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IAuthUser, IGenericResponse } from '../../../interfaces/common';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { Prisma, Review } from '@prisma/client';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';
import {
  reviewRelationalFields,
  reviewRelationalFieldsMapper,
} from './review.constants';

const insertIntoDB = async (data: Review, user: IAuthUser): Promise<Review> => {
  const isAppointmentExists = await prisma.appointment.findFirst({
    where: {
      id: data.appointmentId,
      patient: {
        email: user?.email
      }
    },
  });

  if (!isAppointmentExists) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Appointment doesn't exists!");
  }

  return await prisma.$transaction(async (transactionClient) => {
    const review = await transactionClient.review.create({
      data: {
        doctorId: isAppointmentExists.doctorId,
        patientId: isAppointmentExists.patientId,
        appointmentId: isAppointmentExists.id,
        rating: data.rating,
        comment: data.comment
      },
      include: {
        doctor: true,
        patient: true
      }
    });

    const averageRating = await transactionClient.review.aggregate({
      _avg: {
        rating: true
      }
    });

    await transactionClient.doctor.update({
      where: {
        id: review.doctorId
      },
      data: {
        averageRating: averageRating._avg.rating as number
      }
    })

    return review;
  })
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
      //appointment: true,
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
