"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const authController_1 = require("../controllers/authController");
const validateRequest_1 = __importDefault(require("../middleware/validateRequest"));
const router = express_1.default.Router();
// Login validation
const loginValidation = [
    (0, express_validator_1.body)('email').isEmail().withMessage('Please enter a valid email'),
    (0, express_validator_1.body)('password').notEmpty().withMessage('Password is required'),
];
// Registration validation
const registerValidation = [
    (0, express_validator_1.body)('name').trim().isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
    (0, express_validator_1.body)('email').isEmail().withMessage('Please enter a valid email'),
    (0, express_validator_1.body)('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters')
        .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/)
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
];
// Forgot password validation
const forgotPasswordValidation = [
    (0, express_validator_1.body)('email').isEmail().withMessage('Please enter a valid email'),
];
// Reset password validation
const resetPasswordValidation = [
    (0, express_validator_1.body)('email').isEmail().withMessage('Please enter a valid email'),
    (0, express_validator_1.body)('otp').notEmpty().withMessage('OTP is required'),
    (0, express_validator_1.body)('newPassword')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters')
        .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/)
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
];
// Routes
router.post('/login', loginValidation, validateRequest_1.default, authController_1.login);
router.post('/register', registerValidation, validateRequest_1.default, authController_1.register);
router.post('/forgot-password', forgotPasswordValidation, validateRequest_1.default, authController_1.forgotPassword);
router.post('/reset-password', resetPasswordValidation, validateRequest_1.default, authController_1.resetPassword);
exports.default = router;
