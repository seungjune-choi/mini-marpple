import { Injectable } from '@libs/decorators/injectable.decorator';
import { container } from 'tsyringe';

@Injectable()
export class FirstService {
  constructor() {}

  public test() {
    return 'first';
  }
}

@Injectable()
export class SecondService {
  constructor(private readonly firstService: FirstService) {}

  public test() {
    return this.firstService.test() + ' second';
  }
}

describe(Injectable.name, () => {
  it('class name token 으로 instance 화', () => {
    const first = container.resolve(FirstService);

    expect(first.test()).toBe('first');
  });

  it('singleton 확인', () => {
    const first = container.resolve(FirstService);
    const second = container.resolve(FirstService);

    expect(first).toBe(second);
  });

  it('Dependency Injection', () => {
    const second = container.resolve(SecondService);

    expect(second.test()).toBe('first second');
  });
});
