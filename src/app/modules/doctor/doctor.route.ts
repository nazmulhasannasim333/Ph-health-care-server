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

router.patch('/:id', DoctorController.updateIntoDB);

router.delete('/:id', DoctorController.deleteFromDB);

export const DoctorRoutes = router;
