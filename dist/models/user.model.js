"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = exports.ValidateUser = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const joi_browser_1 = __importDefault(require("joi-browser"));
const userSchema = new mongoose_1.default.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    phoneNo: {
        type: String,
        required: true
    },
    walletBalance: {
        type: Number,
        required: true
    },
    referralBonus: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'verified'],
        default: 'pending'
    },
    confirmationCode: {
        type: String,
        unique: true
    }
}, { timestamps: true });
function ValidateUser(user) {
    const schema = {
        firstName: joi_browser_1.default.string().required(),
        lastName: joi_browser_1.default.string().required(),
        password: joi_browser_1.default.string().min(5).required(),
        email: joi_browser_1.default.string().email().required(),
        phoneNo: joi_browser_1.default.string().required()
    };
    return joi_browser_1.default.validate(user, schema);
}
exports.ValidateUser = ValidateUser;
exports.UserModel = mongoose_1.default.model('user', userSchema);
// export {ValidateUser as ValidateUser};
