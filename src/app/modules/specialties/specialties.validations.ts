import { z } from 'zod';

const create = z.object({
  body: z.object({
    title: z.string({
      required_error: 'Title is required',
    }),
  }),
});

const doctorSpecialities = z.object({
  body: z.object({
    specialtiesId: z.string({
      required_error: 'SpecialtiesId is required',
    }),
    doctorId: z.string({
      required_error: 'DoctorId is required',
    }),
  }),
});

export const SpecialtiesValidation = {
  create,
  doctorSpecialities,
};
