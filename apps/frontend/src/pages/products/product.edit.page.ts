/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/await-thenable */
import { html, Page, type Html } from 'rune-ts';
import type { Product } from '../../model';
import type { RenderHandlerType } from '../../../../../packages/types/renderHandlerType';
import { MetaView, type LayoutData } from '@rune-ts/server';
import { ProductMetadataEditor } from '../../templates/products/product-metadata.editor';
import { ProductImageEditor } from '../../templates/products';
import { fx } from '@fxts/core';
import { Button } from '../../components/button';
import { fileToFormData } from '../../utils';
import { fileRepository } from '../../repositories/files/file.repository.impl';
import { productRepository } from '../../repositories/products';
import { BindModel } from '../../experimental';

interface ProductEditPageProps {
  categories: { id: number; name: string }[];
  product?: Product;
}

export class ProductEditPage extends Page<ProductEditPageProps> {
  private model = BindModel.from<Partial<Product>>({
    ...this.data.product,
  });
  private productMetadataEditor = new ProductMetadataEditor({
    categories: this.data.categories,
    model: this.model,
  });
  private productImageEditor = new ProductImageEditor({ model: this.model });

  protected override template(): Html {
    return html`
      <div class="container vertical">
        <div class="container horizontal">
          <div style="width: 100%">${this.productImageEditor}</div>
          <div
            style="display:flex; flex-direction:column; background-color:'black';width: 100%; justify-content: center; align-items: center; gap: 1rem"
          >
            ${this.productMetadataEditor} ${new Button({ name: '등록', onClick: this.handleClick.bind(this) })}
          </div>
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const categories = (req as any)?.categories;

      const product = params.id ? await productRepository.findOne(+params.id, req.headers.cookie) : undefined;
      console.log({ ...product, images: [product.representativeImage, ...product.optionalImages] });
      res.send(
        new MetaView(
          createPage({
            categories,
            product: {
              ...product,
              images: [
                {
                  id: product.representativeImage?.id,
                  url: product.representativeImage?.url,
                  isRepresentative: true,
                },
                ...product.optionalImages.map((img) => ({
                  id: img.id,
                  url: img.url,
                  isRepresentative: false,
                })),
              ],
            },
          }),
          layoutData,
        ).toHtml(),
      );
    })().catch((error) => {
      console.error(error);
      res.status(500).send('Internal Server error');
    });
  };
};
