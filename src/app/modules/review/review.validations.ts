import { z } from 'zod';

const create = z.object({
  body: z.object({
    doctorId: z.string({
      required_error: 'Doctor Id is required',
    }),
    patientId: z.string({
      required_error: 'Patient Id is required',
    }),
    appointmentId: z.string({
      required_error: 'Appointment Id is required',
    }),
    rating: z.string({
      required_error: 'Rating is required',
    }),
    comment: z.string({
      required_error: 'Comment is required',
    }),
    date: z.string({
      required_error: 'Date is required',
    }),
  }),
});

export const ReviewValidation = {
  create,
};
