import { Body, Controller, Logger, Put, Req, UploadedFile, UseInterceptors } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto, RegisterDto, UpdateProfileDto } from 'utils/dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';



// ✅ Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Multer Cloudinary Storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'profile-pictures',
    resource_type: 'image',
    format: () => 'png',
    public_id: (req, file) => `${Date.now()}_${file.originalname.split('.')[0]}`,
  } as any,
});


@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  @MessagePattern({ cmd: 'register_user' })
  async registerUser(data: RegisterDto) {
    return this.authService.register(data);
  }

  @MessagePattern({ cmd: 'login_user' })
  async loginUser(data: LoginDto) {
    return this.authService.login(data);
  }

  @MessagePattern({ cmd: 'verify_token' })
  async verifyToken(@Payload() data: { token: string }) {
    try {
      const { token } = data;

      // ✅ Verify and decode JWT
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET, // make sure it's the same secret used for signing
      });

      this.logger.log(`Token verified for user: ${payload.sub}`);

      return {
        userId: payload.sub, // usually stored in "sub"
        email: payload.email,
        name: payload.name, // optional if you include it in JWT
      };
    } catch (error) {
      this.logger.error(`JWT verification failed: ${error.message}`);
      return { error: 'Invalid token' };
    }

  }

  @MessagePattern({ cmd: 'get_profile' })
  async getProfileFromToken(data: { Id: string }) {
    try {
      const user = await this.authService.getProfile(Number(data.Id));
      return user;
    } catch (error) {
      return { message: 'Unauthorized', error: error.message };
    }
  }

 @MessagePattern('update-profile')
  async updateProfile(data: any) {
    const { body: updateProfileDto, file, cookies } = data;

    // ✅ Get token from cookie
    const token = cookies?.jwt;
    if (!token) {
      return { message: 'Unauthorized: No token provided' };
    }

    // ✅ Verify token
    const secret = this.configService.get<string>('JWT_SECRET');
    if (!secret) {
      return { message: 'Server configuration error: JWT secret not found' };
    }
    const decoded: any = jwt.verify(token, secret);

    // ✅ Extract userId (sub preferred, fallback to id)
    const userId = decoded.sub || decoded.id;
    if (!userId) {
      return { message: 'Unauthorized: Invalid token' };
    }

    // ✅ Cloudinary URL
    const profilePicture = file?.path;

    // ✅ Call service to update
    const updatedUser = await this.authService.updateProfile(
      userId,
      updateProfileDto as UpdateProfileDto,
      profilePicture,
    );

    return {
      message: 'Profile updated successfully',
      user: updatedUser,
    };
  }

 }