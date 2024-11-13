export type CamelCase<S extends string> = S extends `${infer Head}_${infer Tail}`
  ? `${Head}${Capitalize<CamelCase<Tail>>}`
  : S;

export type DeepCamelCase<T> = T extends (infer U)[]
  ? DeepCamelCase<U>[]
  : T extends object
    ? {
        [K in keyof T as CamelCase<K & string>]: T[K];
      }
    : T;

// 문자열 리터럴 타입을 카멜케이스에서 스네이크케이스로 변환하는 유틸리티 타입
export type SnakeCase<S extends string> = S extends `${infer Head}${infer Tail}`
  ? Head extends Lowercase<Head>
    ? `${Head}${SnakeCase<Tail>}`
    : `_${Lowercase<Head>}${SnakeCase<Tail>}`
  : S;

// 객체의 키들을 재귀적으로 스네이크케이스로 변환하는 유틸리티 타입
export type DeepSnakeCase<T> = T extends (infer U)[]
  ? DeepSnakeCase<U>[]
  : T extends object
    ? {
        [K in keyof T as SnakeCase<K & string>]: T[K];
      }
    : T;
