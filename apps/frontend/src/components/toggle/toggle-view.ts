import { View, CustomEventWithDetail } from 'rune-ts';

export class Toggled extends CustomEventWithDetail<{ on: boolean }> {}

interface Toggle {
  on: boolean;
  onClass: string;
}

export abstract class ToggleView extends View<Toggle> {
  constructor(data?: Toggle) {
    super(data ?? { on: false, onClass: '' });
  }

  protected override onRender() {
    this.element().addEventListener('click', () => this._toggle());
  }

  private _toggle() {
    console.log('toggle');
    this.setOn(!this.data.on);
    this.dispatchEvent(Toggled, { bubbles: true, detail: this.data });
  }

  setOn(bool: boolean) {
    this.data.on = bool;
    this.element().classList.toggle(this.data.onClass, bool);
  }
}
