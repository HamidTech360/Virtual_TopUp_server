"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewModel = exports.Validate = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const joi_browser_1 = __importDefault(require("joi-browser"));
const reviewSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    review: {
        type: String,
        required: true
    }
}, { timestamps: true });
function Validate(payload) {
    const schema = {
        review: joi_browser_1.default.string().required()
    };
    return joi_browser_1.default.validate(payload, schema);
}
exports.Validate = Validate;
exports.ReviewModel = mongoose_1.default.model('review', reviewSchema);
