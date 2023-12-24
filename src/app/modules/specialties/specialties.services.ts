import { DoctorSpecialties, Specialties } from '@prisma/client';
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

const addDoctorSpecialities = async (
  data: DoctorSpecialties,
): Promise<DoctorSpecialties> => {
  const result = await prisma.doctorSpecialties.create({
    data,
    include: {
      specialties: true,
      doctor: true,
    },
  });
  return result;
};

export const SpecialtiesService = {
  insertIntoDB,
  deleteFromDB,
  addDoctorSpecialities,
};
