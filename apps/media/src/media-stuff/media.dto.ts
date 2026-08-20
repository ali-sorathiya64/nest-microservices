import { IsOptional, IsString } from "class-validator";



export class UploadProductImageDto {


    @IsString()
    fileName !: string;


    @IsString()
    mimeType!: string;





    @IsString()
    base64!: string;



    @IsString()
    uploadByUserId!: string;
 


}

export class AttachProductDto {

    @IsString()
    mediaId!: string;


    @IsString()
    productId!: string;

    @IsString()
    attachByUserId!: string;


}