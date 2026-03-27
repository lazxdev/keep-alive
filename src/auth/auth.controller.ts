import { Controller, Get, Post, Body, Res } from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from './auth.service';

@Controller('login')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  getLoginPage(@Res() res: Response) {
    return res.render('login');
  }

  @Post()
  async login(@Body() body: Record<string, any>, @Res() res: Response) {
    try {
      const { access_token } = await this.authService.login(body.username, body.password);
      res.cookie('Authentication', access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
      });
      return res.redirect('/');
    } catch {
      return res.render('login', { error: 'Invalid username or password' });
    }
  }

  @Post('logout')
  logout(@Res() res: Response) {
    res.clearCookie('Authentication');
    return res.redirect('/login');
  }
}
