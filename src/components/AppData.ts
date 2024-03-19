import { IAppState, IProduct, IOrder, IOrderForm, FormErrors, Category} from "../types";
import { Model } from './base/Model';

export class Product extends Model<IProduct> {
  id: string;
  category: Category;
  title: string;
  description: string;
  image: string;
  price: number | null;
  selected: boolean;
}
//Класс, который отвечает за хранение данных
export class AppState extends Model<IAppState> {
  
  catalog: IProduct[];

  basket: IProduct[] = [];

  order: IOrder = {
   // id: [],
    address: '',
    payment: null,
    email: '',
    phone: '',
    items: [],
    total: null,
  };

  formErrors: FormErrors = {};

  //метод для получения массива товароы для стартовой страницы
  setGallery(items: IProduct[]): void {
    this.catalog = items.map(item => new Product(item, this.events));
    this.emitChanges('items:changed', { catalog: this.catalog });
  }

  //метод для добавления товара в корзину
	add(value : Product) {
    this.basket.push(value);
	}

  //метод для удаления товара из корзины
	remove(id : string) {
    this.basket = this.basket.filter(item => item.id !== id);
    this.setDataBuyer();
	}

  //метод для получения значения счетчика корзины (кол-ва товаров)
	get count() {
		return this.basket.length;
	}

  //метод для получения суммы заказа в корзине
	get totalPrice() {
    return this.basket.reduce((a, c) => a + c.price, 0)
	}

  //метод для добавления значений id товаров, email, phone, address, payment в заказ
	setDataBuyer() {
   // this.order.items = this.basket;
    this.order.items = this.basket.map(item => item.id);
	}
  
  //метод для очистки корзины
	resetBasket() {
    this.basket = [];
	}

  //метод для очистки данных о пользователе в заказе
	resetOrder() {
    this.order = {
      items: [],
      total: 0,
      address: '',
      email: '',
      phone: '',
      payment: ''
    };
	}

  setOrderField(field: keyof IOrderForm, value: string) {
    this.order[field] = value;

    if (this.validateContacts()) {
      this.events.emit('contacts:ready', this.order)
    }
    if (this.validateOrder()) {
      this.events.emit('order:ready', this.order);
    }
  }
  
  validateOrder() {
    const errors: typeof this.formErrors = {};
    if (!this.order.payment) {
        errors.payment = 'Необходимо указать способ оплаты';
    }
    if (!this.order.address) {
        errors.address = 'Необходимо указать адрес';
    }
    this.formErrors = errors;
    this.events.emit('orderFormErrors:change', this.formErrors);
    return Object.keys(errors).length === 0;
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

  resetSelect() {
    this.basket.forEach(item => item.selected = false)
  }
}
