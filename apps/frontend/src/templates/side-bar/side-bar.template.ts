import { html, on, View, type Html } from 'rune-ts';
import style from './side-bar.module.scss';
import type { TargetUser } from '../../model';
import { AfterSignInEvent } from '../sign-in/sign-in.form';

export interface SideBarProps {
  user: TargetUser | null;
  categories: { id: number; name: string }[];
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
        ${this.data.user ? this.adminMenu() : ''}
      </div>
    `;
  }

  private adminMenu() {
    return html`
      <div class="${style['bottom-menu']}">
        <a href="/admin/products">Edit product</a>
      </div>
    `;
  }

  @on('click', 'li')
  private handleCategoryClick(event: Event) {
    const target = event.target as HTMLElement;
    const link = target.querySelector('a')!;
    window.location.href = link.href;
  }

  @on(AfterSignInEvent)
  handleAfterSignIn(event: AfterSignInEvent) {
    console.log('side-bar', event.detail);
    this.data.user = event.detail;
    this.redraw();
  }

  rerender(props: SideBarProps) {
    this.data.user = props.user;
    this.data.categories = props.categories;
    this.redraw();
  }
}
