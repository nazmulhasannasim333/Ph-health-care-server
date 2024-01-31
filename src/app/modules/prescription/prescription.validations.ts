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
    dateIssued: z.string({
      required_error: 'Date Issued is required',
    }),
    instructions: z.string({
      required_error: 'Instructions is required',
    }),
  }),
});

export const PrescriptionValidation = {
  create,
};
