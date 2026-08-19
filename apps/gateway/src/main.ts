import { NestFactory } from '@nestjs/core';
import { GatewayModule } from './gateway.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
process.title='gateway'


const logger = new Logger("GateWayBootstarp");

const app = await NestFactory.create(GatewayModule);

app.enableShutdownHooks();

const port = Number(process.env.GATEWAY_PORT?? 3000);

await app.listen(port);

logger.log(`Gateway running at port ${port}`)


}
bootstrap();
