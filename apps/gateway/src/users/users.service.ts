import { Injectable } from "@nestjs/common";
import { InjectModel } from '@nestjs/mongoose';
import { User } from "./user.schema";
import { Model } from "mongoose"



@Injectable()
export class UserService {

    constructor(@InjectModel(User.name) private readonly UserModel: Model<User>) { }


    async upsertAuthUser(input: {
        clerkUserId: string;
        email: string;
        name: string
    }) {
        const now = Date.now();

        return this.UserModel.findOneAndUpdate({
            clerkUserId: input.clerkUserId
        }, {
            $set: {
                name: input.name,
                email: input.email,
                lastSeenAt: now
            }, $setOnInsert: {
                role: 'user'
            }
        }, {

            new: true,
            upsert: true,
            setDefaultsOnInsert: true


        })


    }


    // async upsertAuthUser(input :{
    //     clerkUserId:string;
    //     email:string
    //     name:string
    // })

    // {

    //     const now  = new Date();
        
    //     return this.UserModel.findOneAndUpdate({clerkUserId:input.clerkUserId}


    //         ,{
    //             $set:{
    //                 name:input.name,
    //                 email:input.email,
    //                 lastSeenAt:now
    //             }, $setOnInsert:{
    //                 role :'user'
    //             } } ,
    //             {
    //                 new:true,
    //                 upsert:true,
    //                 setDefaultsOnInsert:true
    //             }
            
    //     )

    // }

    async findClerkUserId(clerkUserId: string) {
        return this.UserModel.findOne({ clerkUserId })
    }


}