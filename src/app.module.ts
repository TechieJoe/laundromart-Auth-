import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { AuthModule } from './auth.module';

@Module({
  imports: [
    /**
     * ✅ MAKE ConfigService GLOBAL (THIS FIXES JwtStrategy ERROR)
     */
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    /**
     * Auth module (JWT, Local strategy, DB)
     */
    AuthModule,
  ],
})
export class AppModule {
  /**
   * Optional: TCP microservice config
   */
  static configureMicroservice(): MicroserviceOptions {
    return {
      transport: Transport.TCP,
      options: {
        host: '0.0.0.0',
        port: 4000,
      },
    };
  }
}
