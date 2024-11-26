import { html, on, View, type Html } from 'rune-ts';
import style from './side-bar.module.scss';
import type { TargetUser } from '../../model';

type Role = 'admin' | 'user';
export interface SideBarProps {
  user: TargetUser | null;
  categories: { id: number; name: string }[];
  role: Role;
  roleConfig: {
    [key in Role]: {
      rootPath: string;
      baseFilterPath: string;
    };
  };
}

export class SideBar extends View<SideBarProps> {
  private config = this.data.roleConfig[this.data.role];
  protected override template(): Html {
    return html`
      <div class="${style.sidebar} ${style.active}">
        <button id="toggleButton" class="${style['toggle-button']}">☰</button>
        <nav class="${style.menu}">
          <!-- Navigation menu inside the sidebar -->
          <ul>
            <li><a href=${this.config.rootPath}>All</a></li>
            ${this.categoryMenu()}
          </ul>
        </nav>
        ${this.adminMenu()}
      </div>
    `;
  }

  private categoryMenu() {
    return html`
      ${this.data.categories.map(
        (category) => html`
          <li>
            <a href="${this.config.baseFilterPath}=${category.id}">${category.name}</a>
          </li>
        `,
      )}
    `;
  }

  private adminMenu() {
    console.log('isAdmin', this.isAdmin());
    if (!this.isAdmin()) {
      return '';
    }

    return html`
      <div class="${style['bottom-menu']}">
        <a href="/admin/products">Edit product</a>
      </div>
    `;
  }

  private isAdmin() {
    return !!this.data.user?.isAdmin;
  }

  @on('click', 'li')
  private handleCategoryClick(event: Event) {
    const target = event.target as HTMLElement;
    const link = target.querySelector('a')!;
    window.location.href = link.href;
  }

  rerender(props: SideBarProps) {
    this.data.user = props.user;
    this.data.categories = props.categories;
    this.data.role = props.role;
    this.data.roleConfig = props.roleConfig;
    console.log('rerender', this.data);
    this.redraw();
  }
}
