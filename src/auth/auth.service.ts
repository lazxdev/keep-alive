import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private jwtService: JwtService
  ) {}

  async login(username: string, pass: string) {
    const validUsername = this.configService.get<string>('ADMIN_USERNAME') || 'admin';
    const validPassword = this.configService.get<string>('ADMIN_PASSWORD') || 'admin';

    if (username === validUsername && pass === validPassword) {
      const payload = { sub: 1, username };
      return {
        access_token: await this.jwtService.signAsync(payload),
      };
    }
    throw new UnauthorizedException('Credenciales inválidas');
  }
}
