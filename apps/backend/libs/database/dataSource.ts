/* eslint-disable @typescript-eslint/no-explicit-any */
import * as FxSQL from 'fxsql';

interface DataSourceConnectOptions {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
}

export const DATA_SOURCE = Symbol('__DATA_SOURCE__');

export class DataSource {
  constructor(private readonly options: DataSourceConnectOptions) {}

  private _pool: FxSQL.PostgreSQL.Pool | null = null;

  get pool() {
    if (!this._pool) {
      throw new Error('DataSource is not connected');
    }
    return this._pool;
  }

  public async $connect() {
    this._pool = await FxSQL.PostgreSQL.CONNECT({
      host: this.options.host,
      port: this.options.port,
      user: this.options.user,
      password: this.options.password,
      database: this.options.database,
    });

    this._pool.FxSQL_DEBUG = true;
  }

  public async $disconnect() {
    await this._pool?.END();
  }

  public $query = <T = any>(str: TemplateStringsArray, ...values: unknown[]) =>
    this._pool?.QUERY(str, ...values) as Promise<T[]>;

  public $values = <T = unknown>(values: T[]) => this._pool.VALUES(values);

  public $set = <T = unknown>(values: T) => this._pool.SET(values);

  public $in = <T = any>(fieldName: string, values: T[]) => this._pool.IN(fieldName, values);

  public $columns = (...columns: string[]) => this._pool.COLUMN(columns);

  public $transaction<T>(callback: (tx: TransactionClient) => Promise<T>): Promise<T>;

  public $transaction(): Promise<{
    $query: DataSource['$query'];
    $commit: () => Promise<void>;
    $rollback: () => Promise<void>;
  }>;

  public $transaction<T = any>(callback?: <T>(tx: TransactionClient) => Promise<T>): Promise<T | TransactionClient> {
    return callback ? this._transactionWithCallback<T>(callback) : this._transaction();
  }

  public $associate = <T = any>(str: TemplateStringsArray, ...values: unknown[]) =>
    this._pool?.ASSOCIATE(str, ...values) as Promise<T[]>;

  public $sql = (str: TemplateStringsArray, ...values: unknown[]) => this._pool?.SQL(str, ...values);

  private _transactionWithCallback = async <T>(callback: <T>(tx: TransactionClient) => Promise<T>): Promise<T> => {
    const { QUERY, COMMIT, ROLLBACK } = await this._pool.TRANSACTION();
    try {
      const res = await callback({ $query: QUERY });
      await COMMIT();
      return res as T;
    } catch (error) {
      await ROLLBACK();
      throw error;
    }
  };

  private _transaction = async () => {
    const { QUERY, COMMIT, ROLLBACK } = await this._pool.TRANSACTION();
    return {
      $query: QUERY,
      $commit: COMMIT,
      $rollback: ROLLBACK,
    };
  };
}

export interface TransactionClient {
  $query: DataSource['$query'];
}
