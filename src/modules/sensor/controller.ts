import { Controller, Get, Query } from '@nestjs/common';
import { SensorService } from './service';
import { ISensorInformation } from 'src/interfaces/interface';

@Controller('/api/sensor')
export class SensorController {
  constructor(private readonly service: SensorService) {}

  @Get()
  async readData(@Query() query: ISensorInformation): Promise<void> {
    const { sensorIndentification, quantity } = query;

    await this.service.processData({
      sensorIndentification,
      quantity: Number(quantity),
    });
  }
}
