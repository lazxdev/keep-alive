import { Controller, Get, Render, UseGuards } from '@nestjs/common';
import { AppsService } from '../apps/apps.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller()
export class DashboardController {
  constructor(private readonly appsService: AppsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  @Render('index')
  async root() {
    const apps = await this.appsService.findAll();
    return { apps };
  }
}
