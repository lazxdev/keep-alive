import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { DatabaseModule } from './database/database.module';
import { AppsModule } from './apps/apps.module';
import { ChecksModule } from './checks/checks.module';
import { SchedulerModule } from './scheduler/scheduler.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    DatabaseModule,
    AppsModule,
    ChecksModule,
    SchedulerModule,
    DashboardModule,
  ],
})
export class AppModule {}
