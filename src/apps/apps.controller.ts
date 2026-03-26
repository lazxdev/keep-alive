import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AppsService } from './apps.service';

@Controller('apps')
export class AppsController {
  constructor(private readonly appsService: AppsService) {}

  @Post()
  create(@Body() createAppDto: any) {
    return this.appsService.create(createAppDto);
  }

  @Get()
  findAll() {
    return this.appsService.findAll();
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAppDto: any) {
    return this.appsService.update(+id, updateAppDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.appsService.remove(+id);
  }
}
