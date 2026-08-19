import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose"
import { Product } from "./product.schema";
import { isValidObjectId, Model } from "mongoose"
import { rpcBadRequest, rpcNotFoundError } from "@app/rpc";

@Injectable()
export class ProductService {

    constructor(
        @InjectModel(Product.name) private readonly productModel: Model<Product>
    ) { }

    async createNewProduct(input: {
        name: string;
        description: string;
        price: number;
        status?: 'DRAFT' | 'ACTIVE';
        imageUrl?: string;
        createdByClerkUserId: string;
    }) {

        if (!input.name || !input.description) {
            rpcBadRequest('Name and description are required')
        }
        if (
            typeof input.price !== 'number' ||
            Number.isNaN(input.price) ||
            input.price < 0
        ) {
            rpcBadRequest("Price must be a valid number >= 0");
        }
        if (input.status && input.status !== 'DRAFT' && input.status !== 'ACTIVE') {
            rpcBadRequest("Status must be either DRAFT or ACTIVE");
        }

        const newlyCreateProduct = await this.productModel.create({
            name: input.name,
            description: input.description,
            price: input.price,
            status: input.status ?? 'DRAFT',
            imageUrl: input.imageUrl ?? '',
            createdByClerkUserId: input.createdByClerkUserId,

        })


        return newlyCreateProduct;


    }

    async listProduct() {
        return this.productModel.find().sort({ createdAt: -1 }).exec()
    }

    async getProductById(input: {
        id: string
    }) {

        if (!isValidObjectId(input.id)) {
            rpcBadRequest("Invalid product id : ", input.id)
        }
        const product = await this.productModel.findById(input.id).exec();

        if (!product) {
            rpcNotFoundError("This product is not present in the DB");
        }


        return product;

    }

}