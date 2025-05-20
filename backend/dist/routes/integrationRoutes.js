"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const integrationController_1 = require("../controllers/integrationController");
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const router = express_1.default.Router();
// All routes require authentication
router.use(authMiddleware_1.default);
// Get all social media integrations
router.get('/accounts', integrationController_1.integrationController.getSocialMediaIntegrations);
// Initiate OAuth flow for a platform
router.post('/oauth/:platform', integrationController_1.integrationController.initiateOAuth);
// Disconnect an account
router.post('/accounts/:integrationId/disconnect', integrationController_1.integrationController.disconnectAccount);
// Reconnect an account
router.post('/accounts/:integrationId/reconnect', integrationController_1.integrationController.reconnectAccount);
// Update integration settings
router.patch('/accounts/:integrationId', integrationController_1.integrationController.updateIntegrationSettings);
exports.default = router;
