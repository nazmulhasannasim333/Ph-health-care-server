import express from 'express';
import { MetaController } from './meta.controller';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';

const router = express.Router();

// Routes for fetching metadata for the dashboard
router.get(
    '/',
    auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.DOCTOR, ENUM_USER_ROLE.PATIENT),
    MetaController.fetchDashboardMetadata
);

export const MetaRoutes = router;
