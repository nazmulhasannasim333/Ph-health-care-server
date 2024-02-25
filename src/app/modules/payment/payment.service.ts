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
};

const validate = async (payload: any) => {
    // if (!payload || !payload?.status || payload?.status !== 'VALID') {
    //     return {
    //         massage: 'Invalid Payment!'
    //     }
    // }
    // const result = await sslServices.validate(payload);

    // if (result?.status !== 'VALID') {
    //     return {
    //         massage: 'Payment failed'
    //     }
    // }
    // const { tran_id } = result;

    // Uncomment when validate in locally
    const { tran_id } = payload;

    await prisma.$transaction(async (transactionClient) => {
        const paymentData = await transactionClient.payment.update({
            where: {
                transactionId: tran_id
            },
            data: {
                status: PaymentStatus.PAID,
                paymentGatewayData: payload
            }
        });

        await transactionClient.appointment.update({
            where: {
                id: paymentData.appointmentId
            },
            data: {
                paymentStatus: PaymentStatus.PAID
            }
        })
    });

    return {
        massage: 'Payment Success'
    };
}

export const PaymentService = {
    initPayment,
    validate
}