import { Gender, UserStatus } from '@prisma/client';
import { z } from 'zod';

const createDoctor = z.object({
  password: z.string(),
  doctor: z.object({
    email: z.string().email(),
    name: z.string(),
    contactNumber: z.string(),
    address: z.string().nullable(),
    registrationNumber: z.string(),
    experience: z.number().int(),
    gender: z.enum(['MALE', 'FEMALE']),
    apointmentFee: z.number(),
    qualification: z.string(),
    currentWorkingPlace: z.string(),
    designation: z.string(),
  })
});

const createAdmin = z.object({
  password: z.string(),
  admin: z.object({
    email: z.string().email(),
    name: z.string(),
    contactNumber: z.string()
  })
});

const createPatient = z.object({
  password: z.string(),
  patient: z.object({
    email: z.string().email(),
    name: z.string(),
    contactNumber: z.string({
      required_error: "Contact number is required!"
    }),
    address: z.string({
      required_error: "Address is required"
    })
  })
});

const updateStatus = z.object({
  body: z.object({
    status: z.enum(['PENDING', 'ACTIVE', 'BLOCKED']),
  }),
});

export const UserValidation = {
  createDoctor,
  createAdmin,
  createPatient,
  updateStatus,
};
