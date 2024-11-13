import { Injectable } from '@libs/decorators';
import { ILogger } from './logger.interface';

@Injectable()
export class Logger implements ILogger {
  constructor(private _context = '') {}

  info(message: string, context?: string): void {
    console.log(`[INFO] [${context ?? this._context}] ${message}`);
  }

  verbose(message: string, context?: string): void {
    console.log(`[VERBOSE] [${context ?? this._context}] ${message}`);
  }

  debug(message: string, context?: string): void {
    console.log(`[DEBUG] [${context ?? this._context}] ${message}`);
  }

  warn(message: string, context?: string): void {
    console.log(`[WARN] [${context ?? this._context}] ${message}`);
  }

  error(message: string, trace?: string, context?: string): void {
    console.error(`[ERROR] [${context ?? this._context}] ${message}`, trace);
  }

  setContext(context: string): void {
    this._context = context;
  }
}
