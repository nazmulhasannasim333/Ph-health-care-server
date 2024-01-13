import { Appointment, Prisma, UserRole } from '@prisma/client';
import prisma from '../../../shared/prisma';
import { IAuthUser, IGenericResponse } from '../../../interfaces/common';
import { v4 as uuidv4 } from 'uuid';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IPaginationOptions } from '../../../interfaces/pagination';

const createAppointment = async (data: Partial<Appointment>, authUser: IAuthUser) => {
    const { doctorId, doctorScheduleId } = data;
    const isDoctorExists = await prisma.doctor.findFirstOrThrow({
        where: {
            id: doctorId
        }
    });

    if (!isDoctorExists) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Doctor doesn't exists!")
    };

    const isPatientExists = await prisma.patient.findFirstOrThrow({
        where: {
            email: authUser?.email
        }
    });

    if (!isPatientExists) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Patient doesn't exists!")
    };

    const videoCallingId: string = uuidv4()

    const result = await prisma.appointment.create({
        data: {
            patientId: isPatientExists.id,
            doctorId: isDoctorExists.id,
            doctorScheduleId: "VIDEO CALLING ID",
            videoCallingId
        }
    })

    return result;
};

const getMyAppointment = async (
    filters: any,
    options: IPaginationOptions,
    authUser: IAuthUser
): Promise<IGenericResponse<Appointment[]>> => {
    console.log(authUser)
    const { limit, page, skip } = paginationHelpers.calculatePagination(options);
    const andConditions = [];

    if (authUser?.role === UserRole.PATIENT) {
        andConditions.push(
            {
                patient: {
                    email: authUser?.email
                }
            }
        )
    }
    else {
        andConditions.push(
            {
                doctor: {
                    email: authUser?.email
                }
            }
        )
    }
    const whereConditions: Prisma.AppointmentWhereInput =
        andConditions.length > 0 ? { AND: andConditions } : {};

    const result = await prisma.appointment.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy:
            options.sortBy && options.sortOrder
                ? { [options.sortBy]: options.sortOrder }
                : {
                    createdAt: 'desc',
                },
        include: authUser?.role === UserRole.PATIENT
            ? { doctor: true }
            : { patient: true }
    });
    const total = await prisma.appointment.count({
        where: whereConditions
    });

    return {
        meta: {
            total,
            page,
            limit,
        },
        data: result,
    };
};


export const AppointmentServices = {
    createAppointment,
    getMyAppointment
};
