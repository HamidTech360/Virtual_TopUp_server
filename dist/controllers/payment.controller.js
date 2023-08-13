"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllPayments = exports.getPayments = exports.VerifyPayment = exports.Pay = void 0;
const index_1 = require("../config/index");
const user_model_1 = require("../models/user.model");
const payment_model_1 = require("../models/payment.model");
const config = (0, index_1.CONFIG)();
const joi_browser_1 = __importDefault(require("joi-browser"));
const axios_1 = __importDefault(require("axios"));
function transactionCharge(amount) {
    if (amount <= 1000) {
        return 5000;
    }
    else if (amount > 1000 && amount <= 5000) {
        return 10000;
    }
    else if (amount > 5000 && amount <= 15000) {
        return 15000;
    }
    else {
        return 20000;
    }
}
const Pay = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = Validate(req.body);
    if (error)
        return res.status(401).send(error.details[0].message);
    req.body.amount = parseFloat(req.body.amount) * 100;
    console.log(req.body.amount);
    req.body.amount += transactionCharge(req.body.amount / 100);
    console.log(req.body);
    try {
        const response = yield axios_1.default.post(`${process.env.PAYMENT_API}/transaction/initialize`, req.body, {
            headers: {
                'Authorization': `Bearer ${process.env.PAYMENT_SECRET_KEY}`
            }
        });
        res.send(response.data);
    }
    catch (ex) {
        res.status(400).send('Error processing payment. Please try again');
        console.log(ex);
    }
});
exports.Pay = Pay;
const VerifyPayment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const findRef = yield payment_model_1.PaymentModel.findOne({ reference: req.body.ref });
        if (findRef)
            return res.status(400).send('Transaction already verified');
        const response = yield axios_1.default.get(`${process.env.PAYMENT_API}/transaction/verify/${req.body.ref}`, {
            headers: {
                'Authorization': `Bearer ${process.env.PAYMENT_SECRET_KEY}`
            }
        });
        if (!response.data.status)
            return res.status(400).send('could not verify');
        const user = yield user_model_1.UserModel.findOne({ email: req.user._doc.email });
        if (!user)
            return;
        const { reference, gateway_response, id, amount, currency } = response.data.data;
        const newPayment = new payment_model_1.PaymentModel({
            reference, gateway_response, amount, currency, trxId: id, email: req.user._doc.email
        });
        const savePayment = yield newPayment.save();
        const amountPaid = response.data.data.amount / 100 - transactionCharge(response.data.data.amount / 100) / 100;
        console.log(amountPaid);
        user.set({
            walletBalance: user.walletBalance + amountPaid
        });
        const result = yield user.save();
        res.json({
            verified: true,
            message: 'Transaction verified successfully',
            data: result
        });
    }
    catch (ex) {
        res.status(500).send('Failed to verify transaction');
    }
});
exports.VerifyPayment = VerifyPayment;
const getPayments = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const payments = yield payment_model_1.PaymentModel.find({ email: req.user._doc.email });
        payments.map(item => item.amount = (item.amount / 100));
        //console.log(payments);
        res.json({
            status: 'success',
            message: 'Payment history retrieved successfully',
            data: payments
        });
    }
    catch (ex) {
        res.status(500).send("Failed to load payment history");
    }
});
exports.getPayments = getPayments;
const getAllPayments = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allPayments = yield payment_model_1.PaymentModel.find();
        allPayments.map(item => item.amount = item.amount / 100);
        res.json({
            status: 'success',
            message: 'Payment history retrieved successfully',
            data: allPayments
        });
    }
    catch (ex) {
        res.status(500).send("Failed to load payment history");
    }
});
exports.getAllPayments = getAllPayments;
function Validate(payload) {
    const schema = {
        email: joi_browser_1.default.string().required(),
        amount: joi_browser_1.default.string().required()
    };
    return joi_browser_1.default.validate(payload, schema);
}
