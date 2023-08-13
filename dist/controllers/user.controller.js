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
exports.ResetUser = exports.deleteUser = exports.getAllUsers = exports.getUser = exports.AuthUser = exports.verifyAccount = exports.createUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const joi_browser_1 = __importDefault(require("joi-browser"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const index_1 = require("../config/index");
const config = (0, index_1.CONFIG)();
const user_model_1 = require("../models/user.model");
const payment_model_1 = require("../models/payment.model");
const mail_controller_1 = require("./mail.controller");
const createUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = (0, user_model_1.ValidateUser)(req.body);
    if (error)
        return res.status(400).send(error.details[0].message);
    try {
        const findUser = yield user_model_1.UserModel.findOne({ email: req.body.email });
        if (findUser)
            return res.status(401).send('Email has been taken');
        const token = jsonwebtoken_1.default.sign({ email: req.body.email }, `${config.JWT_SECRET}`);
        console.log('Email sent successfully');
        const newUser = new user_model_1.UserModel({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password,
            phoneNo: req.body.phoneNo,
            walletBalance: 0,
            referralBonus: 0,
            confirmationCode: token
        });
        const salt = yield bcryptjs_1.default.genSalt(10);
        newUser.password = yield bcryptjs_1.default.hash(newUser.password, salt);
        // console.log(newUser);
        const saveUser = yield newUser.save();
        res.json({
            status: 'success',
            message: 'User created successfully',
            data: {}
        });
        const email_body = `
            <div>
                <div>Welcome to EasyTopUp. We hope to serve you with the best experience</div>
                <div> click <a href="https://easytopup.netlify.app/verify_account/${newUser.confirmationCode}">HERE</a> to verify your account</div>
            </div>
        `;
        (0, mail_controller_1.sendMail)(req.body.email, 'EasyTopUp Accout verification', email_body);
    }
    catch (ex) {
        res.status(500).send(ex);
    }
});
exports.createUser = createUser;
const verifyAccount = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { ref } = req.body;
    try {
        const checkCode = yield user_model_1.UserModel.findOne({ confirmationCode: ref });
        if (!checkCode)
            return res.status(400).send('Failed to verify account');
        checkCode.confirmationCode = "verified";
        checkCode.save();
        res.json({
            status: 'success',
            message: 'Account successfully verified'
        });
    }
    catch (ex) {
        res.status(500).send('Server Error. Cannot verify account');
    }
});
exports.verifyAccount = verifyAccount;
const AuthUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = Validate(req.body);
    if (error)
        return res.status(400).send(error.details[0].message);
    try {
        const checkUser = yield user_model_1.UserModel.findOne({ email: req.body.email });
        if (!checkUser)
            return res.status(401).send('User not found');
        const checkPwd = yield bcryptjs_1.default.compare(req.body.password, checkUser.password);
        if (!checkPwd)
            return res.status(401).send('Invalid password');
        const token = jsonwebtoken_1.default.sign(Object.assign({}, checkUser), `${config.JWT_SECRET}`);
        res.json({
            status: 'success',
            message: 'Login successful',
            token,
        });
    }
    catch (ex) {
        res.status(500).send('Server Error');
    }
});
exports.AuthUser = AuthUser;
const getUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_model_1.UserModel.findById(req.user._doc._id);
        user.password = "";
        res.json({
            status: 'success',
            data: user
        });
    }
    catch (error) {
        res.status(403).send(error);
    }
});
exports.getUser = getUser;
const getAllUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield user_model_1.UserModel.find();
        const walletBalanceArr = users.map(item => item.walletBalance);
        const totalWalletBalance = walletBalanceArr.reduce((Psum, a) => Psum + a, 0);
        const Payments = yield payment_model_1.PaymentModel.find();
        const allPaymentArr = Payments.map(item => item.amount / 100);
        const totalPayment = allPaymentArr.reduce((Psum, a) => Psum + a, 0);
        // const paymentArr = users.map(item=>item)
        res.json({
            status: 'success',
            data: users,
            stats: { totalWalletBalance, totalPayment }
        });
    }
    catch (ex) {
        res.status(500).send('Cannot fetch users');
    }
});
exports.getAllUsers = getAllUsers;
const deleteUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deleteUser = yield user_model_1.UserModel.findByIdAndDelete(req.params.id);
        if (deleteUser) {
            res.json({
                status: 'success',
                message: 'Post deleted successfully'
            });
        }
    }
    catch (ex) {
        res.status(500).send('Failed to delete User. Server Error');
    }
});
exports.deleteUser = deleteUser;
const ResetUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = Validate(req.body);
    if (error)
        return res.status(400).send(error.details[0].message);
    try {
        const { password } = req.body;
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        const editUser = yield user_model_1.UserModel.findOneAndUpdate({ email: req.body.email }, { password: hashedPassword }, { new: true });
        res.json({
            status: 'success',
            message: 'Password reset successfull',
            data: editUser
        });
    }
    catch (ex) {
        res.status(500).send('Failed to edit User');
    }
});
exports.ResetUser = ResetUser;
function Validate(user) {
    const schema = {
        email: joi_browser_1.default.string().required(),
        password: joi_browser_1.default.string().required()
    };
    return joi_browser_1.default.validate(user, schema);
}
