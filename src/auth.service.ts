import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from 'utils/entity';
import { LoginDto, RegisterDto, UpdateProfileDto } from 'utils/dto'; 

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<{ access_token: string }> {
    const { name, email, password } = registerDto;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.usersRepository.create({ name, email, password: hashedPassword });
    const savedUser = await this.usersRepository.save(user);
    const payload = { email: savedUser.email, name: savedUser.name, sub: savedUser.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }

  async login(loginDto: LoginDto): Promise<{ access_token: string }> {
    const { email, password } = loginDto;
    const user = await this.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { email: user.email, name: user.name, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),  
    };
  }

  async getProfile(userId: number): Promise<{ id: number; name: string; email: string; profilePicture: string }> {
  const user = await this.usersRepository.findOne({ where: { id: userId } });

  if (!user) {
    throw new NotFoundException('User not found');
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    profilePicture: user.profilePicture ?? '/uploads/default-profile.png', // fallback
  };
 }

async updateProfile(userId: number, updateProfileDto: UpdateProfileDto, profilePicture?: string) {
  const user = await this.usersRepository.findOne({ where: { id: userId } });

  if (!user) throw new NotFoundException('User not found');

  user.name = updateProfileDto.name ?? user.name;
  user.email = updateProfileDto.email ?? user.email;
  if (profilePicture) user.profilePicture = profilePicture;

  return await this.usersRepository.save(user);
}

}