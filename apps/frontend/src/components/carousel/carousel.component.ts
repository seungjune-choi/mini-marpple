import { View, html, on, type Html } from 'rune-ts';
import style from './carousel.module.scss';

interface CarouselProps {
  children: Html[];
  width?: string;
  height?: string;
  autoPlay?: boolean;
  interval?: number;
}

export class Carousel extends View<CarouselProps> {
  private _currentIndex = 0;
  private intervalId: NodeJS.Timeout | null = null;

  constructor(props: CarouselProps) {
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

  addChild(child: Html[]) {
    this.data.children = [...this.data.children, ...child];
    this.redraw();
  }
}
