import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppsController } from './apps.controller';
import { AppsService } from './apps.service';
import { App } from './app.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([App]), AuthModule],
  controllers: [AppsController],
  providers: [AppsService],
  exports: [AppsService]
})
export class AppsModule {}
