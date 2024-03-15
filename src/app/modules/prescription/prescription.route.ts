import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { PrescriptionValidation } from './prescription.validations';
import { PrescriptionController } from './prescription.controller';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';

const router = express.Router();
router.get(
  '/',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  PrescriptionController.getAllFromDB
);

//router.get('/:id', PrescriptionController.getByIdFromDB);
router.get(
  '/my-prescriptions',
  auth(ENUM_USER_ROLE.PATIENT),
  PrescriptionController.patientPrescriptions
);

router.post(
  '/',
  auth(ENUM_USER_ROLE.DOCTOR),
  validateRequest(PrescriptionValidation.create),
  PrescriptionController.insertIntoDB
);

export const PrescriptionsRoutes = router;
