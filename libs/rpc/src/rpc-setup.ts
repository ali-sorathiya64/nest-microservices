import { INestMicroservice, ValidationPipe } from "@nestjs/common";
import { RpcAllExceptionFilter } from "./rpc-exception-filter";


export function applyToMicroservices (app :INestMicroservice){
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist:true,
            forbidNonWhitelisted:true,
            transform:true
        })
    )

    app.useGlobalFilters(new RpcAllExceptionFilter());
}