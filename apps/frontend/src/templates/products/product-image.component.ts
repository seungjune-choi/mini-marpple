import { CustomEventWithDetail, html, on, View } from 'rune-ts';
import style from './product-image.module.scss';
import { Carousel } from '../../components/carousel';
import { forEach, map, pipe } from '@fxts/core';

export class PrimarySelected extends CustomEventWithDetail<{ id: number | string }> {}

interface ProductImageProps {
  id: number | string;
  src: string | ArrayBuffer | null;
  alt: string;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  primary?: boolean;
}

export class ProductImage extends View<ProductImageProps> {
  override template() {
    return html`
      <div class="${style['product-image-container']}">
        <img
          class="${style.img} ${this.data.primary ? style.primary : ''}"
          src="${this.data.src}"
          alt="${this.data.alt}"
          width="100%"
          object-fit="${this.data.objectFit ?? 'contain'}"
        />
        <span class="${style['primary-label']} ${this.data.primary ? '' : style.hidden}"> ${'대표 이미지'} </span>
      </div>
    `;
  }

  @on('click', `.${style.img}`)
  handleClick() {
    const span = this.element().querySelector(`.${style['primary-label']}`)!;

    // 이미지가 primary로 선택되어 있을 때, 다시 클릭하면 primary 해제만 하고 이벤트를 발생시키지 않음
    if (this.data.primary) {
      span.classList.toggle(style.hidden);
      this.data.primary = !this.data.primary;
      return;
    }

    // 이미지가 primary로 선택되어 있지 않을 때, primary로 선택하고 이벤트 발생
    this.dispatchEvent(PrimarySelected, {
      bubbles: true,
      detail: { id: this.data.id },
    });
  }

  public unselect() {
    this.togglePrimary(false);
  }

  public select() {
    this.togglePrimary(true);
  }

  private togglePrimary(isPrimary: boolean) {
    const span = this.element().querySelector(`.${style['primary-label']}`)!;
    span.classList.toggle(style.hidden, !isPrimary);
    this.data.primary = isPrimary;
  }

  public get id() {
    return this.data.id;
  }
}

export class ImageList extends Carousel<ProductImageProps, ProductImage> {
  public constructor(private readonly images: ProductImage[]) {
    super({ children: images });
  }

  @on(PrimarySelected)
  private handlePrimarySelected(e: PrimarySelected) {
    pipe(
      this.data.children,
      map((img) => ({
        img,
        primary: e.detail.id === img.id,
      })),
      forEach(({ img, primary }) => (primary ? img.select() : img.unselect())),
    );
  }

  get representativeIndex() {
    return this.data.children.findIndex((img) => img.data.primary);
  }
}
