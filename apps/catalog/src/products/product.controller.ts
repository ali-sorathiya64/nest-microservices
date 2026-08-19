import {Controller } from "@nestjs/common";
import { ProductService } from "./products.service";
import { CreateProducDto, getProductById } from "./product.dto";
import { MessagePattern, Payload } from "@nestjs/microservices";


@Controller('product')
export class ProductController {

    constructor(private readonly productService: ProductService) { }


    @MessagePattern('product.create')
    createProduct(@Payload() payload: CreateProducDto) {
        return this.productService.createNewProduct(payload)
    }


    @MessagePattern('product.list')
    listProduct() {
        return  this.productService.listProduct()
    }


    @MessagePattern('product.getById')
    getById (@Payload() payload :getProductById){
        return this.productService.getProductById(payload)
    }
}