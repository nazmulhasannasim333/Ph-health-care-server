import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { DoctorValidation } from './doctor.validation';
import { DoctorController } from './doctor.controller';

const router = express.Router();

router.get('/', DoctorController.getAllFromDB);

router.get('/:id', DoctorController.getByIdFromDB);

// router.post(
//   '/',
//   validateRequest(DoctorValidation.create),
//   DoctorController.insertIntoDB,
// );

router.patch(
  '/:id',
  validateRequest(DoctorValidation.update),
  DoctorController.updateIntoDB,
);

router.delete('/:id', DoctorController.deleteFromDB);
router.delete('/soft/:id', DoctorController.softDelete);

export const DoctorRoutes = router;
