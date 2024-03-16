# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Базовый код
```TypeScript
//Базовый компонент, имеет все базовые свойства и методы
abstract class Component<T> {
    protected constructor(protected readonly container: HTMLElement)

    // Переключить класс
    toggleClass(element: HTMLElement, className: string, force?: boolean)

    // Установить текстовое содержимое
    protected setText(element: HTMLElement, value: unknown)

    // Сменить статус блокировки
    setDisabled(element: HTMLElement, state: boolean)

    // Скрыть
    protected setHidden(element: HTMLElement)

    // Показать
    protected setVisible(element: HTMLElement)

    // Установить изображение с алтернативным текстом
    protected setImage(element: HTMLImageElement, src: string, alt?: string)

    // Вернуть корневой DOM-элемент
    render(data?: Partial<T>): HTMLElement
}

//API, реализует взаимодействие с бэкендом
class Api {
    //базовый URL
    readonly baseUrl: string;
    //опции
    protected options: RequestInit;

    constructor(baseUrl: string, options: RequestInit = {})

    //возвращает промис с данными
    protected handleResponse(response: Response): Promise<object>

    //get запрос
    get(uri: string)

    //post запрос
    post(uri: string, data: object, method: ApiPostMethods = 'POST')
}

//Обработчик событий
class EventEmitter implements IEvents {
    _events: Map<EventName, Set<Subscriber>>;

    constructor()

    //Установить обработчик на событие
    on<T extends object>(eventName: EventName, callback: (event: T) => void) 

    //Снять обработчик с события
    off(eventName: EventName, callback: Subscriber)

    //Инициировать событие с данными
    emit<T extends object>(eventName: string, data?: T)

    //Слушать все события
    onAll(callback: (event: EmitterEvent) => void)

    //Сбросить все обработчики
    offAll()

    //Сделать коллбек триггер, генерирующий событие при вызове
    trigger<T extends object>(eventName: string, context?: Partial<T>)
}
```
## Описание данных
```TypeScript
//типы категорий товаров
type Category = 'другое' | 'софт-скил' | 'дополнительное' | 'кнопка' | 'хард-скил';

//интерфейс карточки товара
interface ICard {
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
interface IGallery {
    cards: ICard[];
}

//состояние приложения
interface IAppState {
    //список товаров
    catalog: IGallery;
    //корзина
    basket: string[];
    //заказ
    order: IOrder | null;
}

//способы оплаты
type Payment = 'Онлайн' | 'При получении';

//модальное окно для оформления доставки
interface IDeliveryForm {
  //адрес
  address: string;
  //способ оплаты
  payment: Payment;
}

//модальное окно "контакты"
interface IContactsForm {
    //электронная почта
    email: string;
    //телефон
    phone: string;
}

//заказ
interface IOrder extends IDeliveryForm, IContactsForm {
  //список товаров
  items: ICard[];
  //общая сумма заказа
  total: number;
}

//любое модальное окно
interface IModal {
  //содержимое
  content: HTMLElement;
  //ошибки для форм ввода
  errors?: string[];
  //валидность формы для форм ввода
  valid?:boolean;
}

//главная страница с каталогом товаров
interface IPage {
  //массив карточек товаров
  list: HTMLElement[];
  //количество товаров в корзине
  count: number;
  //отмена прокрутки страницы
  blocked: boolean;
}

//просмотр выбранного товара
interface IViewProduct {
  //выбранный товар
  product: HTMLElement;
}

//корзина
interface IBasket {
  //массив карточек товаров
  list: HTMLElement[];
  //стоимость заказа
  price: number;
}

//валидация форм
type FormErrors = Partial<Record<keyof IOrder, string>>;
interface IFormValidator {
  formErrors: FormErrors;
}

//успешное оформление заказа
interface ISuccess {
  //кол-во списанных коинов
  count: number;
}
```
## Модели данных
```TypeScript
//Класс, который отвечает за хранение данных
class AppState implements IAppState {
	protected _count: number = 0;
	protected event: IEvents;

  //принимает в конструктор экземпляр брокера событий
	constructor(event: IEvents)

  //метод для получения массива товароы для стартовой страницы
  get gallery()

  //метод для добавления товара в корзину
	add()

  //метод для удаления товара из корзины
	remove()

  //метод для получения значения счетчика корзины (кол-ва товаров)
	get count()

  //метод для получения суммы заказа в корзине
	get totalPrice()

  //метод для добавления значений id товаров, email, phone, address, payment в заказ
	set dataBuyer()

  //метод для очистки корзины
	resetBasket()

  //метод для очистки данных о пользователе в заказе
	resetOrder()
}
```
## Компоненты представления
```TypeScript
//Класс для любых модальных окон, наследует Component
class Modal extends Component<IModal> {
  //закрытие по клику вне модального окна
  //закрытие по крестику
}

//Главная страница, содержит каталог товаров, наследует Component
class Page extends Component<IPage> {
  //при нажатии на карточку товара открывается модальное окно с детальной информацией о товаре;
  //при нажатии на иконку корзины, открывается корзина.
  //имеет метод updateCount для обновления счетчика корзины
  //имеет метод blocked для отмены прокрутки страницы
}

//Карточка товара, наследует Component
class Card extends Component<ICard> {
  //имеет методы для получения и передачи атрибутов карточки товара (картинка, наименование, описание, стоимость, признак выбран ли товар)
}

//Представление для просмотра выбранного товара, наследует Component
class ViewProduct extends Component<IViewProduct> {
  //при нажатии на сабмит добавляем в корзину значок +1 и меняем содержимое корзины и сумму покупки
  //бесценный товар купить нельзя. деактивируем кнопку
  //закрываем карточку товара
}

//Представление для просмотра корзины, наследует Component
class Basket extends Component<IBasket> {
  //при нажатии на иконку корзины удаляем товар из корзины
  //при нажатии на сабмит закрываем форму и переключаемся на orderingFirst
  //имеет метод updateTotalPrice для обновления суммы заказа
  //имеет метод updateDataSet для обновления массива карточек
}

//Представление для оформления заказа №1, наследует Component
class DeliveryForm extends Component<IDeliveryForm> {
  //при клике на один из вариатов способа оплаты, второй неактивен
  //при нажатии на сабмит закрываем форму и переключаемся на orderingSecond
}

//Представление для оформления заказа №2, наследует Component
class ContactsForm extends Component<IContactsForm> {
  //при нажатии на сабмит закрываем форму, очищаем заказ и переключаемся на Success
}

//Класс для валидации форм, наследует Component
class FormValidator extends Component<IFormValidator> {
  //Кнопка перехода к следующему шагу становится доступна только после выполнения действий на текущей странице (выбора товара, способа оплаты, заполнения данных о покупателе)
  //если адрес доставки не введён, появляется сообщение об ошибке
  //если одно из полей не заполнено, появляется сообщение об ошибке
}

//Класс для оповещения об успешном оформлении заказа, наследует Component
class Success extends Component<ISuccess> {
  //выводится сумма оформленного заказа
  //при нажатии на сабмит закрываем форму
  //при закрытии формы любым способом обнуляем корзину
}
```
## Описание событий
```TypeScript
//Инициируется при добавлении в корзину (кнопка купить) или удалении товара из корзины (иконка корзины), изменяет список товаров в корзине
'items:changed'
//Инициируется при нажатии на карточку товара на главной странице и приводит к сохранению выбранной карточки
'card:select'
//Инициируется при изменении содержимого корзины и приводит к изменению счетчика товаров в корзине
'count:changed'
//Инициируется при изменении содержимого корзины и приводит к изменению суммы заказа
'totalPrice:changed'
//Инициируется при закрытии попапа "заказ оформлен" и приводит к удалению всех товаров из массива в корзине, обнулению суммы заказа и счетчика товаров в корзине, очистке всех полей заказа
'basket:delete'
//Инициируется при нажатии на кнопку "оформить" и сохраняет параметры заказа (id выбранных товаров, кол-во и стоимость)
'order:submit'
//Инициируется при нажатии на кнопку "далее" и сохраняет параметры заказа (способ оплаты и адрес доставки)
'address:submit'
//Инициируется при нажатии на кнопку "оплатить" и сохраняет параметры заказа (почта и телефон)
'contacts:submit'
//Инициируется при нажатии на кнопку "далее" и запускает валидацию параметров заказа (способ оплаты и адрес доставки)
'address:validation'
//Инициируется при нажатии на кнопку "оплатить" и запускает валидацию параметров заказа (почта и телефон)
'contacts:validation'
```

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```
