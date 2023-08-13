"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../config/index");
const config = (0, index_1.CONFIG)();
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function auth(req, res, next) {
    const token = req.header('Authorization');
    if (!token)
        return res.status(403).send('Access denied');
    try {
        const decoded = jsonwebtoken_1.default.verify(token, `${config.JWT_SECRET}`);
        req.user = decoded;
        next();
    }
    catch (error) {
        res.status(403).send('Invalid token supplied');
    }
}
exports.default = auth;
