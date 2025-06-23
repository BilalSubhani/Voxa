import { Controller, Get } from '@nestjs/common';

import { AppService } from './app.service';
import { ResponseUtil } from './common/utils/response.util';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello() {
    return ResponseUtil.success('API is up', {
      version: '1.0.0',
      uptime: process.uptime(),
    });
  }
}
