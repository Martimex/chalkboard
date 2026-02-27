import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { User } from 'generated/prisma/client.js';
import { GetUser } from '../auth/decorator/get-user.decorator.js';
import { JwtGuard } from '../auth/guard/jwt.guard.js';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
    @Get('me')
    getMe(@GetUser() user: User) {
        return user;
    }
}
