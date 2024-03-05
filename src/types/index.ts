//типы категорий товаров
export type ICategory = 'другое' | 'софт-скил' | 'дополнительное' | 'кнопка' | 'хард-скил';

//интерфейс карточки товара
export interface ICard {
    //id с сервера
    id: string;
    //категория товара - используется на главной странице Page и при просмотре карточки
    category: ICategory;
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
export type IPayment = 'Онлайн' | 'При получении';

//форма оформления заказа
export interface IOrderForm {
  //электронная почта
  email: string;
  //телефон
  phone: string;
  //адрес
  address: string;
  //способ оплаты
  payment: IPayment;
}

//заказ
export interface IOrder extends IOrderForm {
  //список товаров
  items: ICard[];
  //общая сумма заказа
  total: number;
}

