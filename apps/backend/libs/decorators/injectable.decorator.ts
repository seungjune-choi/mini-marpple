import { singleton } from 'tsyringe';

export function Injectable(): ClassDecorator {
  return (target: any) => {
    singleton()(target);
  };
}
