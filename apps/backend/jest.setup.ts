import { testDataSource } from './fixture';

export default async () => {
  await testDataSource.$connect();
  global.__DATA_SOURCE__ = testDataSource;
  console.log('Jest setup completed');
};
