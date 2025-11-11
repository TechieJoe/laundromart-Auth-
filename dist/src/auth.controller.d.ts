import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto, RegisterDto } from 'utils/dto';
import { ConfigService } from '@nestjs/config';
export declare class AuthController {
    private authService;
    private jwtService;
    private readonly configService;
    private readonly logger;
    constructor(authService: AuthService, jwtService: JwtService, configService: ConfigService);
    registerUser(data: RegisterDto): Promise<{
        access_token: string;
    }>;
    loginUser(data: LoginDto): Promise<{
        access_token: string;
    }>;
    verifyToken(data: {
        token: string;
    }): Promise<{
        userId: any;
        email: any;
        name: any;
        error?: undefined;
    } | {
        error: string;
        userId?: undefined;
        email?: undefined;
        name?: undefined;
    }>;
    getProfileFromToken(data: {
        Id: string;
    }): Promise<{
        id: number;
        name: string;
        email: string;
        profilePicture: string;
    } | {
        message: string;
        error: any;
    }>;
    updateProfile(data: any): Promise<{
        message: string;
        user?: undefined;
    } | {
        message: string;
        user: import("../utils/entity").User;
    }>;
}
