import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { User } from 'utils/entity';
import { AuthModule } from './auth.module';

@Module({
  imports: [
    // Your Auth Module (to be created for local and JWT strategies)
    AuthModule,
  ],
})
export class AppModule {
  // Optional: Configure microservice (TCP) client
  static configureMicroservice(): MicroserviceOptions {
    return {
      transport: Transport.TCP,
      options: {
        host: 'localhost',
        port: 4000, // Port for microservice communication
      },
    };
  }
}