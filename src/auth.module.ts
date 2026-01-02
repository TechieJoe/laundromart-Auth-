import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from 'utils/entity';
import { JwtStrategy } from 'utils/jwt';
import { LocalStrategy } from 'utils/local.strategy';

@Module({
  imports: [
    /**
     * TypeORM — Railway PostgreSQL
     * Uses ONLY the connection URL (correct)
     */
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.get<string>('POSTGRES_URL'),
        entities: [User],
        synchronize: false, // 🚨 NEVER true in production
        ssl: { rejectUnauthorized: false },
      }),
      inject: [ConfigService],
    }),

    /**
     * Repositories
     */
    TypeOrmModule.forFeature([User]),

    /**
     * Passport (JWT default strategy)
     */
    PassportModule.register({
      defaultStrategy: 'jwt',
      session: false,
    }),

    /**
     * JWT
     */
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: config.get<string>('JWT_EXPIRES_IN', '60m'),
        },
      }),
      inject: [ConfigService],
    }),
  ],

  controllers: [AuthController],

  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
  ],
})
export class AuthModule {}
