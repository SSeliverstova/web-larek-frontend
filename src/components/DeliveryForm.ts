import { Form } from './common/Form';
import { IDeliveryForm } from '../types';
import { IEvents } from './base/events';

export class DeliveryForm extends Form<IDeliveryForm> {
	protected _card: HTMLButtonElement;
	protected _cash: HTMLButtonElement;
	protected _button: HTMLElement;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		this._card = this.container.elements.namedItem('card') as HTMLButtonElement;
		this._cash = this.container.elements.namedItem('cash') as HTMLButtonElement;
		this._button = this.container.querySelector('.order__button');

		if (this._card) {
			this._card.addEventListener('click', () => {
				this._card.classList.add('button_alt-active');
				this._cash.classList.remove('button_alt-active');
				this.onInputChange('payment', 'card');
			});
		}

		if (this._cash) {
			this._cash.addEventListener('click', () => {
				this._cash.classList.add('button_alt-active');
				this._card.classList.remove('button_alt-active');
				this.onInputChange('payment', 'cash');
			});
		}
	}

	set payment(value: string) {
		if (this._cash.classList.contains('button_alt-active')) {
			this._cash.value = value;
		} else {
			if (this._card.classList.contains('button_alt-active')) {
				this._card.value = value;
			}
		}
	}

	set address(value: string) {
		(this.container.elements.namedItem('address') as HTMLInputElement).value =
			value;
	}
}
