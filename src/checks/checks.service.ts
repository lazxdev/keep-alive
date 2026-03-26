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
}
