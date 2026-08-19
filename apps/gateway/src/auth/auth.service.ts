import { Injectable, UnauthorizedException } from "@nestjs/common";
import { createClerkClient, verifyToken } from "@clerk/backend"
import { UserContext } from "./auth.type";



@Injectable()
export class AuthService {

    private readonly clerk = createClerkClient({
        secretKey: process.env.CLERK_SECRET_KEY,
        publishableKey: process.env.CLERK_PUBLISHABLE_KEY
    })


    private jwtVerifyOptions(): Record<string, any> {
        return {
            secretKey: process.env.CLERK_SECRET_KEY,
        }

    }

    async verifyBuildContext(token: string): Promise<UserContext> {
        try {

            const verified = await verifyToken(token, this.jwtVerifyOptions());


            // decoded payload
            const payload: any = verified?.payload ?? verified?.payload ?? verified;


            //clerk userid (sub)
            const clerkUserId = payload?.sub ?? payload?.userId;


            if (!clerkUserId) {
                throw new UnauthorizedException("Token is missing in user id")
            }

            const role: 'admin' | 'user' = 'user';


            const emailFromToken = payload?.email ?? payload?.email_address ??
                payload?.primaryEmailAddress ?? '';

            const nameFromToken = payload?.name ?? payload?.full_name ??
                payload?.username ?? '';


            if (emailFromToken && nameFromToken) {
                return {
                    clerkUserId,
                    email: emailFromToken,
                    name: nameFromToken,
                    role
                }
            }

            const user = await this.clerk.users.getUser(clerkUserId);

            const primaryEmail = user.emailAddresses.find((e) => e.id === user.primaryEmailAddressId)
                ?.emailAddress ?? user.emailAddresses[0]?.emailAddress ?? '';



            const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ')
                || user.username || primaryEmail || clerkUserId

            return {
                clerkUserId,
                email: primaryEmail,
                name: fullName,
                role
            }


        }
        catch (error: any) {

            throw new UnauthorizedException("Inavlid or expired token ")

        }

    }

}