"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Integration = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const integrationSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    serviceId: {
        type: String,
        required: true
    },
    serviceName: {
        type: String,
        required: true
    },
    serviceType: {
        type: String,
        required: true,
        enum: ['urlShortener', 'socialMedia', 'analytics', 'email', 'other']
    },
    apiKey: {
        type: String,
        select: false // Protect sensitive API keys from default queries
    },
    isConnected: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        required: true,
        enum: ['active', 'inactive', 'error'],
        default: 'inactive'
    },
    settings: {
        type: mongoose_1.Schema.Types.Mixed,
        default: {}
    },
    credentials: {
        type: mongoose_1.Schema.Types.Mixed,
        default: {},
        select: false // Protect sensitive credentials
    },
    // Social Media specific fields
    platform: {
        type: String,
        enum: ['twitter', 'facebook', 'linkedin', 'instagram', 'pinterest'],
        sparse: true
    },
    username: {
        type: String,
        sparse: true
    },
    displayName: {
        type: String,
        sparse: true
    },
    profileImageUrl: {
        type: String,
        sparse: true
    },
    metadata: {
        type: mongoose_1.Schema.Types.Mixed,
        default: {
            icon: '',
            description: '',
            website: '',
            apiDocumentation: '',
            accountType: 'personal',
            scopes: []
        }
    },
    lastConnectedAt: {
        type: Date
    }
}, {
    timestamps: true
});
// Compound index to ensure a user doesn't have duplicate service integrations
integrationSchema.index({ userId: 1, serviceId: 1 }, { unique: true });
// Index for social media accounts
integrationSchema.index({ userId: 1, platform: 1, username: 1 }, { sparse: true });
exports.Integration = mongoose_1.default.model('Integration', integrationSchema);
