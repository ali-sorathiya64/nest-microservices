import { Module } from '@nestjs/common';
import { CatalogController } from './catalog.controller';
import { CatalogService } from './catalog.service';
import { ConfigModule } from "@nestjs/config"
import { MongooseModule } from "@nestjs/mongoose"
import { Product, ProductSchema } from './products/product.schema';
import { ProductController } from './products/product.controller';
import { ProductService } from './products/products.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ProductEventPublisher } from './products/products-event-publisher';

@Module({
  imports: [
    ConfigModule.forRoot({  
      isGlobal: true
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI_CATALOG as string),

    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    


    // catalaog talks directly to search via RabbitMq Client client (not via gateway)
    ClientsModule.register([
      {
        name: 'SEARCH_EVENTS_CLIENT',
        transport :Transport.RMQ,
        options:{
          urls:[process.env.RABBITMQ_URL ?? 'amqp://localhost:"5672'],
          queue: process.env.SEARCH_QUEUE ?? 'search_queue',
          queueOptions:{
            durable:false
          }

        }
      }
    ]),


  ],

  controllers: [CatalogController, ProductController,],
  providers: [CatalogService, ProductService, ProductEventPublisher],
})
export class CatalogModule {}
