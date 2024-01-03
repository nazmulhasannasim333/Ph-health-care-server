import { Doctor, Prisma, Specialties } from '@prisma/client';
import prisma from '../../../shared/prisma';
import { IDoctorFilterRequest } from './doctor.interface';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IGenericResponse } from '../../../interfaces/common';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { doctorSearchableFields } from './doctor.constants';

const insertIntoDB = async (data: Doctor): Promise<Doctor> => {
  const result = await prisma.doctor.create({
    data
  });
  return result;
};

const getAllFromDB = async (
  filters: IDoctorFilterRequest,
  options: IPaginationOptions,
): Promise<IGenericResponse<Doctor[]>> => {
  const { limit, page, skip } = paginationHelpers.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: doctorSearchableFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key]
        }
      })),
    });
  }

  const whereConditions: Prisma.DoctorWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.doctor.findMany({
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
  const total = await prisma.doctor.count({
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



const getByIdFromDB = async (id: string): Promise<Doctor | null> => {
  const result = await prisma.doctor.findUnique({
    where: {
      id,
    },
  });
  return result;
};

const updateIntoDB = async (
  id: string,
  payload: Partial<Doctor>,
  specialties: string[],
): Promise<Doctor> => {
  const specialtiesData = specialties?.map(id => ({ id }));
  const result = await prisma.doctor.update({
    where: {
      id,
    },
    data: {
      ...payload
    },
  });
  return result;
};

const deleteFromDB = async (id: string): Promise<Doctor> => {
  const result = await prisma.doctor.delete({
    where: {
      id,
    },
  });
  return result;
};

export const DoctorService = {
  insertIntoDB,
  getAllFromDB,
  getByIdFromDB,
  updateIntoDB,
  deleteFromDB,
};
