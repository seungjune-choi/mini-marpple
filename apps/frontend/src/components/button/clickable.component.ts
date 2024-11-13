import { View } from 'rune-ts';

export abstract class Clickable<T extends object> extends View<T> {
  abstract _click(): void;

  protected override onRender() {
    this.addEventListener('click', () => this._click());
  }
}
