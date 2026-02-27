import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { DatabaseService } from "../../database/database.service.js";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'j-w-t') {
    constructor(config: ConfigService, private database: DatabaseService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.get("JWT_SECRET")!
        });
    }

    // This validate definition silences abstract class TS error
    async validate(payload: { sub: number, email: string} ) {
        const user = await this.database.user.findUnique({
            where: {
                id: payload.sub
            }
        })
        //delete user?.hash;
        return user;
    }
}