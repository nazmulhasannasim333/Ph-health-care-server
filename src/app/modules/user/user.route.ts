import express from 'express';
import { UserController } from './user.controller';

const router = express.Router();


router.post(
    '/create-doctor',
    UserController.createDoctor
);




export const userRoutes = router;