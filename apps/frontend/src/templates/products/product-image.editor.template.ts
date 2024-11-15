import { html, on } from 'rune-ts';
import { FileButton } from '../../components/button';
import { ImageList, ProductImage } from './product-image.component';
import { fx } from '@fxts/core';
import { readFile } from '../../utils';
import { Box } from '../../components';

export class ProductImageEditorTemplate extends Box {
  private readonly button = new FileButton({
    id: 'image-loader',
    name: 'upload',
  });

  private readonly image_preview = new ImageList([]);

  override template() {
    return html`
      <div class="container horizontal">
        <div class="container vertical">
          <div class="form-group">
            <div class="form-control">${this.image_preview}</div>
            <div class="form-control">${this.button}</div>
          </div>
        </div>
        <div class="container vertical">
          <div
            style="
              width: 100%;
              height: 100%;
              background-color: #f1f1f1;
              display: flex;
              justify-content: center;
              align-items: center;
              margin: 0 auto;
              "
          >
            Not yet implemented
          </div>
        </div>
      </div>
    `;
  }

  @on('change', '#image-loader')
  private async handleImageLoad(event) {
    const imgs = await fx(event.target.files as FileList)
      .toAsync()
      .map(readFile)
      .toArray()
      .then((images) => images.map((src, index) => new ProductImage({ id: index, src, alt: 'product image' })));

    this.image_preview.addChild(imgs);
  }
}
