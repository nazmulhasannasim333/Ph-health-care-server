import { Specialties } from '@prisma/client';
import prisma from '../../../shared/prisma';

const insertIntoDB = async (data: Specialties): Promise<Specialties> => {
  const result = await prisma.specialties.create({
    data,
  });
  return result;
};

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
  deleteFromDB,
};
