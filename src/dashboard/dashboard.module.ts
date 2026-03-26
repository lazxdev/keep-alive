import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { AppsModule } from '../apps/apps.module';

@Module({
  imports: [AppsModule],
  controllers: [DashboardController],
})
export class DashboardModule {}
