"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const microservices_1 = require("@nestjs/microservices");
const auth_module_1 = require("./auth.module");
async function bootstrap() {
    const app = await core_1.NestFactory.createMicroservice(auth_module_1.AuthModule, {
        transport: microservices_1.Transport.TCP,
        options: {
            host: '127.0.0.1',
            port: 4000,
        },
    });
    console.log(`📡 Connected to Auth Microservice via TCP (127.0.0.1:4000)`);
    await app.listen();
}
bootstrap();
//# sourceMappingURL=main.js.map