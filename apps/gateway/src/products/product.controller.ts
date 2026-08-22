import {
  Body,
  Controller,
  Inject,
  Post,
  Get,
  Param,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CurrentUser } from '../auth/current-user.decorator';
import type { UserContext } from '../auth/auth.type';
import { mapRpcErrorToHttP } from '@app/rpc';
import { firstValueFrom } from 'rxjs';
import { Public } from '../auth/public.decorator';
import { FileInterceptor } from '@nestjs/platform-express';

type Product = {
  _id: string;
  name: string;
  description: string;
  price: number;
  status: 'DRAFT' | 'ACTIVE';
  imageUrl: string | undefined;
  createdByClerkUserId: string | undefined;
};

@Controller()
export class ProductsHttpController {
  constructor(
    // gateway talks to catalog via RMQ client
    @Inject('CATALOG_CLIENT') private readonly catalogClient: ClientProxy,

    @Inject('MEDIA_CLIENT') private readonly mediaClient: ClientProxy,
  ) { }

  //   media and image logic later placeholder
  @Post('products')
  //   @AdminOnly()
  @UseInterceptors(
    FileInterceptor('image', {
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
    }),
  )
  async createProduct(
    @CurrentUser() user: UserContext,
    @UploadedFile()
    file: {
      originalname: string;
      mimetype: string;
      buffer: Buffer;
    } | undefined,

    @Body()
    body: {
      name: string;
      description: string;
      price: number;
      status?: string;
      imageUrl?: string;
    },
  ) {


    let imageUrl: string | undefined = undefined;
    let mediaId: string | undefined = undefined;

    if (file) {
      const base64 = file.buffer.toString('base64');

      try {
        const uploadResult = await firstValueFrom(
          this.mediaClient.send('media.uploadProductImage', {
            fileName: file.originalname,
            mimeType: file.mimetype,
            base64,
            uploadByUserId: user.clerkUserId,
          }),
        );

        imageUrl = uploadResult.url;
        mediaId = uploadResult.mediaId;
      } catch (error) {
        mapRpcErrorToHttP(error);
      }
    }

    let product: Product;

    const payload = {
      name: body.name,
      description: body.description,
      price: Number(body.price),
      status: body.status,
      imageUrl,
      createdByClerkUserId: user.clerkUserId,
    };

    // RMQ request and response pattern

    try {
      product = await firstValueFrom(
        this.catalogClient.send('product.create', payload),
      );
    } catch (err) {
      mapRpcErrorToHttP(err);
    }

    if (mediaId) {
      try {
        await firstValueFrom(
          this.mediaClient.send('media.attachToProduct', {
            mediaId,
            productId: String(product._id),
            attachedByUserId: user.clerkUserId,
          }),
        );
      } catch (err) {
        mapRpcErrorToHttP(err);
      }
    }

    return product;
  }

  @Get('products')
  @Public()
  async listProducts() {
    try {
      return await firstValueFrom(this.catalogClient.send('product.list', {}));
    } catch (err) {
      mapRpcErrorToHttP(err);
    }
  }

  @Get('products/:id')
  @Public()
  async getProduct(@Param('id') id: string) {
    try {
      return await firstValueFrom(
        this.catalogClient.send('product.getById', { id }),
      );
    } catch (err) {
      mapRpcErrorToHttP(err);
    }
  }
}
