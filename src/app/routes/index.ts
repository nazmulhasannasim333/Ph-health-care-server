import express from 'express';
import { DoctorRoutes } from '../modules/doctor/doctor.route';
import { SpecialtiesRoutes } from '../modules/specialties/specialties.route';
import { userRoutes } from '../modules/user/user.route';

const router = express.Router();

const moduleRoutes = [
  // ... routes
  {
    path: '/user',
    route: userRoutes,
  },
  {
    path: '/doctor',
    route: DoctorRoutes,
  },
  {
    path: '/specialties',
    route: SpecialtiesRoutes,
  },
];

moduleRoutes.forEach(route => router.use(route.path, route.route));
export default router;
