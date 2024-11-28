import { html, View, type Html } from 'rune-ts';
import { Box } from '../box';
import { concat, pipe, toArray } from '@fxts/core';

export interface ListViewProps<T> {
  items: T[];
}

/**
 * @description
 * - `rerender` 메서드를 통해 새로운 아이템 리스트를 받아서 재렌더링할 수 있는 인터페이스
 * - 인터페이스를 사용하여 확장성을 높이고 상속보다는 조합을 사용하도록 유도
 * - rerender가 아닌 append, prepend 등의 메서드를 사용하여 다양한 방식으로 데이터를 추가할 수 있도록 유도
 */
export interface ListView<T, P extends ListViewProps<T>> extends View<P> {
  rerender(items: T[]): void;
}

export interface CursorPaginationContainerProps<T> {
  /**
   * - 리스트 뷰
   */
  listView: ListView<T, ListViewProps<T>>;

  /**
   * - 현재 데이터의 마지막 cursor
   */
  cursor: number;

  /**
   * - 다음 데이터를 가져오는 함수
   */
  next(
    args: {
      cursor?: number;
    } & Record<string, unknown>,
  ): Promise<{ items: T[]; cursor: number }>;
}

/**
 * @description
 * - list view와 다음 데이터를 가져오는 함수를 받아서 cursor pagination 기능을 구현하는 컨테이너
 * - IntersectionObserver를 사용하여 스크롤 이벤트를 감지하고, cursor를 이용하여 다음 데이터를 불러옴
 * - 현재는 현재 데이터에 다음 데이터를 concat하는 방식으로만 구현되어 있음
 */
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
