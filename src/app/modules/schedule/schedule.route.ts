import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { ScheduleValidation } from './schedule.validations';
import { ScheduleController } from './schedule.controller';

const router = express.Router();
router.get('/', ScheduleController.getAllFromDB);

router.get('/:id', ScheduleController.getByIdFromDB);

// router.patch('/:id', PatientController.updateIntoDB);
router.post(
  '/',
  validateRequest(ScheduleValidation.create),
  ScheduleController.insertIntoDB,
);
router.delete('/:id', ScheduleController.deleteFromDB);

export const ScheduleRoutes = router;
