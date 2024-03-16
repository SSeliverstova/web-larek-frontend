import { ISuccess, ISuccessActions } from "../types";
import { ensureElement } from "../utils/utils";
import { Component } from "./base/Component";

export class Success extends Component<ISuccess> {
  protected _close: HTMLElement;

    constructor(container: HTMLElement, actions: ISuccessActions) {
        super(container);

        this._close = ensureElement<HTMLElement>('.order-success__close', this.container);

        if (actions?.onClick) {
            this._close.addEventListener('click', actions.onClick);
        }
    }
  //выводится сумма оформленного заказа
  //при нажатии на сабмит закрываем форму
  //при закрытии формы любым способом обнуляем корзину
}