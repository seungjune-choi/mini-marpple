import { html, View, type Html } from 'rune-ts';
import style from './summary-table.module.scss';

export interface SummaryTableProps {
  label: string;
  value: string | number;
  bold?: boolean;
}

export class SummaryTable extends View<SummaryTableProps[]> {
  protected override template(data: SummaryTableProps[]): Html {
    return html`
      <div class="${style['order-table']}">
        ${data.map(
          (item, index) =>
            html` <div class="${style.row} ${index === data.length - 1 && style['total-row']}">
              <div class="${style.label} ${item.bold ? style.bold : ''}">${item.label}</div>
              <div class="${style.value} ${item.bold ? style.bold : ''}">${item.value}</div>
            </div>`,
        )}
      </div>
    `;
  }
}
