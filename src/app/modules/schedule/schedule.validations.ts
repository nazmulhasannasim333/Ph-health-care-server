import { z } from 'zod';

const create = z.object({
  body: z.object({
    startDate: z.string({
      required_error: 'Start Date is required',
    }),
    endDate: z.string({
      required_error: 'End Date is required',
    }),
    startTime: z.string({
      required_error: 'Start Time is required',
    }),
    endTime: z.string({
      required_error: 'End Time is required',
    }),
  }),
});

export const ScheduleValidation = {
  create,
};
