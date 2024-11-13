import { redisClient } from '@libs/redis';
import Redlock from 'redlock';

export const redlock = new Redlock([redisClient]);

export const LOCK = Symbol('__lock__');
