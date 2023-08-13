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
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerifyAccount = void 0;
const user_model_1 = require("../models/user.model");
const VerifyAccount = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_model_1.UserModel.findOne({ confirmationCode: req.body.confirmationCode });
        if (!user)
            return res.status(400).send('User not found');
        user.set({
            status: 'verified'
        });
        const result = yield user.save();
        res.json({
            status: 'success',
            message: 'User has been successfully verified',
            data: result
        });
    }
    catch (err) {
        res.status(500).send('Problem occured while verifying email');
    }
});
exports.VerifyAccount = VerifyAccount;
