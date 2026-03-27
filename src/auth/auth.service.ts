import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private configService: ConfigService,
    private jwtService: JwtService
  ) {}

  async login(username: string, pass: string) {
    const validUsername = this.configService.get<string>('ADMIN_USERNAME') || 'admin';
    const validPassword = this.configService.get<string>('ADMIN_PASSWORD') || 'admin';

    if (username === validUsername && pass === validPassword) {
      const payload = { sub: username, username };
      return {
        access_token: await this.jwtService.signAsync(payload),
      };
    }
    this.logger.warn(`Intento de login fallido para el usuario: ${username}`);
    throw new UnauthorizedException('Credenciales inválidas');
  }
}
