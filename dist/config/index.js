"use strict";
// module.exports = (()=>{
// })()
Object.defineProperty(exports, "__esModule", { value: true });
exports.CONFIG = void 0;
const CONFIG = () => {
    const env = process.env.NODE_ENV;
    if (env !== 'production')
        require('dotenv').config();
    return {
        DATABASE_URL: process.env.DATABASE_URL,
        JWT_SECRET: process.env.JWT_SECRET,
        PORT: process.env.PORT,
        PAYMENT_SECRET_KEY: process.env.PAYMENT_SECRET_KEY,
        PAYMENT_API: process.env.PAYMENT_API,
        VTU_API_KEY: process.env.VTU_API_KEY,
        VTU_URL: process.env.VTU_URL,
        SEND_GRID_EMAIL_KEY: process.env.SEND_GRID_EMAIL_KEY,
        EMAIL: process.env.EMAIL,
        PASSWORD: process.env.PASSWORD,
        REFRESH_TOKEN: process.env.REFRESH_TOKEN,
        ACCESS_TOKEN: process.env.ACCESS_TOKEN,
        CLIENT_ID: process.env.CLIENT_ID,
        CLIENT_SECRET: process.env.CLIENT_SECRET
    };
};
exports.CONFIG = CONFIG;
