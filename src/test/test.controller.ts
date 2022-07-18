import { Controller, Get } from '@nestjs/common';
import { TestService } from './test.service';

@Controller('test')
export class TestController {
  constructor(private testService: TestService) {}
  @Get()
  create() {
    return this.testService.create();
  }

  @Get('/test')
  findAll() {
    return this.testService.findAll();
  }
}
