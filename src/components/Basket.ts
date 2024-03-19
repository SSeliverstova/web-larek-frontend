import {Component} from  './base/Component';
import {createElement, ensureElement} from './../utils/utils';
import {EventEmitter} from './base/events';
import {IBasket} from '../types/index';

export class Basket extends Component<IBasket> {
    protected _list: HTMLElement;
    protected _total: HTMLElement | null;
    protected _button: HTMLElement | null;

    constructor(container: HTMLElement, protected events: EventEmitter) {
        super(container);

        this._list = ensureElement<HTMLElement>('.basket__list', this.container);
        this._total = this.container.querySelector('.basket__price');
        this._button = this.container.querySelector('.basket__button');

        if (this._button) {
            this._button.addEventListener('click', () => {
                events.emit('order:open');
            });
        }

        this.items = [];
    }

    set items(items: HTMLElement[]) {
        if (items.length) {
            this._list.replaceChildren(...items);
        } else {
            this._list.replaceChildren(createElement<HTMLParagraphElement>('p', {
                textContent: 'Корзина пуста'
            }));
        }
    }

    set price(value: number) {
        this._total.textContent = String(value) + ' синапсов';
      }

   
}