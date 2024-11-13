import { html, on, Page } from 'rune-ts';
import type { RenderHandlerType } from '../../../../../packages/types/renderHandlerType';
import { type LayoutData, MetaView } from '@rune-ts/server';
import { Input } from '../../components/input';
import { Button } from '../../components/button/button.component';
import type { IUserRepository, SignInRequest, SignInResponse } from '../../repositories/users';

// const tempImage =
//   'https://images.pexels.com/photos/378570/pexels-photo-378570.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2';

class UserRepository implements IUserRepository {
  signIn(request: SignInRequest): Promise<SignInResponse> {
    return fetch('http://localhost:3000/api/v1/users/sign-in', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    }).then((res) => res.json());
  }
}

export class MainPage extends Page<object> {
  private _userRepository: IUserRepository = new UserRepository();

  private emailInput = new Input({
    name: 'email',
    required: true,
    label: 'email',
    type: 'email',
    validate: (value) => {
      return value.includes('@');
    },
  });
  private readonly passwordInput = new Input({ name: 'password', required: true, label: '비밀번호', type: 'password' });
  private readonly button = new Button({ id: 'submit', name: '생성하기', type: 'submit' });

  override template() {
    return html` <div>${this.emailInput}${this.passwordInput}${this.button}</div>`;
  }

  @on('click', '#submit')
  private _handleSubmit(e) {
    console.log(e);
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
