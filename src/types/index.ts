//типы категорий товаров
export type Category =
	| 'другое'
	| 'софт-скил'
	| 'дополнительное'
	| 'кнопка'
	| 'хард-скил';

//интерфейс товара с сервера
export interface IProduct {
	//id с сервера
	id: string;
	//категория товара - используется на главной странице Page и при просмотре карточки
	category: Category;
	//наименование товара - используется на главной странице Page, при просмотре карточки и в корзине
	title: string;
	//описание товара - используется на при просмотре карточки
	description: string;
	//картинка товара - используется на главной странице Page и при просмотре карточки
	image: string;
	//ценв товара - используется на главной странице Page, при просмотре карточки и в корзине
	price: number | null;
	//находится ли товар в корзине
	selected?: boolean;
}

//интерфейс карточки товара
export interface ICard extends IProduct {
	//находится ли товар в корзине
	selected: boolean;
	index?: number;
}

//состояние приложения
export interface IAppState {
	//список товаров
	catalog: IProduct[];
	//корзина
	basket: IProduct[];
	//заказ
	order: IOrder | null;
}

//модальное окно для оформления доставки
export interface IDeliveryForm {
	//адрес
	address: string;
	//способ оплаты
	payment: string;
}

//модальное окно "контакты"
export interface IContactsForm {
	//электронная почта
	email: string;
	//телефон
	phone: string;
}

//поля заказа
export interface IOrderForm extends IDeliveryForm, IContactsForm {}

//заказ
export interface IOrder extends IDeliveryForm, IContactsForm {
	//cписок id
	items: string[];
	//общая сумма заказа
	total: number;
}

//любое модальное окно
export interface IModal {
	//содержимое
	content: HTMLElement;
}

export interface IForm {
	//валидность формы для форм ввода
	valid: boolean;
	//ошибки для форм ввода
	errors: string[];
}

//главная страница с каталогом товаров
export interface IPage {
	//массив карточек товаров
	list: HTMLElement[];
	//количество товаров в корзине
	count: number;
	//отмена прокрутки страницы
	blocked: boolean;
}

//корзина
export interface IBasket {
	//массив карточек товаров
	items: HTMLElement[];
	//стоимость заказа
	price: number;
}

//валидация форм
export type FormErrors = Partial<Record<keyof IOrder, string>>;

//успешное оформление заказа
export interface ISuccess {
	//id с сервера
	id: string;
	//кол-во списанных коинов
	count: number;
}

//клик
export interface ISuccessActions {
	//клик
	onClick: () => void;
}

//клик
export interface ICardActions {
	//клик
	onClick: (event: MouseEvent) => void;
}
