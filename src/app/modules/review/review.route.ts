import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { ReviewValidation } from './review.validations';
import { ReviewController } from './review.controller';

const router = express.Router();
router.get('/', ReviewController.getAllFromDB);

router.post(
  '/',
  validateRequest(ReviewValidation.create),
  ReviewController.insertIntoDB,
);

export const ReviewRoutes = router;
