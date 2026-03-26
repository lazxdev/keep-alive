import { Module } from '@nestjs/common';
import { SchedulerService } from './scheduler.service';
import { AppsModule } from '../apps/apps.module';
import { ChecksModule } from '../checks/checks.module';

@Module({
  imports: [AppsModule, ChecksModule],
  providers: [SchedulerService],
})
export class SchedulerModule {}
