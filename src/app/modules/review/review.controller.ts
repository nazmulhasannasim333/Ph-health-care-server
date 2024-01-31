import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { ReviewService } from './review.services';
import pick from '../../../shared/pick';
import { reviewFilterableFields } from './review.constants';
import { IAuthUser } from '../../../interfaces/common';

const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const result = await ReviewService.insertIntoDB(req.body, user as IAuthUser);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Review created successfully',
    data: result,
  });
});

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, reviewFilterableFields);
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
  const result = await ReviewService.getAllFromDB(filters, options);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Reviews retrieval successfully',
    meta: result.meta,
    data: result.data,
  });
});

export const ReviewController = {
  insertIntoDB,
  getAllFromDB,
};
