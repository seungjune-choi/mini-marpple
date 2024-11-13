import { Get, IRequest, Post, REQUEST_METHOD_TOKEN } from '@libs/decorators/rest';
import { RequestMethod } from '@libs/enums';

it('메타데이터 정의 확인', () => {
  // Arrange
  class Test {
    @Get()
    public test() {}
  }

  // Act
  const metadata = Reflect.getMetadata(REQUEST_METHOD_TOKEN, Test) as IRequest[];

  // Assert
  expect(metadata).toEqual([
    {
      method: RequestMethod.GET,
      path: '',
      methodName: 'test',
    },
  ]);
});

it('같은 path, 다른 method 에도 정상적으로 metadata 가 각각 정의', () => {
  // Arrange
  class Test {
    @Get()
    public get() {}

    @Post()
    public post() {}
  }

  // Act
  const metadata = Reflect.getMetadata(REQUEST_METHOD_TOKEN, Test) as IRequest[];

  // Assert
  expect(metadata).toEqual([
    {
      method: RequestMethod.GET,
      path: '',
      methodName: 'get',
    },
    {
      method: RequestMethod.POST,
      path: '',
      methodName: 'post',
    },
  ]);
});

it('같은 path, 같은 method 를 중복 정의할 경우 마지막 정의로 덮어쓰기', () => {
  // Arrange
  class Test {
    @Get()
    public get() {}

    @Get()
    public get2() {}
  }

  // Act
  const metadata = Reflect.getMetadata(REQUEST_METHOD_TOKEN, Test) as IRequest[];

  // Assert
  expect(metadata).toEqual([
    {
      method: RequestMethod.GET,
      path: '',
      methodName: 'get2',
    },
  ]);
});
