/* eslint-disable @typescript-eslint/await-thenable */
import { html, Page, type Html } from 'rune-ts';
import type { Product } from '../../model';
import type { RenderHandlerType } from '../../../../../packages/types/renderHandlerType';
import { MetaView, type LayoutData } from '@rune-ts/server';
import { baseClient } from '../../web-client';
import { ProductMetadataEditor } from '../../templates/products/product-metadata.editor';
import { ProductImageEditor } from '../../templates/products';
import { fx } from '@fxts/core';
import { Button } from '../../components/button';
import { fileToFormData } from '../../utils';
import { fileRepository } from '../../repositories/files/file.repository.impl';
import { productRepository } from '../../repositories/products';

interface ProductEditPageProps {
  categories: { id: number; name: string }[];
  product?: Product;
}

export class ProductEditPage extends Page<ProductEditPageProps> {
  private productMetadataEditor = new ProductMetadataEditor({
    categories: this.data.categories,
    product: this.data.product,
  });
  private productImageEditor = new ProductImageEditor();

  protected override template(): Html {
    return html`
      <div class="container horizontal">
        <div style="width: 100%">${this.productImageEditor}</div>
        <div
          style="display:flex; flex-direction:column; background-color:'black';width: 100%; justify-content: center; align-items: center; gap: 1rem"
        >
          ${this.productMetadataEditor} ${new Button({ name: '등록', onClick: this.handleClick.bind(this) })}
        </div>
      </div>
    `;
  }

  private async handleClick() {
    if (!this.productMetadataEditor.validate()) {
      alert('입력값을 확인해주세요.');
      return;
    }

    // 이미지부터 업로드한 후
    const images = await this.uploadImages();

    // 이미지 업로드가 완료되면 상품 정보를 업로드
    const res = await productRepository.create({ ...this.productMetadataEditor.value, images });
    if (res) {
      alert('상품이 등록되었습니다.');
      window.location.href = '/';
    }
  }

  private async uploadImages() {
    const { images, representativeIndex } = this.productImageEditor.value;

    return await fx(images)
      .filter((img) => !!img)
      .map(fileToFormData('image'))
      .toAsync()
      .map((form) => fileRepository.uploadImage(form))
      .toArray()
      .then((res) => res.map(({ id }, index) => ({ id, isRepresentative: index === representativeIndex })));
  }
}

export const ProductEditRoute = {
  '/product-edit': ProductEditPage,
};

export const productEditRenderHandler: RenderHandlerType<typeof ProductEditPage> = (createPage) => {
  return (req, res) => {
    (async () => {
      const layoutData: LayoutData = {
        ...res.locals.layoutData,
      };

      const params = req.query;

      // TODO: repository로 분리...
      const categories = await baseClient
        .get('/categories/v1')
        .then((res) => res.data)
        .then((data) => data.data)
        .then((data) => data.map((category) => ({ id: category.id, name: category.name })));

      res.send(new MetaView(createPage({ categories }), layoutData).toHtml());
    })().catch((error) => {
      console.error(error);
      res.status(500).send('Internal Server error');
    });
  };
};
