import { html, Page } from 'rune-ts';
import type { RenderHandlerType } from '../../../../../packages/types/renderHandlerType';
import { type LayoutData, MetaView } from '@rune-ts/server';
import { ProductImageEditorTemplate } from '../../templates/products';
export class MainPage extends Page<object> {
  private imageEditor = new ProductImageEditorTemplate();

  override template() {
    return html` <div class="container vertical">${this.imageEditor}</div> `;
  }
}

export const MainRoute = {
  '/': MainPage,
};

export const mainRenderHandler: RenderHandlerType<typeof MainPage> = (createCurrentPage) => {
  return (req, res) => {
    const layoutData: LayoutData = {
      ...res.locals.layoutData,
    };

    res.send(new MetaView(createCurrentPage({}, { is_mobile: false }), layoutData).toHtml());
  };
};
