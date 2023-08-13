"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const review_controller_1 = require("../controllers/review.controller");
const auth_1 = __importDefault(require("../middlewares/auth"));
router.post('/', auth_1.default, review_controller_1.postReview);
router.get('/', review_controller_1.getReviews);
exports.default = router;
