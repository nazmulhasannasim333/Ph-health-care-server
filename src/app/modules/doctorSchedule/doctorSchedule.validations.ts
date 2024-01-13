import { z } from 'zod';

const create = z.object({
  body: z.object({
    doctorId: z.string({
      required_error: 'Doctor Id is required',
    }),
    scheduleId: z.string({
      required_error: 'Schedule Id is required',
    }),
  }),
});

export const DoctorScheduleValidation = {
  create,
};
