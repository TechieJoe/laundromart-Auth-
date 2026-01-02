import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from 'utils/entity';
import { JwtStrategy } from 'utils/jwt';
import { LocalStrategy } from 'utils/local.strategy';

@Module({
  imports: [
    /**
     * ✅ ConfigService is available because ConfigModule
     * was made GLOBAL in AppModule
     */
    ConfigModule,

    /**
     * ✅ Database connection
     */
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',

        /**
         * ✅ USE ONLY ONE METHOD (URL is best for Railway)
         */
        url: config.get<string>('POSTGRES_URL'),

        entities: [User],
        synchronize: false,

        /**
         * ✅ REQUIRED for Railway public proxy
         */
        ssl: {
          rejectUnauthorized: false,
        },

        /**
         * ✅ Prevent connection resets
         */
        keepConnectionAlive: true,
        connectTimeoutMS: 10000,
      }),
    }),

    TypeOrmModule.forFeature([User]),

    PassportModule.register({
      defaultStrategy: 'jwt',
      session: false,
    }),

    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: config.get<string>('JWT_EXPIRES_IN', '60m'),
        },
      }),
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
