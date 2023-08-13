"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const paymentSchema = new mongoose_1.default.Schema({
    amount: {
        type: Number,
        required: true
    },
    reference: {
        type: String
    },
    trxId: {
        type: String
    },
    currency: {
        type: String
    },
    gateway_response: {
        type: String
    },
    email: {
        type: String,
        required: true
    }
}, { timestamps: true });
exports.PaymentModel = mongoose_1.default.model('payment', paymentSchema);
