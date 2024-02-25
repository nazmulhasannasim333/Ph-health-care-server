import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { DoctorScheduleValidation } from './doctorSchedule.validations';
import { ScheduleController } from './doctorSchedule.controller';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';

const router = express.Router();
router.get(
  '/',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.DOCTOR, ENUM_USER_ROLE.PATIENT),
  ScheduleController.getAllFromDB);

router.get(
  '/my-schedules',
  auth(ENUM_USER_ROLE.DOCTOR),
  ScheduleController.getMySchedules
);

// router.patch('/:id', ScheduleController.updateIntoDB);
router.post(
  '/',
  validateRequest(DoctorScheduleValidation.create),
  auth(ENUM_USER_ROLE.DOCTOR),
  ScheduleController.insertIntoDB,
);
router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.DOCTOR),
  ScheduleController.deleteFromDB
);

export const DoctorScheduleRoutes = router;
