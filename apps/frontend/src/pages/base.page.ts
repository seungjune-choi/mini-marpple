import { html, on, Page, View, type Html } from 'rune-ts';
import { Header, type HeaderProps } from '../templates/header';
import { SideBar, type SideBarProps } from '../templates/side-bar';
import { AfterSignInEvent } from '../templates/sign-in/sign-in.form';

export interface BasePageProps extends HeaderProps, Omit<SideBarProps, 'roleConfig'> {}

export abstract class BasePage<T extends BasePageProps> extends Page<T> {
  private sideBarProps: SideBarProps = {
    ...this.data,
    role: this.data.role,
    user: this.data.user,
    roleConfig: {
      admin: {
        rootPath: '/admin/products',
        baseFilterPath: '/admin/products?categoryId',
      },
      user: {
        rootPath: '/products',
        baseFilterPath: '/products?categoryId',
      },
    },
  };

  protected header = new Header({ ...this.data });
  protected sideBar = new SideBar(this.sideBarProps);

  protected override template() {
    return html` <div>
      ${this.header} ${this.sideBar}
      <div class="content">${this.content()}</div>
    </div>`;
  }

  protected abstract content(): Html | View;

  @on(AfterSignInEvent)
  private handleAfterSignIn(event: AfterSignInEvent) {
    this.data.user = event.detail;
    this.sideBarProps.user = event.detail;
    this.header.rerender({ ...this.data });
    this.sideBar.rerender(this.sideBarProps);
  }
}
