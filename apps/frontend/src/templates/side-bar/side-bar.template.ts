import { html, View, type Html } from 'rune-ts';
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
            <li><a href="/">Total</a></li>
            ${this.data.categories.map(
              (category) => html`
                <li>
                  <a href="/products?categoryId=${category.id}">${category.name}</a>
                </li>
              `,
            )}
          </ul>
        </nav>
        <div class="${style['bottom-menu']}"><h4>개발중</h4></div>
      </div>
    `;
  }
}
