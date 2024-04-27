import { DoctorSchedule, Prisma } from '@prisma/client';
import prisma from '../../../shared/prisma';
import { IDoctorScheduleFilterRequest } from './doctorSchedule.interface';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IGenericResponse } from '../../../interfaces/common';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';
import { equal } from 'assert';
import { IScheduleFilterRequest } from '../schedule/schedule.interface';

const insertIntoDB = async (
  data: { scheduleIds: string[] },
  user: any,
): Promise<{ count: number }> => {
  const { scheduleIds } = data;
  const isDoctorExists = await prisma.doctor.findFirst({
    where: {
      email: user.email,
    },
  });

  if (!isDoctorExists) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Doctor does not exists!');
  }
  const doctorSchedulesData = scheduleIds.map(scheduleId => ({
    doctorId: isDoctorExists.id,
    scheduleId,
  }));

  const result = await prisma.doctorSchedule.createMany({
    data: doctorSchedulesData,
  });
  return result;
};

const getAllFromDB = async (
  filters: IDoctorScheduleFilterRequest,
  options: IPaginationOptions,
): Promise<IGenericResponse<DoctorSchedule[]>> => {
  const { limit, page, skip } = paginationHelpers.calculatePagination(options);
  const { searchTerm, startDate, endDate, ...filterData } = filters;
  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      doctor: {
        name: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      },
    });
  }

  if (startDate && endDate) {
    andConditions.push({
      schedule: {
        AND: [
          {
            startDate: {
              gte: startDate,
            },
          },
          {
            startDate: {
              lte: endDate,
            },
          },
        ],
      },
    });
  }

  if (Object.keys(filterData).length > 0) {
    if (
      typeof filterData.isBooked === 'string' &&
      filterData.isBooked === 'true'
    ) {
      filterData.isBooked = true;
    } else if (
      typeof filterData.isBooked === 'string' &&
      filterData.isBooked === 'false'
    ) {
      filterData.isBooked = false;
    }
    andConditions.push({
      AND: Object.keys(filterData).map(key => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  const whereConditions: any =
    andConditions.length > 0 ? { AND: andConditions } : {};
  const result = await prisma.doctorSchedule.findMany({
    include: {
      doctor: true,
      schedule: true,
    },
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : {
            createdAt: 'desc',
          },
  });
  const total = await prisma.doctorSchedule.count({
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

// const getByIdFromDB = async (id: string): Promise<DoctorSchedule | null> => {
//   const result = await prisma.doctorSchedule.findUnique({
//     where: {
//       id,
//     },
//     include: {
//       doctor: true,
//       schedule: true,
//     },
//   });
//   return result;
// };

// const updateIntoDB = async (
//   id: string,
//   payload: Partial<DoctorSchedule>,
// ): Promise<DoctorSchedule | null> => {
//   const result = await prisma.doctorSchedule.update({
//     where: {
//       id,
//     },
//     data: payload,
//     include: {
//       doctor: true,
//       schedule: true,
//     },
//   });
//   return result;
// };

const deleteFromDB = async (
  user: any,
  scheduleId: string,
): Promise<DoctorSchedule> => {
  const isDoctorExists = await prisma.doctor.findFirst({
    where: {
      email: user.email,
    },
  });

  if (!isDoctorExists) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Doctor does not exitsts');
  }

  const result = await prisma.doctorSchedule.delete({
    where: {
      doctorId_scheduleId: {
        doctorId: isDoctorExists.id,
        scheduleId: scheduleId,
      },
    },
  });
  return result;
};

const getMySchedules = async (
  filters: IScheduleFilterRequest,
  options: IPaginationOptions,
  user: any,
): Promise<IGenericResponse<DoctorSchedule[]>> => {
  const { limit, page, skip } = paginationHelpers.calculatePagination(options);
  const { startDate, endDate, ...filterData } = filters;

  const whereConditions: Prisma.DoctorScheduleWhereInput = {
    doctor: {
      email: user.email,
    },
    ...(startDate && endDate
      ? {
          schedule: {
            startDate: {
              gte: new Date(startDate),
            },
            endDate: {
              lte: new Date(endDate),
            },
          },
        }
      : {}),
    ...(Object.keys(filterData).length > 0
      ? {
          AND: Object.keys(filterData).map(key => ({
            [key]: {
              equals: (filterData as any)[key],
            },
          })),
        }
      : {}),
  };

  const doctorSchedules = await prisma.doctorSchedule.findMany({
    where: whereConditions,
    include: {
      doctor: true,
      schedule: true,
      appointment: true,
    },
    skip,
    take: limit,
    orderBy: {
      createdAt: 'desc',
    },
  });

  return {
    meta: {
      total: doctorSchedules.length,
      page,
      limit,
    },
    data: doctorSchedules,
  };
};

export const DoctorScheduleService = {
  insertIntoDB,
  getAllFromDB,
  // getByIdFromDB,
  // updateIntoDB,
  deleteFromDB,
  getMySchedules,
};
