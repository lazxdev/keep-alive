import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { App } from './app.entity';

@Injectable()
export class AppsService {
  constructor(
    @InjectRepository(App)
    private appRepository: Repository<App>,
  ) {}

  findAll() {
    return this.appRepository.find();
  }

  findActive() {
    return this.appRepository.find({ where: { enabled: true } });
  }

  async findOne(id: number) {
    const app = await this.appRepository.findOne({ where: { id } });
    if (!app) throw new NotFoundException(`App #${id} not found`);
    return app;
  }

  create(appData: Partial<App>) {
    const app = this.appRepository.create(appData);
    return this.appRepository.save(app);
  }

  async update(id: number, updateData: Partial<App>) {
    await this.appRepository.update(id, updateData);
    return this.findOne(id);
  }

  async remove(id: number) {
    const app = await this.findOne(id);
    return this.appRepository.remove(app);
  }
}
