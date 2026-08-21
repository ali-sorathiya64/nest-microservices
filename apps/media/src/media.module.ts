import { Module } from '@nestjs/common';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';
import {ConfigModule} from "@nestjs/config"
import {MongooseModule} from "@nestjs/mongoose"
import { Media, MediaSchema } from './media-stuff/media.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal:true
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI_MEDIA as string),
    MongooseModule.forFeature([{name:Media.name ,schema :MediaSchema} ])
  ],
  

  controllers: [MediaController],
  providers: [MediaService],
})
export class MediaModule {}
