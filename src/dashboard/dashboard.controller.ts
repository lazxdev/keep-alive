import { Controller, Get, Render } from '@nestjs/common';
import { AppsService } from '../apps/apps.service';

@Controller()
export class DashboardController {
  constructor(private readonly appsService: AppsService) {}

  @Get()
  @Render('index')
  async root() {
    const apps = await this.appsService.findAll();
    return { apps };
  }
}
