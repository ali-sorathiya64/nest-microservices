import { BadRequestException, ForbiddenException, InternalServerErrorException, NotFoundException, UnauthorizedException } from "@nestjs/common";



export function mapRpcErrorToHttP (err:any) :never{

    const payload = err?.error ?? err;

    const code = payload?.code as string | undefined;

    const message = payload?.message ?? "Request failed !!!"

    if (code ==="BAD_REQUEST" || code ==="VALIDATION_ERROR"){
        throw new BadRequestException(message);

    }

     if (code ==="NOT_FOUND" ){
        throw new BadRequestException(message);

    }

     if (code ==="FORBIDDEN"){
        throw new ForbiddenException(message);

    }
     if (code ==="UNAUTHORIZED" ){
        throw new UnauthorizedException(message);
    }

    throw new InternalServerErrorException(message);
}