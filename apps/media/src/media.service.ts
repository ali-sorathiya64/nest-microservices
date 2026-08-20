import { Injectable } from '@nestjs/common';
import { initCloudinary } from './cloudinary/cloudinary.client';
import { InjectModel } from "@nestjs/mongoose"
import { Media, MediaDocument } from './media-stuff/media.schema';
import { Model } from "mongoose"
import { rpcBadRequest, rpcNotFoundError } from '@app/rpc';
import { UploadApiResponse } from 'cloudinary';

@Injectable()
export class MediaService {

  private readonly cloudinary = initCloudinary();
  constructor(@InjectModel(Media.name) private readonly mediaModel: Model<MediaDocument>) { }



  async uploadProductImage(input: {
    fileName: string,
    mimeType: string,
    base64: string,
    uploadByUserId: string
  }) {

    if (!input.base64) {
      rpcBadRequest("Image base64 is needed")
    }

    if (!input.mimeType.startsWith('image/')) {
      rpcBadRequest("Only images are allowed")
    }

    const buffer = Buffer.from(input.base64, 'base64');

    if (!buffer.length) {
      rpcBadRequest("Invalid image data")
    }

    const uploadResult = await new Promise<UploadApiResponse | undefined>((resolve, reject) => {
      const stream = this.cloudinary.uploader.upload_stream({
        folder: "nestjs-microservice/products",
        resource_type: 'image'
      },
        (err, result) => {
          if (err) {
            reject(err)
            return
          }
          resolve(result)
        }
      )

      stream.end(buffer)
    }
    )


    const url = uploadResult?.secure_url || uploadResult?.url;

    const publicId = uploadResult?.public_id;

    if (!url || !publicId) {
      return rpcBadRequest("Cloudinary upload did not return any proper response")
    }

    const mediaDoc = await this.mediaModel.create({
      url,
      publicId,
      uploadByUserId: input.uploadByUserId,
      productId: undefined
    })

    return {
      media: String(mediaDoc._id),
      url,
      publicId
    }

  }

  async attachToProduct(input: {
    mediaId: string,
    productId: string
  }) {

    const updated = await this.mediaModel.findByIdAndUpdate(input.mediaId, {
      $set: {
        productId: input.productId,

      }
    }, {
      new: true
    }

    ).exec()

    if (!updated) {
      rpcNotFoundError("Media not found ")
    }

    return {
      mediaId: String(updated._id),
      productId: updated.productId,
      url: updated.url,
      publicId: updated.publicId
    }

  }
  ping() {
    return {
      ok: true,
      service: 'media',
      now: new Date().toISOString()
    }
  }
}
