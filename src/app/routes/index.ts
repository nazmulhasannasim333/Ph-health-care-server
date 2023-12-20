import express from 'express';
import { DoctorRoutes } from '../modules/doctor/doctor.route';

const router = express.Router();

const moduleRoutes = [
  // ... routes
  {
    path: '/doctor',
    route: DoctorRoutes,
  },
];

moduleRoutes.forEach(route => router.use(route.path, route.route));
export default router;
