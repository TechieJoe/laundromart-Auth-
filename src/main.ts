import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AuthModule } from './auth.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AuthModule,
    {
      transport: Transport.TCP,
      options: {
        host: '127.0.0.1',
        port: 4000,
      },
    },
  );
   
  console.log(`📡 Connected to Auth Microservice via TCP (127.0.0.1:4000)`);

  await app.listen();  
}
bootstrap();   