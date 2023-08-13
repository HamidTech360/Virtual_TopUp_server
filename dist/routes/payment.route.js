"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const payment_controller_1 = require("../controllers/payment.controller");
const auth_1 = __importDefault(require("../middlewares/auth"));
router.post('/', auth_1.default, payment_controller_1.Pay);
router.post('/verify', auth_1.default, payment_controller_1.VerifyPayment);
router.get('/', auth_1.default, payment_controller_1.getPayments);
router.get('/all_payments', payment_controller_1.getAllPayments);
//trxref=33x97h1ut7&reference=33x97h1ut7
exports.default = router;
