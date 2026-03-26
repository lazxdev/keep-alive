import { Module } from '@nestjs/common';
import { SchedulerService } from './scheduler.service';
import { AppsModule } from '../apps/apps.module';
import { ChecksModule } from '../checks/checks.module';
import { EventsModule } from '../events/events.module';

@Module({
  imports: [AppsModule, ChecksModule, EventsModule],
  providers: [SchedulerService],
})
export class SchedulerModule {}
