import { View, html, on } from 'rune-ts';
import style from './carousel.module.scss';

interface CarouselProps<T extends View<{ id: number | string }>> {
  children: T[];
  autoPlay?: boolean;
  interval?: number;
}

export class Carousel<T extends { id: number | string }, IV extends View<T>> extends View<CarouselProps<IV>> {
  private _currentIndex = 0;
  private intervalId: NodeJS.Timeout | null = null;

  constructor(props: CarouselProps<IV>) {
    super(props);
    this.initAutoPlay();
  }

  override template() {
    return html`
      <div class="${style['carousel-container']}">
        <button class="${style.control} ${style.prev}">&lt;</button>
        <div class="${style.carousel}" style="transform: translateX(-${this._currentIndex * 100}%)">
          ${this.data.children ?? []}
        </div>
        <button class="${style.control} ${style.next}">&gt;</button>
      </div>
    `;
  }

  @on('click', `.${style.prev}`)
  prev() {
    this._currentIndex = (this._currentIndex - 1 + this.data.children.length) % this.data.children.length;
    this.redraw();
  }

  @on('click', `.${style.next}`)
  next() {
    this._currentIndex = (this._currentIndex + 1) % this.data.children.length;
    this.redraw();
  }

  private initAutoPlay() {
    if (this.data.autoPlay) {
      this.intervalId = setInterval(() => {
        this.next();
      }, this.data.interval ?? 3000);
    }
  }

  get currentIndex() {
    return this._currentIndex;
  }

  // TODO: set이 아니라 add로 해야하는데, 복잡도가 높아서 일단 set으로 구현
  setChild(child: IV[]) {
    this.data.children = [...child];
    this.redraw();
  }
}
