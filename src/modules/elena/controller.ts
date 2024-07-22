import { Controller, Get } from '@nestjs/common';
import { ElenaService } from './service';

@Controller('/api/elena')
export class ElenaController {
  constructor(private readonly service: ElenaService) {}

  @Get()
  async getInfo() {
    return await this.service.getInfo();
  }
}
