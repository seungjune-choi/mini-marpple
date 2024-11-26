import { html, View, type Html } from 'rune-ts';
import { Box } from '../box';
import { concat, pipe, toArray } from '@fxts/core';

export interface ListViewProps<T> {
  items: T[];
}

export interface ListView<T, P extends ListViewProps<T>> extends View<P> {
  rerender(items: T[]): void;
}

export interface CursorPaginationContainerProps<T> {
  listView: ListView<T, ListViewProps<T>>;
  cursor: number;
  next(
    args: {
      cursor?: number;
    } & Record<string, unknown>,
  ): Promise<{ items: T[]; cursor: number }>;
}

export class CursorPaginationContainer<T> extends Box {
  constructor(private readonly props: CursorPaginationContainerProps<T>) {
    super();
  }

  protected override template(): Html {
    return html`
      <div>
        ${this.props.listView}
        <div id="sentinel"></div>
      </div>
    `;
  }

  protected override onRender(): void {
    const target = this.element().querySelector('#sentinel')!;

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    const observer = new IntersectionObserver(async (entries) => {
      if (entries[0].isIntersecting) {
        const { cursor } = this.props;
        if (cursor) {
          const nextData = await this.props.next({ cursor });
          this.props.listView.rerender(pipe(nextData.items, concat(this.props.listView.data.items), toArray));
          this.props.cursor = nextData.cursor;
        }
      }
    });

    observer.observe(target);
  }
}
