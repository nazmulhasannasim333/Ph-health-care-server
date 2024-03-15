import axios from "axios"
import config from "../../../config"
import { PaymentInfo } from "./ssl.interface";
import ApiError from "../../../errors/ApiError";
import httpStatus from "http-status";

const initPayment = async (paymentData: PaymentInfo) => {
    try {
        const data = {
            store_id: config.ssl.storeId,
            store_passwd: config.ssl.storePass,
            total_amount: paymentData.amount,
            currency: 'BDT',
            tran_id: paymentData.transactionId,
            success_url: config.ssl.successUrl,
            fail_url: config.ssl.failUrl,
            cancel_url: config.ssl.cancelUrl,
            ipn_url: 'http://localhost:3000/api/v1/payment/ipn',
            shipping_method: 'N/A',
            product_name: 'Doctor Appoinment',
            product_category: 'Appointment',
            product_profile: 'general',
            cus_name: paymentData.customerName,
            cus_email: paymentData.customerEmail,
            cus_add1: "address",
            cus_city: 'Dhaka',
            cus_state: 'Dhaka',
            cus_postcode: '1000',
            cus_country: 'Bangladesh',
            cus_phone: "93843483",
            cus_fax: '01711111111',
            ship_name: 'Customer Name',
            ship_add1: 'Dhaka',
            ship_add2: 'Dhaka',
            ship_city: 'Dhaka',
            ship_state: 'Dhaka',
            ship_postcode: 1000,
            ship_country: 'Bangladesh',
        };
        const response = await axios({
            method: 'post',
            url: config.ssl.sslPaymentUrl,
            data: data,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });

        return response.data
    }
    catch (err) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Payment error")
    }
};

const validate = async (data: any) => {
    try {
        const response = await axios({
            method: 'GET',
            url: `${config.ssl.validationUrl}?val_id=${data.val_id}&store_id=${config.ssl.storeId}&store_passwd=${config.ssl.storePass}&format=json`
        })
        return response.data;
    }
    catch (err) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Payment error")
    }
}

export const sslServices = {
    initPayment,
    validate
}