"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const userSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    lastLoginAt: {
        type: Date
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    lastPasswordChange: Date,
    settings: {
        notifications: {
            email: {
                type: Boolean,
                default: true
            },
            push: {
                type: Boolean,
                default: true
            }
        },
        timezone: {
            type: String,
            default: 'UTC'
        },
        language: {
            type: String,
            default: 'en'
        },
        analyticsPreferences: {
            defaultTimeRange: {
                type: String,
                default: '30d'
            },
            defaultPlatform: {
                type: String,
                default: 'all'
            },
            dashboardLayout: {
                type: Map,
                of: mongoose_1.default.Schema.Types.Mixed,
                default: {}
            }
        }
    }
}, {
    timestamps: true
});
// Add comparePassword method
userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcryptjs_1.default.compare(candidatePassword, this.password);
};
// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password'))
        return next();
    try {
        const salt = await bcryptjs_1.default.genSalt(10);
        this.password = await bcryptjs_1.default.hash(this.password, salt);
        next();
    }
    catch (error) {
        if (error instanceof Error) {
            next(error);
        }
        else {
            next(new Error('An unknown error occurred while hashing the password'));
        }
    }
});
// Indexes
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ resetPasswordToken: 1 }, { sparse: true });
exports.User = mongoose_1.default.model('User', userSchema);
