import { z } from 'zod';

const createAppointment = z.object({
    body: z.object({
        doctorId: z.string({
            required_error: "Doctor Id is required!"
        }),
        doctorScheduleId: z.string({
            required_error: "Doctor schedule id is required!"
        })
    })
});

export const AppointmentValidation = {
    createAppointment
};
