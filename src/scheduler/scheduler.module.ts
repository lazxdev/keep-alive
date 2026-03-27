import { Module } from '@nestjs/common';
import { SchedulerService } from './scheduler.service';
import { PingService } from './ping.service';
import { AppsModule } from '../apps/apps.module';
import { ChecksModule } from '../checks/checks.module';
import { EventsModule } from '../events/events.module';

@Module({
  imports: [AppsModule, ChecksModule, EventsModule],
  providers: [SchedulerService, PingService],
})
export class SchedulerModule {}
