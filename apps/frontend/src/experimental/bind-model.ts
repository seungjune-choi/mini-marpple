/* eslint-disable @typescript-eslint/no-explicit-any */

import { forEach, pipe } from '@fxts/core';

type Target = string | symbol;

export class BindModel<T extends Record<Target, any>> {
  /**
   * @description
   * - 값 객체(value) 의 특정 키(target) 에 대한 변경 리스너 목록을 저장합니다.
   */
  protected _listeners = new Map<keyof T, ((value: T[keyof T]) => any)[]>();

  /**
   * @description
   * - 값 객체(value) 를 저장합니다.
   */
  private _value: T;

  constructor(initialValue = {} as T) {
    this._value = initialValue;
  }

  get value(): T {
    // TODO: deep copy
    return this._value;
  }

  /**
   * @description
   * - 값 객체(value) 의 특정 키(target) 에 대한 값을 변경하고, 변경된 값을 감지한 리스너를 호출합니다.
   * @example
   * ```ts
   * const model = new BindModel({ name: 'John' });
   * model.update('name', 'Jane');
   * console.log(model.value.name); // Jane
   * ```
   */
  update<K extends keyof T, V extends T[K]>(target: K, value: V): void {
    if (this._value[target] !== value) {
      this._value[target] = value;
      this.#notify(target, value);
    }
  }

  /**
   * @description
   * - 값 객체(value) 의 특정 키(target) 이 변경되었을 때 호출할 리스너를 등록합니다.
   * @example
   * ```ts
   * const model = new BindModel({ name: 'John' });
   * model.bind('name', (value) => console.log(value));
   * model.bind('name', (value) => this.element().querySelector('p').textContent = value);
   * model.update('name', 'Jane');
   *
   * // 이후 콘솔에는 'Jane'이 출력되고, p 태그의 텍스트는 'Jane'으로 변경됩니다.
   * ```
   */
  bind<K extends keyof T, V extends T[K]>(target: K, listener: (value: V) => any): void {
    if (!this._listeners.has(target)) {
      this._listeners.set(target, []);
    }
    this._listeners.get(target)?.push(listener);
  }

  /**
   * @description
   * - 값 객체(value) 의 특정 키(target) 에 대한 리스너들을 모두 호출합니다.
   */
  #notify<K extends keyof T, V extends T[K]>(target: K, value: V) {
    if (!this._listeners.has(target)) {
      return;
    }

    pipe(
      this._listeners.get(target)!,
      forEach((listener) => listener(value)),
    );
  }

  /**
   * @description
   * - 모델 객체로서 유효성검사가 필요한 경우 이 클래스를 상속받은 클래스에서 구현해야 하는 메서드입니다.
   * - key가 주어지지 않은 경우 값 객체 전체에 대한 유효성검사를 수행하고, key가 주어진 경우 해당 키에 대한 유효성검사를 수행할 것을 권장합니다.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  validate<K extends keyof T>(key?: K) {
    throw new Error('Not implemented');
  }
}
