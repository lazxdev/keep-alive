import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { AppsModule } from '../apps/apps.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AppsModule, AuthModule],
  controllers: [DashboardController],
})
export class DashboardModule {}
