import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { DoctorScheduleValidation } from './doctorSchedule.validations';
import { ScheduleController } from './doctorSchedule.controller';

const router = express.Router();
router.get('/', ScheduleController.getAllFromDB);

router.get('/:id', ScheduleController.getByIdFromDB);

router.patch('/:id', ScheduleController.updateIntoDB);
router.post(
  '/',
  validateRequest(DoctorScheduleValidation.create),
  ScheduleController.insertIntoDB,
);
router.delete('/:id', ScheduleController.deleteFromDB);

export const DoctorScheduleRoutes = router;
