export default async () => {
  const dataSource = global.__DATA_SOURCE__;

  if (dataSource) {
    // await dataSource.$query`TRUNCATE TABLE categories RESTART IDENTITY CASCADE`;
    await dataSource.$disconnect();
  }
};
