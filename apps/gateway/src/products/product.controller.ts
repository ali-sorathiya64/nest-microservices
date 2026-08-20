import { Body, Controller, Inject, Post,Get, Param } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { CurrentUser } from "../auth/current-user.decorator";
import type{ UserContext } from "../auth/auth.type";
import { mapRpcErrorToHttP } from "@app/rpc";
import { firstValueFrom } from "rxjs";
import { AdminOnly } from "../auth/admin.decorator";
import { Public } from "../auth/public.decorator";



type Product ={
    name:string;
    description:string;
    price:number;
    status:'DRAFT' | 'ACTIVE';
    imageUrl:string | undefined;
    createdByClerkUserId:string | undefined
}

@Controller()
export class ProductsHttpController{
    constructor(
        // gateway talks to catalog via RMQ client
        @Inject('CATALOG_CLIENT') private readonly catalogClient :ClientProxy
    ) {}



    // media related logic later
    @Post('products')
    @AdminOnly ()
    async createProduct ( @CurrentUser() user:UserContext , @Body() body:{
        name:string,
        description:string,
        price:number,
        status?:string
        imageUrl?:string
    } ){
         
        let product : Product;

        const payload = {
            name:body.name,
            description:body.description,
            price:Number (body.price),
            status:body.status,
            imageUrl:'',
            createdByClerkUserId: user.clerkUserId

        }


        //RMQ request and response pattern

        try{
            product = await firstValueFrom(
                this.catalogClient.send('product.create',payload)
            )
            

        }
        catch(error:any){
            mapRpcErrorToHttP(error)

        }

        return product;
        
    }


    @Get('products')
    @Public()
    async listProducts (){


        try{

 
      return await firstValueFrom(this.catalogClient.send('product.list',{})) 

        }

        catch(error :any){
            mapRpcErrorToHttP(error)
        }
    }





    @Get('products/:id')
    @Public()
    async getProductById(@Param('id') id:string){
        try{

            return await firstValueFrom(this.catalogClient.send('product.getById',{id}))

        }
        catch(error:any){
            mapRpcErrorToHttP(error)
        }

    }




}