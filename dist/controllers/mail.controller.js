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
exports.sendMail = void 0;
const mail_1 = __importDefault(require("@sendgrid/mail"));
const config_1 = require("../config");
const config = (0, config_1.CONFIG)();
const sendMail = (receiver_email, subject, email_body) => __awaiter(void 0, void 0, void 0, function* () {
    //console.log('in the mail functiion');
    try {
        mail_1.default.setApiKey(`${config.SEND_GRID_EMAIL_KEY}`);
        const message = {
            to: receiver_email,
            from: {
                name: 'Hamid',
                email: 'hamid@icopystory.com'
            },
            subject,
            text: 'Email from Easytopup',
            html: email_body
        };
        const response = yield mail_1.default.send(message);
        console.log('Email sent successfully');
    }
    catch (ex) {
        console.log(ex);
    }
});
exports.sendMail = sendMail;
