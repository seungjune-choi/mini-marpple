import { html, on, View } from 'rune-ts';
import { FileButton } from '../../components/button';
import { ImageList, ProductImage, RepresentativeChangedEvent } from './product-image.component';
import { fx, map, pipe, range, toArray, zip } from '@fxts/core';
import type { BindModel } from '../../experimental';
import type { Product } from '../../model';
import { readFile } from '../../utils';

export interface ProductImageEditorProps {
  model: BindModel<Partial<Product>>;
}

export class ProductImageEditor extends View<ProductImageEditorProps> {
  private readonly button = new FileButton({
    id: 'image-loader',
    name: 'upload',
  });

  private readonly imagePreview = new ImageList(
    this.data.model.value.images?.map(
      (img) =>
        new ProductImage({
          id: img.id,
          src: img.src,
          alt: img.isRepresentative ? '대표 이미지' : '옵션 이미지',
          representative: img.isRepresentative,
        }),
    ) ?? [],
  );

  override template() {
    return html`
      <div class="form-group">
        <div class="form-control">${this.imagePreview}</div>
        <div class="form-control">${this.button}</div>
      </div>
    `;
  }

  // Q. 더 나은 방법이 있을까?
  @on('change', '#image-loader')
  private async handleImageLoad(event) {
    this.data.model.update(
      'images',
      pipe(
        event.target.files as FileList,
        zip(range(event.target.files.length)),
        map(([index, file]) => ({
          id: index,
          src: file,
          isRepresentative: index === this.imagePreview.representativeIndex,
        })),
        toArray,
      ),
    );

    this.imagePreview.setChild(
      await fx(this.data.model.value.images!)
        .toAsync()
        .map(async (img) => ({
          id: img.id,
          src: (await readFile(img.src as File)) as string,
          alt: img.isRepresentative ? '대표 이미지' : '옵션 이미지',
          isRepresentative: img.isRepresentative,
        }))
        .map((img) => new ProductImage(img))
        .toArray(),
    );
  }

  @on(RepresentativeChangedEvent)
  private handleRepresentativeChanged(event: RepresentativeChangedEvent) {
    const { id } = event.detail;
    this.data.model.update(
      'images',
      fx(this.data.model.value.images!)
        .map((img) => ({
          ...img,
          isRepresentative: img.id === id,
        }))
        .toArray(),
    );
  }

  get value() {
    return {
      representativeIndex: this.imagePreview.representativeIndex,
      images: [],
    };
  }
}
