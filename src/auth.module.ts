import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from 'utils/entity';
import { JwtStrategy } from 'utils/jwt';
import { LocalStrategy } from 'utils/local.strategy';
import { PassportModule } from '@nestjs/passport';


@Module({
  imports: [

        // Configuration Module for environment variables
        ConfigModule.forRoot({
          isGlobal: true, // Makes ConfigService available globally
          envFilePath: ['.env'], // Load .env file
        }),
    
        // TypeORM Module for PostgreSQL
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          useFactory: (configService: ConfigService) => ({
            type: 'postgres',
            host: configService.get<string>('DATABASE_HOST'),
            port: configService.get<number>('DATABASE_PORT'),
            username: configService.get<string>('DATABASE_USER'),
            password: configService.get<string>('DATABASE_PASSWORD'),
            database: configService.get<string>('DATABASE_NAME'),
            entities: [User],
            synchronize: configService.get<boolean>('DATABASE_SYNCHRONIZE'), // Set to false in production
          }),
          inject: [ConfigService],
        }),
    
    TypeOrmModule.forFeature([User]),

    // Passport Module for authentication strategies
    PassportModule.register({ defaultStrategy: 'jwt' }),

    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET', 'your-very-secure-secret-key'),
        signOptions: { expiresIn: configService.get<string>('JWT_EXPIRES_IN', '60m') },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}