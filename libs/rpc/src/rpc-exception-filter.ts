import { ArgumentsHost, Catch } from "@nestjs/common";
import { BaseRpcExceptionFilter, RpcException } from "@nestjs/microservices";
import { Response } from "express";
import { RpcErrorPayload } from "./rpc-types";



// this filter run -> inside the microservices process 
// our payload structure should follow the way we want

@Catch()
export class RpcAllExceptionFilter extends BaseRpcExceptionFilter {

    catch(exception: any, host: ArgumentsHost) {
        if(exception instanceof(RpcException)){
            return super.catch(exception,host)
        }


         const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        const status = exception?.getStatus?.();


        if (status === 400){
            const payload :RpcErrorPayload ={
                code:'VALIDATION_ERROR',
                message:"Validation failed",
                details:response
            }

            return super.catch(new RpcException(payload),host)
        }

        
const payload :RpcErrorPayload={
    code:'INTERNAL',
    message:"Internal error"
}
     

return super.catch(new RpcException(payload),host);
        

    }

}