import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AuthModule } from './auth.module';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);

  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: 'shortline.proxy.rlwy.net',
      port: 1010,
    },
  });

  await app.startAllMicroservices();
  await app.listen(3000); // internal HTTP port (Railway ignores this)
}
bootstrap();


