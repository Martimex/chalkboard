import { ForbiddenException, Injectable } from "@nestjs/common";
import { DatabaseService } from "../database/database.service.js";
import { AuthDTO } from "./authTypes/type.dto.js";
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";


@Injectable()
export class AuthService {
    constructor(private database: DatabaseService, private jwt: JwtService, private config: ConfigService) {}
    async signin(dto: AuthDTO) {

        const user = await this.database.user.findFirst({
            where: {
                email: dto.email,
            },
        });

        if(!user) { throw new ForbiddenException('Credentials incorrect'); }

        // compare password
        const pwMatches = await argon.verify(user.hash, dto.password);

        if(!pwMatches) { throw new ForbiddenException('Credentials incorrect'); }

        return this.signToken(user.id, user.email);
    }

    async signup(dto: AuthDTO) {
        // Generate the password hash
        const hash = await argon.hash(dto.password);

        try {

            // Save the new user in the db
            const user = await this.database.user.create({
                data: {
                    email: dto.email,
                    hash,
                },
                select: {
                    id: true,
                    email: true,
                    createdAt: true
                }
            });

            // return the JWT token
            return this.signToken(user.id, user.email);

        } catch(error) {
            if(error instanceof PrismaClientKnownRequestError) {
                if(error.code === "P2002") {
                    throw new ForbiddenException('Credentials taken');
                }
                throw error;
            }
        }
    }

    async signToken(userId: number, email: string): Promise<{ access_token: string }> {
        const payload = {
            sub: userId,
            email 
        }

        const token = await this.jwt.signAsync(payload, {
            expiresIn: "15m",
            secret: this.config.get("JWT_SECRET")
        });

        return {
            access_token: token
        };
    }
}