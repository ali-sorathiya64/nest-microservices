import { IsNumber, IsString, Min } from "class-validator";



export class SearchQueryDto{


    @IsString()
    q!:string

    @IsNumber()
    @Min(1)
    limit?:number

}