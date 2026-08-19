import { IsNumber, IsOptional, IsString, Min } from "class-validator";
import type { ProductStatus } from "./product.schema";

export class CreateProducDto {


    @IsString()
    name!: string;


    @IsString()
    description!: string;

    @IsNumber()
    @Min(0)
    price!: number;

    @IsOptional()
    status!: ProductStatus


    @IsOptional()
    @IsString()
    imageUrl?: string

    @IsString()
    createdByClerkUserId!: string


}

export class getProductById {
    @IsString()
    id!: string

}