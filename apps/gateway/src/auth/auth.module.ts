import { Module } from "@nestjs/common";
import { UserModule } from "../users/user.module";
import { AuthService } from "./auth.service";
import { JWTAuthGuard } from "./jwt-auth-guard";
import { APP_GUARD } from "@nestjs/core";
import { AuthController } from "./auth.controller";


@Module({
    imports: [
        UserModule,
    ],
    controllers: [AuthController],
    providers: [
        AuthService,
        {
            provide: APP_GUARD,
            useClass: JWTAuthGuard
        }
    ],
    exports: [AuthService],
})


export class AuthModule { };