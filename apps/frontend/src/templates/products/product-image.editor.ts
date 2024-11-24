import { html, on, View } from 'rune-ts';
import { FileButton } from '../../components/button';
import { ImageList, ProductImage, RepresentativeChangedEvent } from './product-image.component';
import { fx } from '@fxts/core';
import { readFile } from '../../utils';
import type { BindModel } from '../../experimental';
import type { Product } from '../../model';

export interface ProductImageEditorProps {
  model: BindModel<Partial<Product>>;
}

export class ProductImageEditor extends View<ProductImageEditorProps> {
  private readonly button = new FileButton({
    id: 'image-loader',
    name: 'upload',
  });

  private readonly image_preview = new ImageList(
    this.data.model.value.images?.map((img) => new ProductImage({ id: img.id, src: img.url, alt: 'product image' })) ??
      [],
  );
  #files: File[] = [];

  override template() {
    console.log('ProductImageEditor', this.data.model.value.images);
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

    this.data.model.update(
      'images',
      imgs.map((img) => ({
        id: -1,
        url: img.data.src as string,
        isRepresentative: this.image_preview.representativeIndex === img.data.id,
      })),
    );
    this.image_preview.addChild(imgs);
  }

  @on(RepresentativeChangedEvent)
  private handleRepresentativeChanged(event: RepresentativeChangedEvent) {
    this.data.model.update('images', [
      {
        id: -1,
        url: event.detail.src as string,
        isRepresentative: true,
      },
    ]);
  }

  get value() {
    return {
      representativeIndex: this.image_preview.representativeIndex,
      images: this.#files,
    };
  }
}
