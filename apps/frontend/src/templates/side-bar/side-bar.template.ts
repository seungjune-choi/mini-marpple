import { html, on, View, type Html } from 'rune-ts';
import style from './side-bar.module.scss';
export interface SideBarProps {
  categories: { id: string; name: string }[];
}

export class SideBar extends View<SideBarProps> {
  protected override template(): Html {
    return html`
      <div class="${style.sidebar} ${style.active}">
        <button id="toggleButton" class="${style['toggle-button']}">☰</button>
        <nav class="${style.menu}">
          <!-- Navigation menu inside the sidebar -->
          <ul>
            <li><a href="/">All</a></li>
            ${this.data.categories.map(
              (category) => html`
                <li>
                  <a href="/products?categoryId=${category.id}">${category.name}</a>
                </li>
              `,
            )}
          </ul>
        </nav>
        <div class="${style['bottom-menu']}">
          <a href="/admin/products">Edit product</a>
        </div>
      </div>
    `;
  }

  @on('click', 'li')
  private handleCategoryClick(event: Event) {
    const target = event.target as HTMLElement;
    const link = target.querySelector('a')!;
    window.location.href = link.href;
  }
}
