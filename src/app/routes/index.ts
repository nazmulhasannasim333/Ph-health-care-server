import express from 'express';
import { DoctorRoutes } from '../modules/doctor/doctor.route';
import { SpecialtiesRoutes } from '../modules/specialties/specialties.route';
import { userRoutes } from '../modules/user/user.route';
import { AuthRoutes } from '../modules/auth/auth.routes';
import { PatientRoutes } from '../modules/patient/patient.route';
import { AdminRoutes } from '../modules/admin/admin.route';
import { ScheduleRoutes } from '../modules/schedule/schedule.route';
import { DoctorScheduleRoutes } from '../modules/doctorSchedule/doctorSchedule.route';

const router = express.Router();

const moduleRoutes = [
  // ... routes
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/user',
    route: userRoutes,
  },
  {
    path: '/doctor',
    route: DoctorRoutes,
  },
  {
    path: '/admin',
    route: AdminRoutes,
  },
  {
    path: '/patient',
    route: PatientRoutes,
  },
  {
    path: '/specialties',
    route: SpecialtiesRoutes,
  },
  {
    path: '/schedule',
    route: ScheduleRoutes,
  },
  {
    path: '/doctor-schedule',
    route: DoctorScheduleRoutes,
  },
];

moduleRoutes.forEach(route => router.use(route.path, route.route));
export default router;
