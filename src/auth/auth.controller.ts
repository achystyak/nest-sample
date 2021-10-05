import { Controller, Post, UseGuards, Request, Response, Get, Next, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './auth0/local.auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Request() req) {
        return req.user ? await this.authService.login(req.user) : null
    }

    @Post('prolong')
    async prolongSession(@Request() req) {
        const token = req.body["token"]
        if (token) {
            let user = await this.authService.prolongSession(token)
            if (user) {
                return await this.authService.login(user)
            }
        }
        throw new UnauthorizedException()
    }
}
