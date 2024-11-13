import { Controller, Get } from '@libs/decorators';
import { AppService } from '@backend/app.service';

@Controller('/')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/health')
  public healthCheck() {
    return this.appService.healthCheck();
  }
}
