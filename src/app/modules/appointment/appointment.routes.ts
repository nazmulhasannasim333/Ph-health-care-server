import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AppointmentController } from './appointment.controller';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';
import { AppointmentValidation } from './appointment.validation';


const router = express.Router();

router.post(
    '/',
    auth(ENUM_USER_ROLE.PATIENT),
    validateRequest(AppointmentValidation.createAppointment),
    AppointmentController.createAppointment
)

export const AppointmentRoutes = router;
