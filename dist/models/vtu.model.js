"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VtuModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const vtuSchema = new mongoose_1.default.Schema({
    email: {
        required: true,
        type: String
    },
    amount: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        required: true
    }
}, { timestamps: true });
exports.VtuModel = mongoose_1.default.model('vtu_transaction', vtuSchema);
