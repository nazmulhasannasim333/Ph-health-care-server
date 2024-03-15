import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AppointmentController } from './appointment.controller';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';
import { AppointmentValidation } from './appointment.validation';


const router = express.Router();

router.get(
    '/',
    auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
    AppointmentController.getAllFromDB
);

router.get(
    '/my-appointments',
    auth(ENUM_USER_ROLE.PATIENT, ENUM_USER_ROLE.DOCTOR),
    AppointmentController.getMyAppointment
);

router.post(
    '/',
    auth(ENUM_USER_ROLE.PATIENT),
    validateRequest(AppointmentValidation.createAppointment),
    AppointmentController.createAppointment
);

router.patch(
    '/status/:id',
    auth(ENUM_USER_ROLE.DOCTOR, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
    AppointmentController.changeAppointmentStatus
);



export const AppointmentRoutes = router;
