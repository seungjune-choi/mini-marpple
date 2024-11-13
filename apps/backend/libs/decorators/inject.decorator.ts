import { inject } from 'tsyringe';

export const Inject = (token: symbol | string) => inject(token);
