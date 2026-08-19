import { Module } from '@nestjs/common';
import { CatalogController } from './catalog.controller';
import { CatalogService } from './catalog.service';
import { ConfigModule } from "@nestjs/config"
import { MongooseModule } from "@nestjs/mongoose"
import { Product, ProductSchema } from './products/product.schema';
import { ProductController } from './products/product.controller';
import { ProductService } from './products/products.service';

@Module({
  imports: [
    ConfigModule.forRoot({  
      isGlobal: true
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI_CATALOG as string),

    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }])
  ],

  controllers: [CatalogController, ProductController],
  providers: [CatalogService, ProductService],
})
export class CatalogModule {}
