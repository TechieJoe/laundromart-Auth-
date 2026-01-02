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
       
     
     //test
        // Configuration Module for environment variables
        ConfigModule.forRoot({
          isGlobal: true, // Makes ConfigService available globally
          envFilePath: ['.env'], // Load .env file
        }),
    

        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          useFactory: (config: ConfigService) => ({
          type: 'postgres',
          url: config.get<string>('POSTGRES_URL'),
          entities: [User],
          synchronize: false,
          ssl: { rejectUnauthorized: false },
       }),
     inject: [ConfigService],
      }),
        TypeOrmModule.forFeature([User]),
        
            /**
        // TypeORM Module for PostgreSQL
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          useFactory: (configService: ConfigService) => ({
            type: 'postgres',
            url: configService.get<string>('POSTGRES_URL'),
            host: configService.get<string>('POSTGRES_HOST'),
            port: configService.get<number>('POSTGRES_PORT'),
            username: configService.get<string>('POSTGRES_USER'),
            password: configService.get<string>('POSTGRES_PASSWORD'),
            database: configService.get<string>('POSTGRES_NAME'),
            entities: [User],
            synchronize: configService.get<boolean>('DATABASE_SYNCHRONIZE'), // Set to false in production
            ssl: { rejectUnauthorized: false },
          }),
          inject: [ConfigService],
        }),
    
    TypeOrmModule.forFeature([User]),
        */

    /**
     * live
     ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.get<string>('DATABASE_URL'),
        entities: [User],
        synchronize: true, // disable in production
        ssl: { rejectUnauthorized: false },
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([User]),

     */

    // Passport Module for authentication strategies
    PassportModule.register({ defaultStrategy: 'jwt' }),

    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: configService.get<string>('JWT_EXPIRES_IN', '60m') },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}