import { html, on } from 'rune-ts';
import { FileButton } from '../../components/button';
import { ImageList, ProductImage } from './product-image.component';
import { fx } from '@fxts/core';
import { readFile } from '../../utils';
import { Box } from '../../components';

export class ProductImageEditor extends Box {
  private readonly button = new FileButton({
    id: 'image-loader',
    name: 'upload',
  });

  private readonly image_preview = new ImageList([]);
  #files: File[] = [];

  override template() {
    return html`
      <div class="form-group">
        <div class="form-control">${this.image_preview}</div>
        <div class="form-control">${this.button}</div>
      </div>
    `;
  }

  @on('change', '#image-loader')
  private async handleImageLoad(event) {
    this.#files = [];
    this.#files = Array.from(event.target.files as FileList);

    const imgs = await fx(event.target.files as FileList)
      .toAsync()
      .map(readFile)
      .toArray()
      .then((images) => images.map((src, index) => new ProductImage({ id: index, src, alt: 'product image' })));

    this.image_preview.addChild(imgs);
  }

  get value() {
    return {
      representativeIndex: this.image_preview.representativeIndex,
      images: this.#files,
    };
  }
}
