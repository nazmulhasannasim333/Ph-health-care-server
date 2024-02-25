import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { PrescriptionService } from './prescription.services';
import pick from '../../../shared/pick';
import { prescriptionFilterableFields } from './prescription.constants';

const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const result = await PrescriptionService.insertIntoDB(req.body, user);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Prescription created successfully',
    data: result,
  });
});

const patientPrescriptions = catchAsync(async (req: Request, res: Response) => {
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
  const filters = pick(req.query, prescriptionFilterableFields);
  const user = req.user;
  const result = await PrescriptionService.patientPrescriptions(
    user,
    filters,
    options,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Prescriptions retrieval successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, prescriptionFilterableFields);
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
  const result = await PrescriptionService.getAllFromDB(filters, options);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Prescriptions retrieval successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getByIdFromDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await PrescriptionService.getByIdFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Prescriptions retrieval successfully',
    data: result,
  });
});

export const PrescriptionController = {
  insertIntoDB,
  patientPrescriptions,
  getAllFromDB,
  getByIdFromDB,
};
