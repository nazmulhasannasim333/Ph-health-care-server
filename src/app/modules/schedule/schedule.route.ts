import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { ScheduleValidation } from './schedule.validations';
import { ScheduleController } from './schedule.controller';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';

const router = express.Router();
router.get(
  '/',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.DOCTOR),
  ScheduleController.getAllFromDB
);

router.get(
  '/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.DOCTOR),
  ScheduleController.getByIdFromDB
);

// router.patch('/:id', PatientController.updateIntoDB);
router.post(
  '/',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  validateRequest(ScheduleValidation.create),
  ScheduleController.insertIntoDB,
);

router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  ScheduleController.deleteFromDB
);

export const ScheduleRoutes = router;
