import { Controller, Get, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Public } from './auth/public.decorator';

@Controller()
export class GatewayController {
  constructor(
    @Inject('CATALOG_CLIENT')
    private readonly catalogClient: ClientProxy,
  ) {}
  
  @Get('health')
  @Public()
  health() {
    return {
      ok: true,
      service: 'gateway',
    };
  }
}