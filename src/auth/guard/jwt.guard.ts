import { AuthGuard } from "@nestjs/passport";

export class JwtGuard extends AuthGuard('j-w-t') {
    constructor() {
        super();
    }
}