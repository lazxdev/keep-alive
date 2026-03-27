import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Check } from './check.entity';
import { App } from '../apps/app.entity';

@Injectable()
export class ChecksService {
  private readonly logger = new Logger(ChecksService.name);

  constructor(
    @InjectRepository(Check)
    private checkRepository: Repository<Check>,
  ) {}

  async create(app: App, success: boolean, responseTime: number, statusCode: number): Promise<Check | null> {
    try {
      const check = this.checkRepository.create({ app, success, responseTime, statusCode });
      return await this.checkRepository.save(check);
    } catch (error: unknown) {
      this.logger.error(`Error saving check for ${app.name}: ${(error as Error).message}`);
      return null;
    }
  }

  async deleteOldChecks(days: number): Promise<number | null | undefined> {
    try {
      const thresholdDate = new Date();
      thresholdDate.setDate(thresholdDate.getDate() - days);

      const result = await this.checkRepository
        .createQueryBuilder()
        .delete()
        .from(Check)
        .where('createdAt < :date', { date: thresholdDate })
        .execute();

      return result.affected;
    } catch (error: unknown) {
      this.logger.error(`Error deleting old checks: ${(error as Error).message}`);
      return 0;
    }
  }
}
