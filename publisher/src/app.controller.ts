import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getHello() {
    //Will
    console.log('PRODUCER, publishing message');
    await this.appService.sendMessages();
    return 'Mesages sent successfully';
  }
}
