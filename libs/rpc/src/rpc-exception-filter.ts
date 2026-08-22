import { ArgumentsHost, Catch } from '@nestjs/common';
import {
  BaseRpcExceptionFilter,
  RpcException,
} from '@nestjs/microservices';
import { RpcErrorPayload } from './rpc-types';

@Catch()
export class RpcAllExceptionFilter extends BaseRpcExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    
    if (exception instanceof RpcException) {
      return super.catch(exception, host);
    }

    const status = exception?.getStatus?.();

    if (status === 400) {
      const payload: RpcErrorPayload = {
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
      };

      return super.catch(
        new RpcException(payload),
        host,
      );
    }

    const payload: RpcErrorPayload = {
      code: 'INTERNAL',
      message: 'Internal error',
    };

    return super.catch(
      new RpcException(payload),
      host,
    );
  }
}