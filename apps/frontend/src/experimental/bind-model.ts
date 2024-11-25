/* eslint-disable @typescript-eslint/no-explicit-any */

type Target = string | symbol;

export class BindModel<T extends Record<Target, any>> {
  protected _listeners = new Map<keyof T, ((value: T[keyof T]) => any)[]>();
  private _value: T;

  constructor(initialValue = {} as T) {
    this._value = initialValue;
  }

  get value(): T {
    return this._value;
  }

  update<K extends keyof T, V extends T[K]>(target: K, value: V): void {
    if (this._value[target] !== value) {
      this._value[target] = value;
      this.#notify(target, value);
    }
  }

  bind<K extends keyof T, V extends T[K]>(target: K, listener: (value: V) => any): void {
    if (!this._listeners.has(target)) {
      this._listeners.set(target, []);
    }
    this._listeners.get(target)?.push(listener);
  }

  #notify<K extends keyof T, V extends T[K]>(target: K, value: V) {
    if (!this._listeners.has(target)) {
      return;
    }

    for (const listener of this._listeners.get(target)!) {
      listener(value);
    }
  }

  validate<K extends keyof T>(key?: K) {
    throw new Error('Not implemented');
  }
}
