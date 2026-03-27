import { Controller, Get, Post, Body, Res, Redirect, UseInterceptors, HttpStatus } from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { LoginInterceptor } from './interceptors/login.interceptor';

@Controller('login')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  getLoginPage(@Res() res: Response) {
    return res.render('login');
  }

  @Post()
  @UseInterceptors(LoginInterceptor)
  @Redirect('/', HttpStatus.FOUND)
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto.username, loginDto.password);
  }

  @Post('logout')
  logout(@Res() res: Response) {
    res.clearCookie('Authentication');
    return res.redirect('/login');
  }
}
