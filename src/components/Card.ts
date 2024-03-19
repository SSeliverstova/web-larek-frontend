import { Component } from './base/Component';
import { ICard, ICardActions, Category } from '../types';
import { ensureElement } from './../utils/utils';

const CategoryTypes: Record<string, string> = {
	'софт-скил': 'soft',
	другое: 'other',
	дополнительное: 'additional',
	'хард-скил': 'hard',
};

export class Card extends Component<ICard> {
	protected _title: HTMLElement;
	protected _image?: HTMLImageElement;
	protected _category?: HTMLElement | null;
	protected _button?: HTMLButtonElement | null;
	protected _price: HTMLElement | null;
	protected _text?: HTMLElement | null;
	protected _index?: HTMLElement | null;

	constructor(container: HTMLElement, actions?: ICardActions) {
		super(container);

		this._title = ensureElement<HTMLElement>(`.card__title`, container);
		this._image = container.querySelector(`.card__image`);
		this._button = container.querySelector(`.card__button`);
		this._category = container.querySelector(`.card__category`);
		this._price = container.querySelector(`.card__price`);
		this._text = container.querySelector(`.card__text`);
		this._index = container.querySelector(`.basket__item-index`);

		if (actions?.onClick) {
			if (this._button) {
				this._button.addEventListener('click', actions.onClick);
			} else {
				container.addEventListener('click', actions.onClick);
			}
		}
	}

	set id(value: string) {
		this.container.dataset.id = value;
	}

	get id(): string {
		return this.container.dataset.id || '';
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	get title(): string {
		return this._title.textContent || '';
	}

	set image(value: string) {
		this.setImage(this._image, value, this.title);
	}

	set selected(value: boolean) {
		if (!this._button.disabled) {
			this._button.disabled = value;
		}
	}

	set price(value: number | null) {
		if (value !== null) {
			this._price.textContent = String(value) + ' синапсов';
		} else {
			this._price.textContent = 'Бесценно';
			if (this._button) {
				this._button.disabled = true;
			}
		}
	}

	set description(value: string) {
		this.setText(this._text, value);
	}

	get description(): string {
		return this._text.textContent || '';
	}

	set category(value: Category) {
		this.setText(this._category, value);
		this._category.classList.add(`card__category_${CategoryTypes[value]}`);
	}

	set index(value: number) {
		this._index.textContent = String(value);
	}
}
