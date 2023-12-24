import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { SpecialtiesValidation } from './specialties.validations';
import { SpecialtiesController } from './specialties.controller';

const router = express.Router();

router.post(
  '/',
  validateRequest(SpecialtiesValidation.create),
  SpecialtiesController.insertIntoDB,
);
router.post(
  '/doctor-specialties',
  validateRequest(SpecialtiesValidation.doctorSpecialities),
  SpecialtiesController.addDoctorSpecialities,
);
router.delete('/:id', SpecialtiesController.deleteFromDB);

export const SpecialtiesRoutes = router;
