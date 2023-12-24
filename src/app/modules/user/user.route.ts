import express from 'express';
import { UserController } from './user.controller';
import validateRequest from '../../middlewares/validateRequest';
import { UserValidation } from './user.validations';

const router = express.Router();


router.post(
    '/create-doctor',
    validateRequest(UserValidation.createDoctor),
    UserController.createDoctor
);

router.patch(
    '/:id/status',
    validateRequest(UserValidation.updateStatus),
    UserController.changeProfileStatus
)


export const userRoutes = router;