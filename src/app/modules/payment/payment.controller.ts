import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { PaymentService } from "./payment.service";
import sendResponse from "../../../shared/sendResponse";


const initPayment = async (req: Request, res: Response, next: NextFunction) => {
    const { appointmentId } = req.params;
    const result = await PaymentService.initPayment(req.body, appointmentId)
    //res.redirect(result.paymentUrl)
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Payment init successfully",
        data: result
    })
};

const validate = async (req: Request, res: Response, next: NextFunction) => {
    const result = await PaymentService.validate(req.query);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Payment verified!",
        data: result
    })
}

export const PaymentController = {
    initPayment,
    validate
};