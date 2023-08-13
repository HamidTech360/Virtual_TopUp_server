"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const auth_1 = __importDefault(require("../middlewares/auth"));
const vtu_controller_1 = require("../controllers/vtu.controller");
router.post('/airtime', auth_1.default, vtu_controller_1.BuyAirTime);
router.post('/data', auth_1.default, vtu_controller_1.BuyData);
router.get('/', vtu_controller_1.FetchNetworkID);
router.get('/history', auth_1.default, vtu_controller_1.GetTransactions);
router.get('/stats', auth_1.default, vtu_controller_1.Statistics);
router.get('/data', vtu_controller_1.GetDataPlans);
router.get('/all_transactions', auth_1.default, vtu_controller_1.GetAllTransactions);
exports.default = router;
