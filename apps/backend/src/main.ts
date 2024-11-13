import 'reflect-metadata';
import express, { Express } from 'express';
import { appRouter } from '@libs/appRouter';
import { DATA_SOURCE, DataSource } from '@libs/database';
import { container } from 'tsyringe';
import { httpExceptionFilter, initializeSession, loggerMiddleware } from '@libs/middlewares';
import { LOCK, redlock } from '@libs/lock/lock';

async function bootstrap() {
  const app = express();
  await initialize(app);
  app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
  });
}

async function initialize(app: Express) {
  // set up database connection
  const dataSource = new DataSource({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'postgres',
    database: 'postgres',
  });

  await dataSource.$connect();

  // inject db instance to container
  container.register(DATA_SOURCE, { useValue: dataSource });
  container.register(LOCK, { useValue: redlock });

  // set up middlewares
  initializeSession(app);
  app.use(loggerMiddleware);

  // import controllers and presentation
  await require('./app.controller');
  await require('./presentation');
  await require('../libs/redis');

  // set up router
  app.use(appRouter);

  // set up global exception filter
  app.use(httpExceptionFilter);
}

bootstrap()
  .then(() => console.log('mini marpple is started'))
  .catch(console.error);
