import { Inject, Injectable } from '@libs/decorators';
import { DATA_SOURCE, DataSource } from '@libs/database';

@Injectable()
export class AppService {
  constructor(@Inject(DATA_SOURCE) private dataSource: DataSource) {}

  public async healthCheck() {
    return await this.dataSource.$query<{ now: string }>`SELECT now()`.then((rows) => rows[0]);
  }
}
