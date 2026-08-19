import { Controller, Get, Injectable } from "@nestjs/common";
import { AuthService } from "./auth.service";
import type{ UserContext } from "./auth.type";
import { CurrentUser } from "./current-user.decorator";

@Controller("auth")
export class AuthController{

    constructor(private readonly authservice:AuthService){}


    @Get('me')
    me( @CurrentUser() user:UserContext){
        return {user}
    } 

}