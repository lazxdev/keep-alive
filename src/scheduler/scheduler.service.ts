import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import { AppsService } from '../apps/apps.service';
import { ChecksService } from '../checks/checks.service';
import { EventsGateway } from '../events/events.gateway';
import { PingService } from './ping.service';

@Injectable()
export class SchedulerService {
  private readonly logger = new Logger(SchedulerService.name);

  constructor(
    private readonly appsService: AppsService,
    private readonly checksService: ChecksService,
    private readonly eventsGateway: EventsGateway,
    private readonly configService: ConfigService,
    private readonly pingService: PingService,
  ) { }

  @Cron('*/10 * * * * *') //10 segundos
  async handleCron() {
    try {
      const apps = await this.appsService.findActive();
      const now = new Date();

      for (const app of apps) {
        if (this.shouldPingApp(app, now)) {
          // Run asynchronously so it doesn't block other app pings
          this.pingApp(app).catch(err => this.logger.error(`Error procesando ping para ${app.name}: ${err.message}`));
        }
      }
    } catch (error: any) {
      this.logger.error(`Error crítico obteniendo apps activas en Cron: ${error.message}`);
    }
  }

  private shouldPingApp(app: any, now: Date): boolean {
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
    const timeout = this.configService.get<number>('AXIOS_TIMEOUT') || 5000;
    const { success, statusCode, responseTime } = await this.pingService.executePing(app.url, timeout);

    app.lastCheck = new Date();

    if (success) {
      app.failureCount = 0;
    } else {
      app.failureCount += 1;
    }

    try {
      await this.appsService.update(app.id, {
        failureCount: app.failureCount,
        lastCheck: app.lastCheck,
      });

      await this.checksService.create(app, success, responseTime, statusCode);
    } catch (dbError: any) {
      this.logger.error(`Error guardando resultados del check de ${app.name} en BD: ${dbError.message}`);
    }

    try {
      // Emit live update to the dashboard using strictly typed payload
      const payload = {
        status: success ? 'up' as const : 'down' as const,
        lastCheck: new Date(app.lastCheck).toLocaleString(),
        failureCount: app.failureCount,
      };
      this.eventsGateway.emitAppUpdate(app.id, payload);
    } catch (wsError: any) {
      this.logger.error(`Error emitiendo evento WebSocket para ${app.name}: ${wsError.message}`);
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async cleanupOldChecks() {
    this.logger.log('Starting midnight cleanup of old check records...');
    try {
      // Borrar registros con más de 2 días de antigüedad, según lo que pidió el usuario.
      const deletedCount = await this.checksService.deleteOldChecks(2);
      this.logger.log(`Cleanup complete. Deleted ${deletedCount} records older than 2 days.`);
    } catch (error: any) {
      this.logger.error(`Error during DB checks cleanup: ${error.message}`, error.stack);
    }
  }
}
