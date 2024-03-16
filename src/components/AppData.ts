import { IEvents } from "./base/events";
import { IAppState, ICard, IOrder, FormErrors, Category} from "../types";
import { Model } from "./base/Model";

export class Card extends Model<ICard> {
  id: string;
  category: Category;
  name: string;
  description: string;
  image: string;
  price: number | null;
}
//Класс, который отвечает за хранение данных
export class AppState extends Model<IAppState> {
  
  catalog: ICard[];

  basket: ICard[] = [];

  order: IOrder = {
    address: '',
    payment: null,
    email: '',
    phone: '',
    items: [],
    total: null,
  };

  formErrors: FormErrors = {};

	protected _count: number = 0;
	protected event: IEvents;

  setGallery(items: ICard[]): void {
    this.catalog = items.map(item => new Card(item, this.events));
    this.emitChanges('items:changed', { catalog: this.catalog });
}

validateContacts() {
  const errors: typeof this.formErrors = {};
  if (!this.order.email) {
    errors.email = 'Необходимо указать email';
  }
  if (!this.order.phone) {
    errors.phone = 'Необходимо указать телефон';
  }
  this.formErrors = errors;
  this.events.emit('contactsFormErrors:change', this.formErrors);
  return Object.keys(errors).length === 0;
}
  //метод для получения массива товароы для стартовой страницы
  //get gallery() {
    //возвращает массив карточек с сервера
  //}

  //метод для добавления товара в корзину
	add() {
    //увеличивает значение счетчика корзины на 1
		this._count += 1;
    //запускает событие для изменения значения счетчика
    this.event.emit('count:changed')
    //добавляет в массив каточек корзины выбранную карточку
	}

  //метод для удаления товара из корзины
	remove() {
    //уменьшает значение счетчика корзины на 1
		this._count -= 1;
    //запускает событие для изменения значения счетчика
    this.event.emit('count:changed')
    //удаляет из массива каточек корзины выбранную карточку
	}

  //метод для получения значения счетчика корзины (кол-ва товаров)
	get count() {
		return this._count;
	}

  //метод для получения суммы заказа в корзине
	//get totalPrice() {
    //возвращает сумму стоимостей всех добвленных товаров в массив корзины
	//}

  //метод для добавления значений id товаров, email, phone, address, payment в заказ
	//set dataBuyer() {
    //добавляет id товаров из корзины в заказ
    //добавляет данные пользователя из форм ввода в заказ
//	}

  //метод для очистки корзины
	resetBasket() {
    //очищает массив карточек товаров в корзине после завершения заказа
    //сбрасывает на 0 сумму заказа
    //сбрасывает значение счетчика корзины на 0
	}

  //метод для очистки данных о пользователе в заказе
	resetOrder() {
    //очищает все поля заказа
	}
  setOrderField(field: keyof IOrder, value: string) {
    this.order[field] = value;

    if (this.validateOrder()) {
        this.events.emit('order:ready', this.order);
    }
}
  validateOrder() {
    const errors: typeof this.formErrors = {};
    if (!this.order.email) {
        errors.email = 'Необходимо указать email';
    }
    if (!this.order.phone) {
        errors.phone = 'Необходимо указать телефон';
    }
    this.formErrors = errors;
    this.events.emit('formErrors:change', this.formErrors);
    return Object.keys(errors).length === 0;

}

}

  //Кнопка перехода к следующему шагу становится доступна только после выполнения действий на текущей странице (выбора товара, способа оплаты, заполнения данных о покупателе)
  //если адрес доставки не введён, появляется сообщение об ошибке
  //если одно из полей не заполнено, появляется сообщение об ошибке