import { NestFactory } from '@nestjs/core';
import { MediaModule } from './media.module';
import { Logger } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap(){

  process.title="media"

  const logger = new Logger("MediaBootstrap")

  const port = Number(process.env.MEDIA_TCP_PORT ?? 4013);

  const rmqurl = process.env.RABBITMQ_URL ?? 'amqp://localhost:5672';

  const queue = process.env.MEDIA_QUEUE ?? 'media_queue'

  const app = NestFactory.createMicroservice<MicroserviceOptions>(
    MediaModule,{
      transport:Transport.RMQ,
      options:{
      urls:[queue],
      queue,
      queueOptions:{
        durable:false
      }
      }
    }
  );
  (await app).listen;
  (await app).enableShutdownHooks

logger.log(`Media RMQ is listening on queue ${queue} via ${rmqurl}`)


}  

bootstrap();
