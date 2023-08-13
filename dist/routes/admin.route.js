"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const auth_1 = __importDefault(require("../middlewares/auth"));
const admin_controller_1 = require("../controllers/admin.controller");
router.post('/', admin_controller_1.createAdmin);
router.post('/auth', admin_controller_1.AuthAdmin);
router.get('/', auth_1.default, admin_controller_1.getAdmin);
exports.default = router;
