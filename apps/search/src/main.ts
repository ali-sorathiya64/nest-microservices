import { NestFactory } from "@nestjs/core";
import { SearchModule } from "./search.module";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { Logger } from "@nestjs/common";

async function bootstrap(){

process.title="search"

const logger = new Logger("SeachBootstrap")

const port = Number (process.env.SEARCH_TCP_PORT ?? 4012)

const rmqurl = process.env.RABBITMQ_URL ?? 'amqp://localhost:5672';

const queue = process.env.SEARCH_QUEUE ?? 'search_queue'


const app = NestFactory.createMicroservice<MicroserviceOptions>(
  SearchModule,{
    transport:Transport.RMQ,
    options:{
      urls:[rmqurl],
      queue,
      queueOptions:{
        durable:false
      }
     
    }
  }
)

;(await app).enableShutdownHooks
;(await app).listen()

logger.log(`Search rmq is listening on  queue ${queue} via ${rmqurl}`)


}

bootstrap();