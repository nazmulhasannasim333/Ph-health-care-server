import { Appointment, Prisma } from '@prisma/client';
import prisma from '../../../shared/prisma';
import { IAuthUser, IGenericResponse } from '../../../interfaces/common';
import { v4 as uuidv4 } from 'uuid';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IPaginationOptions } from '../../../interfaces/pagination';


// const getByIdFromDB = async (id: string): Promise<Admin | null> => {
//     const result = await prisma.admin.findUnique({
//         where: {
//             id,
//             isDeleted: false,
//         },
//     });
//     return result;
// };

// const updateIntoDB = async (
//     id: string,
//     payload: Partial<Admin>,
// ): Promise<Admin | null> => {
//     const admin = await prisma.admin.findUnique({
//         where: {
//             id,
//             isDeleted: false,
//         },
//     });
//     if (!admin) {
//         throw new ApiError(httpStatus.NOT_FOUND, 'This admin does not exist');
//     }
//     const result = await prisma.admin.update({
//         where: {
//             id,
//             isDeleted: false,
//         },
//         data: payload,
//     });
//     return result;
// };

// const deleteFromDB = async (id: string): Promise<Admin> => {
//     return await prisma.$transaction(async transactionClient => {
//         const deletedAdmin = await transactionClient.admin.delete({
//             where: {
//                 id,
//             },
//         });

//         await transactionClient.user.delete({
//             where: {
//                 email: deletedAdmin.email,
//             },
//         });

//         return deletedAdmin;
//     });
// };

// const softDelete = async (id: string): Promise<Admin> => {
//     return await prisma.$transaction(async transactionClient => {
//         const deletedAdmin = await transactionClient.admin.update({
//             where: { id },
//             data: {
//                 isDeleted: true,
//             },
//         });

//         await transactionClient.user.update({
//             where: {
//                 email: deletedAdmin.email,
//             },
//             data: {
//                 status: UserStatus.DELETED,
//             },
//         });

//         return deletedAdmin;
//     });
// };

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
    const { limit, page, skip } = paginationHelpers.calculatePagination(options);
    const andConditions = [];

    andConditions.push(
        {
            patient: {
                email: authUser?.email
            }
        }
    )
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
        include: {
            doctor: true
        }
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
