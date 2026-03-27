import { Injectable, NotFoundException, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { App } from './app.entity';

@Injectable()
export class AppsService {
  private readonly logger = new Logger(AppsService.name);

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

  async create(appData: Partial<App>) {
    try {
      const app = this.appRepository.create(appData);
      return await this.appRepository.save(app);
    } catch (error: any) {
      this.logger.error(`Error creating app: ${error.message}`);
      throw new InternalServerErrorException('No se pudo crear la aplicación en base de datos');
    }
  }

  async update(id: number, updateData: Partial<App>) {
    try {
      await this.appRepository.update(id, updateData);
    } catch (error: any) {
      this.logger.error(`Error updating app ${id}: ${error.message}`);
      throw new InternalServerErrorException('Error al actualizar la aplicación');
    }
    return this.findOne(id);
  }

  async remove(id: number) {
    const app = await this.findOne(id);
    try {
      return await this.appRepository.remove(app);
    } catch (error: any) {
      this.logger.error(`Error removing app ${id}: ${error.message}`);
      throw new InternalServerErrorException('Error al intentar eliminar la aplicación');
    }
  }
}
