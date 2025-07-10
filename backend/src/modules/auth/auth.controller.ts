import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect() {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async oauthGoogleCallback(@Req() req: Request) {
    const user = req['user'];
    return await this.authService.oauthGoogleCallback(user);
  }

  @Get('github')
  @UseGuards(AuthGuard('github'))
  githubAuthRedirect() {}

  @Get('github/callback')
  @UseGuards(AuthGuard('github'))
  async oauthGithubCallback(@Req() req: Request) {
    const user = req['user'];
    return await this.authService.oauthGithubCallback(user);
  }

  @Post('login')
  async login(@Body() data: { email: string; password: string }) {
    return await this.authService.login(data);
  }

  @Post('register')
  async register(
    @Body() data: { email: string; password: string; fullName: string },
  ) {
    return await this.authService.register(data);
  }
}
