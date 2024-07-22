import { Module } from '@nestjs/common';
import { SensorService } from './modules/sensor/service';
import { ElenaService } from './modules/elena/service';
import { SensorController } from './modules/sensor/controller';
import { ElenaController } from './modules/elena/controller';
import { RepositoryService } from './modules/repository/mongo';
import { SheetsService } from './modules/google/sheets';

@Module({
  imports: [],
  controllers: [SensorController, ElenaController],
  providers: [SensorService, ElenaService, RepositoryService, SheetsService],
})
export class AppModule {}
