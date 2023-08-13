"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminModel = exports.ValidateAdmin = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const joi_browser_1 = __importDefault(require("joi-browser"));
const adminSchema = new mongoose_1.default.Schema({
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
    }
}, { timestamps: true });
function ValidateAdmin(user) {
    const schema = {
        firstName: joi_browser_1.default.string().required(),
        lastName: joi_browser_1.default.string().required(),
        password: joi_browser_1.default.string().min(5).required(),
        email: joi_browser_1.default.string().email().required(),
    };
    return joi_browser_1.default.validate(user, schema);
}
exports.ValidateAdmin = ValidateAdmin;
exports.AdminModel = mongoose_1.default.model('admin', adminSchema);
