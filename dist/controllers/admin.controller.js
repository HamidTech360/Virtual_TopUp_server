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
exports.getAdmin = exports.AuthAdmin = exports.createAdmin = void 0;
const admin_model_1 = require("../models/admin.model");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const joi_browser_1 = __importDefault(require("joi-browser"));
const config_1 = require("../config");
const config = (0, config_1.CONFIG)();
const createAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = (0, admin_model_1.ValidateAdmin)(req.body);
    if (error)
        return res.status(400).send(error.details[0].message);
    try {
        const findAdmin = yield admin_model_1.AdminModel.findOne({ email: req.body.email });
        if (findAdmin)
            return res.status(401).send('Email has been taken');
        const newAdmin = new admin_model_1.AdminModel({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password,
        });
        const salt = yield bcryptjs_1.default.genSalt(10);
        newAdmin.password = yield bcryptjs_1.default.hash(newAdmin.password, salt);
        // console.log(newAdmin);
        const saveUser = yield newAdmin.save();
        res.json({
            status: 'success',
            message: 'Admin created successfully',
            data: {}
        });
    }
    catch (ex) {
        res.status(500).send(ex);
    }
});
exports.createAdmin = createAdmin;
const AuthAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = Validate(req.body);
    if (error)
        return res.status(400).send(error.details[0].message);
    try {
        const checkAdmin = yield admin_model_1.AdminModel.findOne({ email: req.body.email });
        if (!checkAdmin)
            return res.status(401).send('Admin not found');
        const checkPwd = yield bcryptjs_1.default.compare(req.body.password, checkAdmin.password);
        if (!checkPwd)
            return res.status(401).send('Invalid password');
        const token = jsonwebtoken_1.default.sign(Object.assign({}, checkAdmin), `${process.env.JWT_SECRET}`);
        res.json({
            status: 'success',
            message: 'Login successful',
            token,
        });
    }
    catch (ex) {
    }
});
exports.AuthAdmin = AuthAdmin;
const getAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const admin = yield admin_model_1.AdminModel.findById(req.user._doc._id);
        admin.password = "";
        res.json({
            status: 'success',
            data: admin
        });
    }
    catch (error) {
        res.status(403).send(error);
    }
});
exports.getAdmin = getAdmin;
function Validate(user) {
    const schema = {
        email: joi_browser_1.default.string().required(),
        password: joi_browser_1.default.string().required()
    };
    return joi_browser_1.default.validate(user, schema);
}
