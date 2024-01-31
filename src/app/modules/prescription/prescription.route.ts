import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { PrescriptionValidation } from './prescription.validations';
import { PrescriptionController } from './prescription.controller';

const router = express.Router();
router.get('/', PrescriptionController.getAllFromDB);

router.get('/:id', PrescriptionController.getByIdFromDB);
router.get('/:patientId', PrescriptionController.patientPrescriptions);

router.post(
  '/',
  validateRequest(PrescriptionValidation.create),
  PrescriptionController.insertIntoDB,
);

export const PrescriptionsRoutes = router;
