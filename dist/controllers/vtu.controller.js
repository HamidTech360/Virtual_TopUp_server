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
exports.Statistics = exports.GetAllTransactions = exports.GetTransactions = exports.BuyData = exports.BuyAirTime = exports.GetDataPlans = exports.FetchNetworkID = void 0;
const config_1 = require("../config");
const config = (0, config_1.CONFIG)();
const joi_browser_1 = __importDefault(require("joi-browser"));
const axios_1 = __importDefault(require("axios"));
const vtu_model_1 = require("../models/vtu.model");
const user_model_1 = require("../models/user.model");
const payment_model_1 = require("../models/payment.model");
const FetchNetworkID = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield axios_1.default.get(`${config.VTU_URL}/get/network/`, { headers: {
                'Authorization': `Token ${config.VTU_API_KEY}`
            } });
        res.send(response.data);
    }
    catch (ex) {
        res.status(500).send('Server Error');
    }
});
exports.FetchNetworkID = FetchNetworkID;
const GetDataPlans = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield axios_1.default.get(`${config.VTU_URL}/network`, { headers: {
                'Authorization': `Token ${config.VTU_API_KEY}`
            } });
        res.send(response.data);
    }
    catch (ex) {
        res.status(500).send('Server Error');
    }
});
exports.GetDataPlans = GetDataPlans;
const BuyAirTime = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { error } = ValidateAirtimeReq(req.body);
    if (error)
        return res.status(400).send(error.details[0].message);
    const user = yield user_model_1.UserModel.findOne({ email: req.user._doc.email });
    if (!user)
        return res.status(400).send('you are not an authorized user');
    req.body.amount = parseInt(req.body.amount);
    //console.log(req.body);
    if (user.walletBalance < req.body.amount)
        return res.status(400).send('Insufficient Balance');
    if (req.body.amount < 50)
        return res.status(400).send('The least you can purchase is NGN 50');
    try {
        const payload = {
            network: req.body.network,
            amount: req.body.amount,
            mobile_number: req.body.mobile_number,
            airtime_type: "VTU",
            Ported_number: false,
        };
        console.log(payload);
        const response = yield axios_1.default.post(`${config.VTU_URL}/topup/`, Object.assign({}, payload), { headers: {
                'Authorization': `Token ${config.VTU_API_KEY}`,
            } });
        console.log(response.data);
        if (response.data.Status !== "successful")
            return res.status(400).send("something went wrong");
        user.set({
            walletBalance: user.walletBalance - req.body.amount
        });
        const result = yield user.save();
        const newTransaction = new vtu_model_1.VtuModel({
            amount: response.data.amount,
            type: 'Airtime',
            email: user.email
        });
        const saveTransaction = newTransaction.save();
        res.json({
            status: true,
            message: "Airtime purchase successfull",
            data: result,
            details: response.data
        });
        console.log(response.data);
    }
    catch (ex) {
        res.status(500).send('Cannot process transaction now. Please refer to the Admin');
        console.log((_a = ex.response) === null || _a === void 0 ? void 0 : _a.data);
    }
});
exports.BuyAirTime = BuyAirTime;
const BuyData = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const { error } = ValidateDataReq(req.body);
    if (error)
        return res.status(400).send(error.details[0].message);
    const user = yield user_model_1.UserModel.findOne({ email: req.user._doc.email });
    if (!user)
        return res.status(400).send('you are not an authorized user');
    const splitPlan = req.body.plan.split('-');
    const planAmount = parseInt(splitPlan[1]);
    if (user.walletBalance < (planAmount + (0.05 * planAmount)))
        return res.status(400).send('Insufficient Balance');
    try {
        const payload = {
            network: req.body.network,
            mobile_number: req.body.mobile_number,
            plan: splitPlan[0],
            Ported_number: false,
        };
        console.log(payload, planAmount);
        const response = yield axios_1.default.post(`${config.VTU_URL}/data/`, Object.assign({}, payload), { headers: {
                'Authorization': `Token ${config.VTU_API_KEY}`,
            } });
        console.log(response.data);
        if (response.data.Status !== "successful")
            return res.status(400).send("something went wrong");
        user.set({
            walletBalance: user.walletBalance - (planAmount + (0.05 * planAmount))
        });
        const result = yield user.save();
        const newTransaction = new vtu_model_1.VtuModel({
            amount: planAmount + (0.05 * planAmount),
            type: 'Data',
            email: user.email
        });
        const saveTransaction = newTransaction.save();
        res.json({
            status: true,
            message: "Data purchase successfull",
            data: result,
            details: response.data
        });
    }
    catch (ex) {
        res.status(500).send('Cannot process transaction now. Please refer to the Admin');
        console.log((_b = ex.response) === null || _b === void 0 ? void 0 : _b.data);
    }
});
exports.BuyData = BuyData;
const GetTransactions = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield vtu_model_1.VtuModel.find({ email: req.user._doc.email });
        res.json({
            status: 'success',
            message: 'Payment history retrieved successfully',
            data: response
        });
    }
    catch (ex) {
        res.status(500).send("Failed to load transaction history");
    }
});
exports.GetTransactions = GetTransactions;
const GetAllTransactions = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield vtu_model_1.VtuModel.find();
        res.json({
            status: 'success',
            message: 'Payment history retrieved successfully',
            data: response
        });
    }
    catch (ex) {
        res.status(500).send("Failed to load transaction history");
    }
});
exports.GetAllTransactions = GetAllTransactions;
const Statistics = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // let walletTotal = 0
    // let vtuTotal = 0
    try {
        const vtu = yield vtu_model_1.VtuModel.find({ email: req.user._doc.email });
        let vtuArr = vtu.map((item, i) => item.amount);
        const totalVtu = vtuArr.reduce((Psum, a) => Psum + a, 0);
        const payment = yield payment_model_1.PaymentModel.find({ email: req.user._doc.email });
        let paymentArr = payment.map(item => (item.amount - 5000) / 100);
        const totalPayment = paymentArr.reduce((Psum, a) => Psum + a, 0);
        const Checkbalance = yield user_model_1.UserModel.findOne({ email: req.user._doc.email });
        const walletBalance = Checkbalance.walletBalance;
        res.json({
            status: 'success',
            message: 'data retrieved successfully',
            data: {
                totalVtu, totalPayment, walletBalance
            }
        });
    }
    catch (ex) {
        res.status(500).send("Failed to load statistics");
    }
});
exports.Statistics = Statistics;
function ValidateDataReq(payload) {
    const schema = {
        network: joi_browser_1.default.string().required(),
        plan: joi_browser_1.default.string().required(),
        mobile_number: joi_browser_1.default.string().required()
    };
    return joi_browser_1.default.validate(payload, schema);
}
function ValidateAirtimeReq(payload) {
    const schema = {
        network: joi_browser_1.default.string().required(),
        amount: joi_browser_1.default.string().required(),
        mobile_number: joi_browser_1.default.string().required()
    };
    return joi_browser_1.default.validate(payload, schema);
}
