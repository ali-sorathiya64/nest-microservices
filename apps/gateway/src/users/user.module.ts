import { Module } from "@nestjs/common";
import {MongooseModule, Schema} from "@nestjs/mongoose"
import { User, UserSchema } from "./user.schema";
import { UserService } from "./users.service";



@Module({
    imports:[
        MongooseModule.forFeature([{name:User.name , schema :UserSchema}])
    ],
    providers:[
        UserService
    ],
    exports:[
        UserService
    ],
})

export class UserModule {};