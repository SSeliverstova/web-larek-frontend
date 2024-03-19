import { ISuccess, ISuccessActions } from '../types';
import { ensureElement } from '../utils/utils';
import { Component } from './base/Component';

export class Success extends Component<ISuccess> {
	protected _close: HTMLButtonElement;
	protected _count: HTMLElement;

	constructor(container: HTMLElement, actions: ISuccessActions) {
		super(container);

		this._close = ensureElement<HTMLButtonElement>(
			'.order-success__close',
			this.container
		);
		this._count = ensureElement<HTMLElement>(
			'.order-success__description',
			this.container
		);

		if (actions?.onClick) {
			if (this._close) {
				this._close.addEventListener('click', actions.onClick);
			} else {
				container.addEventListener('click', actions.onClick);
			}
		}
	}

	set count(value: number) {
		this._count.textContent = 'Списано ' + String(value) + ' синапсов';
	}
}
