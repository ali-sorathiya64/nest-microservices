import { Controller, Get, Inject, Query } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { Public } from "../auth/public.decorator";
import { mapRpcErrorToHttP } from "@app/rpc";
import { firstValueFrom } from "rxjs";





@Controller()

export class SearchProductHttpConroller {

    constructor (@Inject('SEARCH_CLIENT') private readonly searchClient :ClientProxy){}



@Get('search')
@Public()

async search (@Query('q') q:string , @Query('limit') limit?:string){

const limitNo = typeof limit === 'string' && limit.trim() ? Number(limit) : undefined

try{


    const results = await firstValueFrom(this.searchClient.send('search.query' ,  {
        q,
        limit:limitNo
    }
    ))
    
    return {
        q,
        count : Array.isArray(results) ? results.length:0,
        results
    }

}catch(error){

    mapRpcErrorToHttP(error)
}
        
    }

}