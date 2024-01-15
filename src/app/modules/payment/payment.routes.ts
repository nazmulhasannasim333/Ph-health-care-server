import express from 'express';
import { PaymentController } from './payment.controller';

const router = express.Router();

router.post('/ipn', PaymentController.validate)

router.post('/init/:appointmentId', PaymentController.initPayment)



export const paymentRoutes = router;

