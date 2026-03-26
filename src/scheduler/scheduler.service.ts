import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { AppsService } from '../apps/apps.service';
import { ChecksService } from '../checks/checks.service';
import axios from 'axios';

@Injectable()
export class SchedulerService {
  private readonly logger = new Logger(SchedulerService.name);

  constructor(
    private readonly appsService: AppsService,
    private readonly checksService: ChecksService,
  ) {}

  @Cron('*/10 * * * * *') //10 segundos
  async handleCron() {
    const apps = await this.appsService.findAll();
    const now = new Date();

    for (const app of apps) {
      if (this.shouldPingApp(app, now)) {
        // Run asynchronously so it doesn't block other app pings
        this.pingApp(app).catch((err) => this.logger.error(err));
      }
    }
  }

  private shouldPingApp(app: any, now: Date): boolean {
    if (!app.enabled) return false;
    if (!app.lastCheck) return true;

    const diffInSeconds = (now.getTime() - app.lastCheck.getTime()) / 1000;
    const interval = this.calculateDynamicInterval(app);

    return diffInSeconds >= interval;
  }

  private calculateDynamicInterval(app: any): number {
    if (app.failureCount > 0) {
      return 30;
    }
    return Math.floor(Math.random() * (300 - 240 + 1)) + 240;
  }

  private async pingApp(app: any) {
    const startTime = Date.now();
    let success = false;
    let statusCode = 0;

    try {
      const response = await axios.get(app.url, { timeout: 5000 });
      statusCode = response.status;
      success = true;
    } catch (error: any) {
      statusCode = error.response ? error.response.status : 0;
      success = false;
    }

    const responseTime = Date.now() - startTime;
    app.lastCheck = new Date();

    if (success) {
      app.failureCount = 0;
    } else {
      app.failureCount += 1;
    }

    await this.appsService.update(app.id, {
      failureCount: app.failureCount,
      lastCheck: app.lastCheck,
    });

    await this.checksService.create(app, success, responseTime, statusCode);
    this.logger.log(
      `Pinged ${app.name} (${app.url}) - Status: ${statusCode} - Success: ${success}`,
    );
  }
}
