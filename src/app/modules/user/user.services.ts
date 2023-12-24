import { Doctor, UserRole } from "@prisma/client";
import prisma from "../../../shared/prisma";

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



export const UserServices = {
    createDoctor
};