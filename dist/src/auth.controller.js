"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var AuthController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const auth_service_1 = require("./auth.service");
const jwt_1 = require("@nestjs/jwt");
const dto_1 = require("../utils/dto");
const cloudinary_1 = require("cloudinary");
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
const jwt = require("jsonwebtoken");
const config_1 = require("@nestjs/config");
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
const storage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_1.v2,
    params: {
        folder: 'profile-pictures',
        resource_type: 'image',
        format: () => 'png',
        public_id: (req, file) => `${Date.now()}_${file.originalname.split('.')[0]}`,
    },
});
let AuthController = AuthController_1 = class AuthController {
    authService;
    jwtService;
    configService;
    logger = new common_1.Logger(AuthController_1.name);
    constructor(authService, jwtService, configService) {
        this.authService = authService;
        this.jwtService = jwtService;
        this.configService = configService;
    }
    async registerUser(data) {
        return this.authService.register(data);
    }
    async loginUser(data) {
        return this.authService.login(data);
    }
    async verifyToken(data) {
        try {
            const { token } = data;
            const payload = this.jwtService.verify(token, {
                secret: process.env.JWT_SECRET,
            });
            this.logger.log(`Token verified for user: ${payload.sub}`);
            return {
                userId: payload.sub,
                email: payload.email,
                name: payload.name,
            };
        }
        catch (error) {
            this.logger.error(`JWT verification failed: ${error.message}`);
            return { error: 'Invalid token' };
        }
    }
    async getProfileFromToken(data) {
        try {
            const user = await this.authService.getProfile(Number(data.Id));
            return user;
        }
        catch (error) {
            return { message: 'Unauthorized', error: error.message };
        }
    }
    async updateProfile(data) {
        const { body: updateProfileDto, file, cookies } = data;
        const token = cookies?.jwt;
        if (!token) {
            return { message: 'Unauthorized: No token provided' };
        }
        const secret = this.configService.get('JWT_SECRET');
        if (!secret) {
            return { message: 'Server configuration error: JWT secret not found' };
        }
        const decoded = jwt.verify(token, secret);
        const userId = decoded.sub || decoded.id;
        if (!userId) {
            return { message: 'Unauthorized: Invalid token' };
        }
        const profilePicture = file?.path;
        const updatedUser = await this.authService.updateProfile(userId, updateProfileDto, profilePicture);
        return {
            message: 'Profile updated successfully',
            user: updatedUser,
        };
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, microservices_1.MessagePattern)({ cmd: 'register_user' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.RegisterDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "registerUser", null);
__decorate([
    (0, microservices_1.MessagePattern)({ cmd: 'login_user' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.LoginDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "loginUser", null);
__decorate([
    (0, microservices_1.MessagePattern)({ cmd: 'verify_token' }),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyToken", null);
__decorate([
    (0, microservices_1.MessagePattern)({ cmd: 'get_profile' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getProfileFromToken", null);
__decorate([
    (0, microservices_1.MessagePattern)('update-profile'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "updateProfile", null);
exports.AuthController = AuthController = AuthController_1 = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map