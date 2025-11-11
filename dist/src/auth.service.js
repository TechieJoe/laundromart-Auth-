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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcrypt");
const entity_1 = require("../utils/entity");
let AuthService = class AuthService {
    usersRepository;
    jwtService;
    constructor(usersRepository, jwtService) {
        this.usersRepository = usersRepository;
        this.jwtService = jwtService;
    }
    async register(registerDto) {
        const { name, email, password } = registerDto;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = this.usersRepository.create({ name, email, password: hashedPassword });
        const savedUser = await this.usersRepository.save(user);
        const payload = { email: savedUser.email, name: savedUser.name, sub: savedUser.id };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
    async validateUser(email, password) {
        const user = await this.usersRepository.findOne({ where: { email } });
        if (user && (await bcrypt.compare(password, user.password))) {
            return user;
        }
        return null;
    }
    async login(loginDto) {
        const { email, password } = loginDto;
        const user = await this.validateUser(email, password);
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const payload = { email: user.email, name: user.name, sub: user.id };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
    async getProfile(userId) {
        const user = await this.usersRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            profilePicture: user.profilePicture ?? '/uploads/default-profile.png',
        };
    }
    async updateProfile(userId, updateProfileDto, profilePicture) {
        const user = await this.usersRepository.findOne({ where: { id: userId } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        user.name = updateProfileDto.name ?? user.name;
        user.email = updateProfileDto.email ?? user.email;
        if (profilePicture)
            user.profilePicture = profilePicture;
        return await this.usersRepository.save(user);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map