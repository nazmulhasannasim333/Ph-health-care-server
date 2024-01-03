import { Gender, UserStatus } from '@prisma/client';
import { z } from 'zod';

const createDoctor = z.object({
  body: z.object({
    password: z.string(),
    pushNotificationToken: z.string(),
    doctor: z.object({
      email: z.string().email(),
      name: z.string(),
      profilePhoto: z.string().nullable(),
      contactNumber: z.string(),
      address: z.string().nullable(),
      registrationNumber: z.string(),
      experience: z.number().int(),
      gender: z.enum(['MALE', 'FEMALE']),
      apointmentFee: z.number(),
      qualification: z.string(),
      currentWorkingPlace: z.string(),
      designation: z.string(),
    }),
  }),
});
const createPatient = z.object({
  body: z.object({
    password: z.string(),
    pushNotificationToken: z.string(),
    patient: z.object({
      email: z.string().email(),
      name: z.string(),
    }),
  }),
});

const updateStatus = z.object({
  body: z.object({
    status: z.enum(['PENDING', 'ACTIVE', 'BLOCKED']),
  }),
});

export const UserValidation = {
  createDoctor,
  createPatient,
  updateStatus,
};
