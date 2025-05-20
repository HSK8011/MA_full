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
const jsonwebtoken_1 = __importStar(require("jsonwebtoken"));
const config_1 = require("../config");
const auth = async (req, res, next) => {
    try {
        console.log('🔒 [Auth Middleware] Checking authentication');
        // Get token from header
        const authHeader = req.header('Authorization');
        console.log('📝 Authorization Header:', authHeader ? 'Present' : 'Missing');
        if (!authHeader?.startsWith('Bearer ')) {
            console.log('❌ [Auth Error] Invalid authorization header format');
            return res.status(401).json({
                message: 'Invalid authorization header format',
                code: 'INVALID_AUTH_FORMAT'
            });
        }
        const token = authHeader.replace('Bearer ', '');
        if (!token) {
            console.log('❌ [Auth Error] No token provided');
            return res.status(401).json({
                message: 'Authentication token is required',
                code: 'TOKEN_REQUIRED'
            });
        }
        try {
            // Verify token
            const decoded = jsonwebtoken_1.default.verify(token, config_1.config.jwtSecret);
            console.log('✅ [Auth Success] Token verified for user:', decoded.userId);
            // Add user and userId to request
            req.user = decoded;
            req.userId = decoded.userId;
            next();
        }
        catch (error) {
            console.error('❌ [JWT Error]:', error);
            if (error instanceof jsonwebtoken_1.TokenExpiredError) {
                return res.status(401).json({
                    message: 'Token has expired',
                    code: 'TOKEN_EXPIRED'
                });
            }
            if (error instanceof jsonwebtoken_1.JsonWebTokenError) {
                return res.status(401).json({
                    message: 'Invalid authentication token',
                    code: 'INVALID_TOKEN'
                });
            }
            return res.status(401).json({
                message: 'Authentication failed',
                code: 'AUTH_FAILED'
            });
        }
    }
    catch (error) {
        console.error('❌ [Auth Middleware Error]:', error);
        res.status(500).json({
            message: 'Internal server error during authentication',
            code: 'AUTH_ERROR'
        });
    }
};
exports.default = auth;
