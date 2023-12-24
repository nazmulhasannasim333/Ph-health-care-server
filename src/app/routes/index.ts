import express from 'express';
import { DoctorRoutes } from '../modules/doctor/doctor.route';
import { SpecialtiesRoutes } from '../modules/specialties/specialties.route';

const router = express.Router();

const moduleRoutes = [
  // ... routes
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
