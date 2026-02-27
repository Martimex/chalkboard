import { Body, Controller, HttpCode, HttpStatus, ParseIntPipe, Post } from "@nestjs/common";
import { AuthService } from "./auth.service.js";
import { AuthDTO } from "./authTypes/type.dto.js";

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @HttpCode(HttpStatus.OK)
    @Post('signin')
    signin(@Body() dto: AuthDTO) {
        return this.authService.signin(dto);
    }

    @Post('signup')
    signup(@Body() dto: AuthDTO) {
        return this.authService.signup(dto);
    }
}