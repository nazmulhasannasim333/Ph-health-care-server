import { DoctorSchedule } from '@prisma/client';
import prisma from '../../../shared/prisma';
import { IDoctorScheduleFilterRequest } from './doctorSchedule.interface';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IGenericResponse } from '../../../interfaces/common';
import { paginationHelpers } from '../../../helpers/paginationHelper';

const insertIntoDB = async (data: DoctorSchedule): Promise<DoctorSchedule> => {
  const result = await prisma.doctorSchedule.create({
    data: data,
  });

  return result;
};

const getAllFromDB = async (
  filters: IDoctorScheduleFilterRequest,
  options: IPaginationOptions,
): Promise<IGenericResponse<DoctorSchedule[]>> => {
  const { limit, page, skip } = paginationHelpers.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;
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

  if (Object.keys(filterData).length > 0) {
    const booleanValue: boolean = filterData.isBooked === 'true';
    andConditions.push({
      isBooked: booleanValue,
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

const getByIdFromDB = async (id: string): Promise<DoctorSchedule | null> => {
  const result = await prisma.doctorSchedule.findUnique({
    where: {
      id,
    },
    include: {
      doctor: true,
      schedule: true,
    },
  });
  return result;
};

const updateIntoDB = async (
  id: string,
  payload: Partial<DoctorSchedule>,
): Promise<DoctorSchedule | null> => {
  const result = await prisma.doctorSchedule.update({
    where: {
      id,
    },
    data: payload,
    include: {
      doctor: true,
      schedule: true,
    },
  });
  return result;
};

const deleteFromDB = async (id: string): Promise<DoctorSchedule> => {
  const result = await prisma.doctorSchedule.delete({
    where: {
      id,
    },
  });
  return result;
};

export const DoctorScheduleService = {
  insertIntoDB,
  getAllFromDB,
  getByIdFromDB,
  updateIntoDB,
  deleteFromDB,
};
