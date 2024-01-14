import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { AppointmentServices } from './appointment.services';
import { IAuthUser } from '../../../interfaces/common';
import pick from '../../../shared/pick';
import { appointmentFilterableFields } from './appointment.constants';

const createAppointment = catchAsync(async (req: Request, res: Response) => {
    const user = req.user;
    const result = await AppointmentServices.createAppointment(req.body, user as IAuthUser);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Appointment booked successfully!',
        data: result,
    });
});

const getMyAppointment = catchAsync(async (req: Request, res: Response) => {
    const filters = {}
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
    const user = req.user;
    const result = await AppointmentServices.getMyAppointment(filters, options, user as IAuthUser);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Appointment retrieval successfully',
        meta: result.meta,
        data: result.data,
    });
});

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
    const filters = pick(req.query, appointmentFilterableFields)
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
    const result = await AppointmentServices.getAllFromDB(filters, options);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Appointment retrieval successfully',
        meta: result.meta,
        data: result.data,
    });
});

export const AppointmentController = {
    createAppointment,
    getMyAppointment,
    getAllFromDB
};
