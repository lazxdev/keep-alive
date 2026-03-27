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

  async findAll() {
    try {
      return await this.appRepository.find();
    } catch (error: unknown) {
      this.logger.error(`Error fetching all apps: ${(error as Error).message}`);
      throw new InternalServerErrorException('No se pudieron obtener las aplicaciones');
    }
  }

  async findActive() {
    try {
      return await this.appRepository.find({ where: { enabled: true } });
    } catch (error: unknown) {
      this.logger.error(`Error fetching active apps: ${(error as Error).message}`);
      throw new InternalServerErrorException('No se pudieron obtener las aplicaciones activas');
    }
  }

  async findOne(id: number) {
    try {
      const app = await this.appRepository.findOne({ where: { id } });
      if (!app) throw new NotFoundException(`App #${id} not found`);
      return app;
    } catch (error: unknown) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error(`Error finding app ${id}: ${(error as Error).message}`);
      throw new InternalServerErrorException('Error al buscar la aplicación');
    }
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
