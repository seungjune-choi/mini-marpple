import { html, View, type Html } from 'rune-ts';
import type { Product } from '../../model';
import type { RenderHandlerType } from '../../../../../packages/types/renderHandlerType';
import { MetaView, type LayoutData } from '@rune-ts/server';
import { ProductImageEditor, ProductMetadataEditor } from '../../templates/products';
import { fx } from '@fxts/core';
import { Button } from '../../components/button';
import { fileToFormData } from '../../utils';
import { fileRepository } from '../../repositories/files/file.repository.impl';
import { productRepository } from '../../repositories/products';
import { ProductBindModel } from '../../experimental/product.bind.model';
import { BasePage, type BasePageProps } from '../base.page';

interface ProductEditPageProps extends BasePageProps {
  categories: { id: number; name: string }[];
  product?: Product;
}

export class ProductEditPage extends BasePage<ProductEditPageProps> {
  private model = new ProductBindModel(this.data.product);
  private productMetadataEditor = new ProductMetadataEditor({
    ...this.data,
    model: this.model,
  });
  private productImageEditor = new ProductImageEditor({ model: this.model });

  protected override content(): Html | View {
    return html`
      <div class="container vertical">
        <div class="container horizontal">
          <div style="width: 100%">${this.productImageEditor}</div>
          <div
            style="display:flex; flex-direction:column; background-color:'black';width: 100%; justify-content: center; align-items: center; gap: 1rem"
          >
            ${this.productMetadataEditor} ${new Button({ name: '등록', onClick: this.handleEdit.bind(this) })}
          </div>
        </div>
      </div>
    `;
  }

  // TODO: 에러 핸들링 추가할 것
  private async handleEdit() {
    // TODO 에러 메시지 처리
    if (!this.model.validate()) {
      alert('입력값을 확인해주세요.');
      return;
    }

    // 이미지부터 업로드한 후
    await this.uploadImages();

    // 이미지 업로드가 완료되면 상품 정보를 업로드 or 수정
    const method = this.model.value.id ? 'update' : 'create';
    const res = await productRepository[method]({
      id: this.model.value.id!,
      ...this.model.value,
    });

    if (res) {
      alert('상품이 등록되었습니다.');
      window.location.href = '/admin/products';
    }
  }

  private async uploadImages() {
    const representativeIndex = this.model.value.images!.findIndex((img) => img.isRepresentative);

    return await fx(this.model.value.images!)
      .filter((img) => !!img && typeof img.src !== 'string')
      .map((img) => img.src as File)
      .map(fileToFormData('image'))
      .toAsync()
      .map((form) => fileRepository.uploadImage(form))
      .toArray()
      .then(
        (res) =>
          res.length &&
          this.model.update(
            'images',
            res.map(({ id, src }, index) => ({
              id,
              src,
              isRepresentative: index === representativeIndex,
            })),
          ),
      );
  }

  protected override onRender(): void {
    this.model.bind('name', console.log);
  }
}

export const AdminProductEditRoute = {
  '/admin/product-edit': ProductEditPage,
};

export const productEditRenderHandler: RenderHandlerType<typeof ProductEditPage> = (createPage) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (req: any, res) => {
    (async () => {
      const layoutData: LayoutData = {
        ...res.locals.layoutData,
      };

      const params = req.query;
      const product = params.id ? await productRepository.findOne(+params.id, req.headers.cookie) : undefined;

      res.send(
        new MetaView(
          createPage({
            product: product && {
              ...product,
              images: [
                {
                  id: product.representativeImage?.id,
                  src: product.representativeImage?.src,
                  isRepresentative: true,
                },
                ...product.optionalImages.map((img) => ({
                  id: img.id,
                  src: img.src,
                  isRepresentative: false,
                })),
              ],
            },
            categories: req.categories,
            user: req.user,
            role: 'admin',
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
