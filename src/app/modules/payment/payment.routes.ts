import express from 'express';
import { PaymentController } from './payment.controller';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';

const router = express.Router();

router.post('/ipn', PaymentController.validate)

router.post(
    '/init/:appointmentId',
    auth(ENUM_USER_ROLE.PATIENT),
    PaymentController.initPayment
);



export const paymentRoutes = router;

