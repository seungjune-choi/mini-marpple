import { Controller } from '@libs/decorators/rest/controller.decorator';
import { container } from 'tsyringe';
import { Get, REQUEST_METHOD_TOKEN } from '@libs/decorators/rest/request-method.decorator';

it('컨테이너에 등록 확인', () => {
  @Controller('/test')
  class TestController {}

  const instance = container.resolve(TestController);

  expect(instance).toBeInstanceOf(TestController);
});

it('Metadata 등록 - with request method', () => {
  @Controller('/test')
  class TestController {
    @Get('/2')
    test() {}
  }

  const metadata = Reflect.getMetadata(REQUEST_METHOD_TOKEN, TestController);

  expect(metadata).toEqual([
    {
      method: 'get',
      path: '/2',
      methodName: 'test',
    },
  ]);
});
