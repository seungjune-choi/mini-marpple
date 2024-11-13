import { html, View } from 'rune-ts';
import style from './image-upload.module.scss';

export class ImageUpload extends View<object> {
  override template() {
    return html`
      <div class="${style['image-upload']}">
        <label for="file-upload" class="${style['upload-label']}">
          이미지 선택
          <input type="file" id="file-upload" multiple />
        </label>
      </div>
    `;
  }

  public getFiles() {
    const fileInput = this.element().querySelector('#file-upload')! as HTMLInputElement;
    return fileInput.files;
  }

  protected override onRender() {
    this.addEventListener('change', (e) => {
      const fileInput = e.target as HTMLInputElement;
      const files = fileInput.files;
      if (!files) {
        return;
      }
    });
  }
}
