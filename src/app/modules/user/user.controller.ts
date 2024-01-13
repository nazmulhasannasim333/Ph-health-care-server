import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { UserServices } from './user.services';
import { userFilterableFields } from './user.constant';
import pick from '../../../shared/pick';

const createDoctor = catchAsync(async (req: Request, res: Response) => {
  const { doctor, ...userData } = req.body;
  const result = await UserServices.createDoctor(doctor, userData);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Doctor created successfully!',
    data: result,
  });
});

const createAdmin = catchAsync(async (req: Request, res: Response) => {
  const { admin, ...userData } = req.body;
  const result = await UserServices.createAdmin(admin, userData);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Admin created successfully!',
    data: result,
  });
});

const createPatient = catchAsync(async (req: Request, res: Response) => {
  const { patient, ...userData } = req.body;
  const result = await UserServices.createPatient(patient, userData);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Patient created successfully!',
    data: result,
  });
});

const changeProfileStatus = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await UserServices.changeProfileStatus(id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User status updated successfully!',
    data: result,
  });
});


const getAllUser = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, userFilterableFields);
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
  const result = await UserServices.getAllUser(filters, options);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Users retrieval successfully',
    meta: result.meta,
    data: result.data,
  });
});

export const UserController = {
  createDoctor,
  createAdmin,
  createPatient,
  changeProfileStatus,
  getAllUser
};
