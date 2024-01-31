import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { SpecialtiesValidation } from './specialties.validations';
import { SpecialtiesController } from './specialties.controller';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';

const router = express.Router();

router.get(
  '/',
  SpecialtiesController.getAllFromDB
);

router.post(
  '/',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.DOCTOR),
  validateRequest(SpecialtiesValidation.create),
  SpecialtiesController.insertIntoDB,
);
router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  SpecialtiesController.deleteFromDB
);

export const SpecialtiesRoutes = router;
