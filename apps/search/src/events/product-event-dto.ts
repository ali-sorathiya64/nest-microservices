import { IsIn, IsNumber, IsString } from "class-validator";


export class ProductCreatedDto {

    @IsString()
    productId!: string


    @IsString()
    name!: string


    @IsString()
    description!: string

  
    @IsIn(['DRAFT',"ACTIVE"])
    status !: 'DRAFT' | 'ACTIVE'


    @IsNumber()
    price!: number;


    @IsString()
    imageUrl?: string

    @IsString()
    createdByClerkUserId?: string


}