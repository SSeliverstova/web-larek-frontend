//типы категорий товаров
export type Category = 'другое' | 'софт-скил' | 'дополнительное' | 'кнопка' | 'хард-скил';

//интерфейс карточки товара
export interface ICard {
    //id с сервера
    id: string;
    //категория товара - используется на главной странице Page и при просмотре карточки
    category: Category;
    //наименование товара - используется на главной странице Page, при просмотре карточки и в корзине
    name: string;
    //описание товара - используется на при просмотре карточки
    description: string;
    //картинка товара - используется на главной странице Page и при просмотре карточки
    image: string;
    //ценв товара - используется на главной странице Page, при просмотре карточки и в корзине
    price: number | null;
    //находится ли товар в корзине
    selected: boolean;
}

//галерея товаров (список всех карточек с главной страницы)
export interface IGallery {
    cards: ICard[];
}

//состояние приложения
export interface IAppState {
    //список товаров
    catalog: IGallery;
    //корзина
    basket: string[];
    //заказ
    order: IOrder | null;
}

//способы оплаты
export type Payment = 'Онлайн' | 'При получении';

//модальное окно для оформления доставки
export interface IDeliveryForm {
  //адрес
  address: string;
  //способ оплаты
  payment: Payment;
}

//модальное окно "контакты"
export interface IContactsForm {
    //электронная почта
    email: string;
    //телефон
    phone: string;
}

//заказ
export interface IOrder extends IDeliveryForm, IContactsForm {
  //список товаров
  items: ICard[];
  //общая сумма заказа
  total: number;
}

//любое модальное окно
export interface IModal {
  //содержимое
  content: HTMLElement;
  //ошибки для форм ввода
  errors?: string[];
  //валидность формы для форм ввода
  valid?:boolean;
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

//просмотр выбранного товара
export interface IViewProduct {
  //выбранный товар
  product: HTMLElement;
}

//корзина
export interface IBasket {
  //массив карточек товаров
  list: HTMLElement[];
  //стоимость заказа
  price: number;
}

//валидация форм
export type FormErrors = Partial<Record<keyof IOrder, string>>;
export interface IFormValidator {
  formErrors: FormErrors;
}

//успешное оформление заказа
export interface ISuccess {
  //кол-во списанных коинов
  count: number;
}
