import { Specialties } from '@prisma/client';
import prisma from '../../../shared/prisma';

const insertIntoDB = async (data: Specialties): Promise<Specialties> => {
  const result = await prisma.specialties.create({
    data,
  });
  return result;
};

const getAllFromDB = async () => {
  return await prisma.specialties.findMany();
}

const deleteFromDB = async (id: string): Promise<Specialties> => {
  const result = await prisma.specialties.delete({
    where: {
      id,
    },
  });
  return result;
};

export const SpecialtiesService = {
  insertIntoDB,
  getAllFromDB,
  deleteFromDB,
};
