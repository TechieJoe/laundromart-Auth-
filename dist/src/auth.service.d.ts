import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from 'utils/entity';
import { LoginDto, RegisterDto, UpdateProfileDto } from 'utils/dto';
export declare class AuthService {
    private usersRepository;
    private jwtService;
    constructor(usersRepository: Repository<User>, jwtService: JwtService);
    register(registerDto: RegisterDto): Promise<{
        access_token: string;
    }>;
    validateUser(email: string, password: string): Promise<User | null>;
    login(loginDto: LoginDto): Promise<{
        access_token: string;
    }>;
    getProfile(userId: number): Promise<{
        id: number;
        name: string;
        email: string;
        profilePicture: string;
    }>;
    updateProfile(userId: number, updateProfileDto: UpdateProfileDto, profilePicture?: string): Promise<User>;
}
