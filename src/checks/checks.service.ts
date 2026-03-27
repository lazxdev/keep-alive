import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Check } from './check.entity';
import { App } from '../apps/app.entity';

@Injectable()
export class ChecksService {
  constructor(
    @InjectRepository(Check)
    private checkRepository: Repository<Check>,
  ) {}

  create(app: App, success: boolean, responseTime: number, statusCode: number) {
    const check = this.checkRepository.create({
      app,
      success,
      responseTime,
      statusCode,
    });
    return this.checkRepository.save(check);
  }

  async deleteOldChecks(days: number) {
    const thresholdDate = new Date();
    thresholdDate.setDate(thresholdDate.getDate() - days);
    
    const result = await this.checkRepository
      .createQueryBuilder()
      .delete()
      .from(Check)
      .where("createdAt < :date", { date: thresholdDate })
      .execute();
      
    return result.affected;
  }
}
