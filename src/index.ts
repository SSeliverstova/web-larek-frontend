import './scss/styles.scss';
import { LarekAPI } from './components/LarekApi';
import { API_URL, CDN_URL } from './utils/constants';
import { ensureElement, cloneTemplate } from './utils/utils';
import { EventEmitter } from './components/base/events';
import { Page } from './components/Page';
import { AppState, Product } from './components/AppData';
import { Modal } from './components/common/Modal';
import { Success } from './components/Success';
import { ContactsForm } from './components/ContactsForm';
import { DeliveryForm } from './components/DeliveryForm';
import { Basket } from './components/Basket';
import { Card } from './components/Card';
import { IOrderForm } from './types';
import { ApiListResponse } from './components/base/api';

const api = new LarekAPI(CDN_URL, API_URL);
const events = new EventEmitter();

// Все шаблоны
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// Модель данных приложения
const appData = new AppState({}, events);

// Глобальные контейнеры
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

// Переиспользуемые части интерфейса
const basket = new Basket(cloneTemplate(basketTemplate), events);
const contacts = new ContactsForm(cloneTemplate(contactsTemplate), events);
const order = new DeliveryForm(cloneTemplate(orderTemplate), events);
const success = new Success(cloneTemplate(successTemplate), {
	onClick: () => modal.close(),
});

// Получаем товары с сервера
api
	.getProductList()
	.then(appData.setGallery.bind(appData))
	.catch((err) => {
		console.error(err);
	});

events.on('items:changed', () => {
	page.list = appData.catalog.map((item) => {
		const cardCatalog = new Card(cloneTemplate(cardCatalogTemplate), {
			onClick: () => events.emit('card:select', item),
		});
		return cardCatalog.render({
			id: item.id,
			category: item.category,
			title: item.title,
			price: item.price,
			image: item.image,
			description: item.description,
		});
	});
});

// Открыть карточку
events.on('card:select', (item: Product) => {
	events.emit('modal:open');
	const cardPreview = new Card(cloneTemplate(cardPreviewTemplate), {
		onClick: () => {
			events.emit('item:addBasket', item);
		},
	});
	modal.render({
		content: cardPreview.render({
			id: item.id,
			title: item.title,
			image: item.image,
			category: item.category,
			description: item.description,
			price: item.price,
			selected: item.selected,
		}),
	});
});

// Добавить товар в корзину
events.on('item:addBasket', (item: Product) => {
	item.selected = true;
	appData.add(item);
	page.updateCount = appData.count;
	appData.setDataBuyer();
	modal.close();
});

// Перейти в корзину
events.on('basket:open', () => {
	events.emit('modal:open');
	const cardsBasket = appData.basket.map((item, index) => {
		const cardBasket = new Card(cloneTemplate(cardBasketTemplate), {
			onClick: () => {
				events.emit('item:remove', item);
			},
		});
		return cardBasket.render({
			title: item.title,
			price: item.price,
			index: index + 1,
		});
	});
	modal.render({
		content: basket.render({
			items: cardsBasket,
			price: appData.totalPrice,
		}),
	});
	console.log(appData.basket.length);
	console.log(appData.basket);
	basket.disableButton(!appData.basket.length);
});

//удалить товар из корзины
events.on('item:remove', (item: Product) => {
	item.selected = false;
	appData.remove(item.id);
	page.updateCount = appData.count;
	basket.price = appData.totalPrice;
	events.emit('basket:open');
});

//оформить заказ
events.on('order:open', () => {
	modal.render({
		content: order.render({
			address: '',
			valid: false,
			errors: [],
		}),
	});
});

//ввести контакты
events.on('order:submit', () => {
	appData.order.total = appData.totalPrice;
	modal.render({
		content: contacts.render({
			email: '',
			phone: '',
			valid: false,
			errors: [],
		}),
	});
});

// Изменилось состояние валидации формы
events.on('orderFormErrors:change', (errors: Partial<IOrderForm>) => {
	const { address, payment } = errors;
	order.valid = !address && !payment;
	order.errors = Object.values({ address, payment })
		.filter((i) => !!i)
		.join('; ');
});

// Изменилось состояние валидации формы
events.on('contactsFormErrors:change', (errors: Partial<IOrderForm>) => {
	const { email, phone } = errors;
	contacts.valid = !email && !phone;
	contacts.errors = Object.values({ email, phone })
		.filter((i) => !!i)
		.join('; ');
});

// Изменилось одно из полей заказа
events.on(
	'order:change',
	(data: { field: keyof IOrderForm; value: string }) => {
		appData.setOrderField(data.field, data.value);
	}
);

// Отправлена форма заказа
events.on('contacts:submit', () => {
	api
		.post('/order', appData.order)
		.then((result) => {
			modal.close();
			events.emit('order:success', result);
			page.updateCount = 0;
			appData.resetSelect();
			appData.resetBasket();
			appData.resetOrder();
		})
		.catch((err) => {
			console.error(err);
		});
});

events.on('order:success', (result: ApiListResponse<string>) => {
	modal.render({
		content: success.render({
			count: result.total,
		}),
	});
});

// Блокируем прокрутку страницы если открыта модалка
events.on('modal:open', () => {
	page.blocked = true;
});

// ... и разблокируем
events.on('modal:close', () => {
	page.blocked = false;
});
