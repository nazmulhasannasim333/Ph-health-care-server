import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError";
import prisma from "../../../shared/prisma";
import { sslServices } from "../ssl/ssl.service"
import { PaymentStatus } from "@prisma/client";

const initPayment = async (data: any, appointmentId: string) => {
    const paymentData = await prisma.payment.findFirst({
        where: {
            appointmentId
        },
        include: {
            appointment: {
                include: {
                    patient: true
                }
            }
        }
    });

    if (!paymentData) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Payment information not found!")
    }
    if (paymentData.status === PaymentStatus.PAID) {
        throw new ApiError(httpStatus.BAD_REQUEST, "You already pay for the appointment!")
    }

    const paymentSession = await sslServices.initPayment({
        amount: paymentData.amount,
        transactionId: paymentData.transactionId,
        customerName: paymentData.appointment.patient.name,
        customerEmail: paymentData.appointment.patient.email
    })
    return {
        paymentUrl: paymentSession.GatewayPageURL
    };
}

export const PaymentService = {
    initPayment
}