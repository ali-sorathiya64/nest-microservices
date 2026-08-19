
import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose"

import { HydratedDocument } from "mongoose"


export type UserDocument = HydratedDocument<User>


@Schema({ timestamps: true })
export class User {

    @Prop({ required: true, unique: true, index: true })
    clerkUserId?: string

    @Prop({ required: true, unique: true })
    email?: string


    @Prop({ required: true, unique: true })
    name?: string

    @Prop({ required: true, unique: true, enum: ['user', 'admin'], default: 'user' })
    role?: 'user' | 'admin'


    @Prop({required:true  })
    lastSeenAt ? :Date;




}

export const UserSchema = SchemaFactory.createForClass(User);