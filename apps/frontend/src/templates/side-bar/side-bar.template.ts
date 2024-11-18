import { html, type Html } from 'rune-ts';
import { Box } from '../../components';
import style from './side-bar.module.scss';

export class SideBar extends Box {
  protected override template(): Html {
    return html`
      <div class="${style.sidebar} ${style.active}">
        <button id="toggleButton" class="${style['toggle-button']}">☰</button>
        <nav class="${style.menu}">
          <!-- Navigation menu inside the sidebar -->
          <ul>
            <li><a href="#">Home</a></li>
            <li><a href="#">About</a></li>
            <li><a href="#">Services</a></li>
            <li><a href="#">Contact</a></li>
          </ul>
        </nav>
      </div>
    `;
  }
}
