import { html, Page } from 'rune-ts';
import type { RenderHandlerType } from '../../../../../packages/types/renderHandlerType';
import { type LayoutData, MetaView } from '@rune-ts/server';

export class SubPage extends Page<object> {
  override template() {
    return html`
      <div>
        <h1>Sub Page</h1>
      </div>
    `;
  }
}

export const SubRoute = { '/sub' : SubPage, };

export const subRenderHandler: RenderHandlerType<typeof SubPage> = (createCurrentPage) => {
  return (_, res) => {
    const layout : LayoutData = { ...res.locals.layoutData };

    res.send(new MetaView(createCurrentPage({}, { is_mobile: false}), layout).toHtml());
  };
};