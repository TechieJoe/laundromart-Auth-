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
     * ✅ MAKE ConfigService AVAILABLE HERE
     */
    ConfigModule,

    /**
     * Database
     */
    TypeOrmModule.forRootAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    type: 'postgres',
    url: configService.get<string>('POSTGRES_URL'),
     host: configService.get<string>('POSTGRES_HOST'),
    port: configService.get<number>('POSTGRES_PORT'),
    username: configService.get<string>('POSTGRES_USER'),
    password: configService.get<string>('POSTGRES_PASSWORD'),
    database: configService.get<string>('POSTGRES_NAME'),


    entities: [User],

    synchronize: false,

    /**
     * 🚨 THIS IS THE IMPORTANT PART
     */
    ssl: true,
    extra: {
      ssl: {
        rejectUnauthorized: false,
      },
    },

    /**
     * Prevent Railway proxy resets
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
