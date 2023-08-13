"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const auth_1 = __importDefault(require("../middlewares/auth"));
const user_controller_1 = require("../controllers/user.controller");
router.post('/', user_controller_1.createUser);
router.delete('/', auth_1.default, user_controller_1.deleteUser);
router.get('/all', auth_1.default, user_controller_1.getAllUsers);
router.get('/', auth_1.default, user_controller_1.getUser);
router.post('/auth', user_controller_1.AuthUser);
router.post('/verify_account', user_controller_1.verifyAccount);
router.put('/', user_controller_1.ResetUser);
exports.default = router;
