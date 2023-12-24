import { Doctor, UserRole } from "@prisma/client";
import prisma from "../../../shared/prisma";
import ApiError from "../../../errors/ApiError";
import httpStatus from "http-status";

const createDoctor = async (doctor: Doctor, userData: any): Promise<Doctor> => {
    const result = await prisma.$transaction(async (transactionClient) => {
        const newUser = await transactionClient.user.create({
            data: {
                email: doctor.email,
                password: userData.password,
                pushNotificationToken: userData.pushNotificationToken,
                role: UserRole.DOCTOR
            }
        });
        const newDoctor = await transactionClient.doctor.create({
            data: doctor,
            include: {
                user: true
            }
        })

        return newDoctor;
    });

    return result;
};


const changeProfileStatus = async (userId: string, status: any) => {
    const isUserExist = await prisma.user.findUnique({
        where: {
            id: userId
        }
    });
    if (!isUserExist) {
        throw new ApiError(httpStatus.BAD_REQUEST, "User does not exists!")
    }

    const updatedUser = await prisma.user.update({
        where: {
            id: userId
        },
        data: {
            status
        }
    });

    return updatedUser;
}


export const UserServices = {
    createDoctor
};