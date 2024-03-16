import { IPage } from "../types";
import { Component } from "./base/Component";
import { ensureElement } from "../utils/utils";
import { IEvents } from "./base/events";

export class Page extends Component<IPage> {
  protected _count: HTMLElement;
    protected _catalog: HTMLElement;
    protected _wrapper: HTMLElement;
    protected _basket: HTMLElement;


    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this._count = ensureElement<HTMLElement>('.header__basket-counter');
        this._catalog = ensureElement<HTMLElement>('.gallery');
        this._wrapper = ensureElement<HTMLElement>('.page__wrapper');
        this._basket = ensureElement<HTMLElement>('.header__basket');

        this._basket.addEventListener('click', () => {
            this.events.emit('bids:open');
        });
    }

    set updateCount(value: number) {
        this.setText(this._count, String(value));
    }

    set list(items: HTMLElement[]) {
        this._catalog.replaceChildren(...items);
    }

    set blocked(value: boolean) {
        if (value) {
            this._wrapper.classList.add('page__wrapper_locked');
        } else {
            this._wrapper.classList.remove('page__wrapper_locked');
        }
    }
}
  //при нажатии на карточку товара открывается модальное окно с детальной информацией о товаре;
  //при нажатии на иконку корзины, открывается корзина.
  //имеет метод updateCount для обновления счетчика корзины
  //имеет метод blocked для отмены прокрутки страницы
