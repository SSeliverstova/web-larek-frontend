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
abstract class Component<T>
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

//API, реализует взаимодействие с бэкендом
class Api
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

//Обработчик событий
class EventEmitter implements IEvents
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

```
## Описание данных
```TypeScript
//типы категорий товаров
type Category = 'другое' | 'софт-скил' | 'дополнительное' | 'кнопка' | 'хард-скил';

//интерфейс товара с сервера
interface IProduct {
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
interface ICard extends IProduct{
   //находится ли товар в корзине
  selected: boolean;
  index?: number;
}

//состояние приложения
interface IAppState {
    //список товаров
    catalog: IProduct[];
    //корзина
    basket: IProduct[];
    //заказ
    order: IOrder | null;
}

//модальное окно для оформления доставки
interface IDeliveryForm {
  //адрес
  address: string;
  //способ оплаты
  payment: string;
}

//модальное окно "контакты"
interface IContactsForm {
    //электронная почта
    email: string;
    //телефон
    phone: string;
}

//поля заказа
interface IOrderForm extends IDeliveryForm, IContactsForm {
}

//заказ
interface IOrder extends IDeliveryForm, IContactsForm {
  //cписок id
  items: string[];
  //общая сумма заказа
  total: number;
}

//любое модальное окно
interface IModal {
  //содержимое
  content: HTMLElement;
}

interface IForm {
  //валидность формы для форм ввода
  valid: boolean;
  //ошибки для форм ввода
  errors: string[];
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

//корзина
interface IBasket {
  //массив карточек товаров
  items: HTMLElement[];
  //стоимость заказа
  price: number;
}

//валидация форм (ошибки)
type FormErrors = Partial<Record<keyof IOrder, string>>;

//успешное оформление заказа
interface ISuccess {
  //id с сервера
  id: string;
  //кол-во списанных коинов
  count: number;
}

//клик успешного заказа
interface ISuccessActions {
  //клик
  onClick: () => void;
}

//клик карточки товара
interface ICardActions {
  //клик
  onClick: (event: MouseEvent) => void;
}
```
## Модели данных
```TypeScript
//Базовая модель, чтобы можно было отличить ее от простых объектов с данными
 abstract class Model<T>
    // конструктор принимает данные и обработчик событий
    constructor(data: Partial<T>, protected events: IEvents)

    // Сообщить всем что модель поменялась
    emitChanges(event: string, payload?: object)

//Класс, который отвечает за хранение данных товара
class Product extends Model<IProduct>
  id: string;
  category: Category;
  title: string;
  description: string;
  image: string;
  price: number | null;
  selected: boolean;

//Класс, который отвечает за хранение данных
class AppState extends Model<IAppState>
  
  //галерея
  catalog: IProduct[];

  //корзина
  basket: IProduct[] = [];

  //заказ
  order: IOrder = {
    address: '',
    payment: null,
    email: '',
    phone: '',
    items: [],
    total: null,
  };

  //ошибки валидации
  formErrors: FormErrors = {};

  //метод для получения массива товароы для стартовой страницы
  setGallery(items: IProduct[]): void

  //метод для добавления товара в корзину
	add(value : Product)

  //метод для удаления товара из корзины
	remove(id : string)

  //метод для получения значения счетчика корзины (кол-ва товаров)
	get count()

  //метод для получения суммы заказа в корзине
	get totalPrice()

  //метод для добавления значений id товаров в заказ
	setDataBuyer()
  
  //метод для очистки корзины
	resetBasket()

  //метод для очистки данных о пользователе в заказе
	resetOrder()

 //метод для установки значений атрибутам заказа (при успешной валидации)
  setOrderField(field: keyof IOrderForm, value: string)
  
  //валидация формы ввода адреса и спобоба оплаты
  validateOrder()

  //валидация формы ввода почты и телефона оплаты
  validateContacts()

  //элемент больше не выбран 
  resetSelect()
```
## Компоненты представления
```TypeScript
//Класс для любых модальных окон, наследует Component
class Modal extends Component<IModal>

  //внутренние элементы
  protected _closeButton: HTMLButtonElement;
  protected _content: HTMLElement;

  // конструктор принимает родительский элемент и обработчик событий
  constructor(container: HTMLElement, protected events: IEvents)

  //сеттер для содержимого
  set content(value: HTMLElement)

  //открыть
  open()

  //закрыть
  close()

  //отрисовать
  render(data: IModal): HTMLElement

//Класс для любых форм ввода, наследует Component
//все поля валидируются
class Form<T> extends Component<IForm>
    
    //внутренние элементы
    protected _submit: HTMLButtonElement;
    protected _errors: HTMLElement;

    // конструктор принимает родительский элемент и обработчик событий
    constructor(protected container: HTMLFormElement, protected events: IEvents)

    //метод для отслеживания изменений полей ввода
    protected onInputChange(field: keyof T, value: string)

    //сеттер валидности
    set valid(value: boolean)

    //сеттер ошибок
    set errors(value: string)

    //отрисовать
    render(state: Partial<T> & IForm)

//Главная страница, содержит каталог товаров, наследует Component
//при нажатии на карточку товара открывается модальное окно с детальной информацией о товаре;
//при нажатии на иконку корзины, открывается корзина.
class Page extends Component<IPage>
//внутренние элементы
  protected _count: HTMLElement;
    protected _catalog: HTMLElement;
    protected _wrapper: HTMLElement;
    protected _basket: HTMLElement;

    // конструктор принимает родительский элемент и обработчик событий
    constructor(container: HTMLElement, protected events: IEvents)

    //сеттер для обновления счетчика корзины
    set updateCount(value: number)

    //сеттер для галереи
    set list(items: HTMLElement[])

    //метод blocked для отмены прокрутки страницы
    set blocked(value: boolean)

//Карточка товара, наследует Component
//имеет методы для получения и передачи атрибутов карточки товара
//при нажатии на сабмит добавляем в корзину значок +1 и меняем содержимое корзины и сумму покупки
//бесценный товар купить нельзя. деактивируем кнопку
class Card extends Component<ICard>

    //внутренние элементы
    protected _title: HTMLElement;
    protected _image?: HTMLImageElement;
    protected _category?: HTMLElement | null;
    protected _button?: HTMLButtonElement | null;
    protected _price: HTMLElement | null;
    protected _text?: HTMLElement | null;
    protected _index?: HTMLElement | null;

    // конструктор принимает родительский элемент и обработчик событий по клику
    constructor(container: HTMLElement, actions?: ICardActions) 

    //сеттер и геттер для id
    set id(value: string)
    get id(): string
    //сеттер и геттер для наименования
    set title(value: string) 
    get title(): string
    //сеттер и геттер для описания
    set text(value: string)
    get text(): string
    //сеттер для картинки
    set image(value: string)
    //сеттер для признака выбран ли товар
    set selected(value: boolean)
    //сеттер для цены
    set price(value: number | null)
    //сеттер для категории
    set category(value: Category)
    //сеттер индекса для товара в корзине
    set index(value: number)

//Представление для просмотра корзины, наследует Component
//при нажатии на иконку корзины удаляем товар из корзины
//при нажатии на сабмит закрываем форму и переключаемся на DeliveryForm
class Basket extends Component<IBasket>
    //внутренние элементы
    protected _list: HTMLElement;
    protected _total: HTMLElement | null;
    protected _button: HTMLElement | null;

    // конструктор принимает родительский элемент и обработчик событий
    constructor(container: HTMLElement, protected events: EventEmitter)

    //сеттер товаров в корзине, устанавливает "Корзина пуста", если нет товаров в корзине
    set items(items: HTMLElement[])

    //сеттер для обновления суммы заказа
    set price(value: number)

//Представление для оформления заказа №1, наследует Form
//при клике на один из вариатов способа оплаты, второй неактивен
//при нажатии на сабмит закрываем форму и переключаемся на ContactsForm
class DeliveryForm extends Form<IDeliveryForm>
  //внутренние элементы
  protected _card: HTMLButtonElement;
  protected _cash: HTMLButtonElement;
  protected _button: HTMLElement;

  // конструктор принимает родительский элемент и обработчик событий
  constructor(container: HTMLFormElement, events: IEvents) 

  //сеттер для способа оплаты
  set payment(value: string)

  //сеттер для адреса
  set address(value: string)

//Представление для ввода контактов, наследует Form
//при нажатии на сабмит закрываем форму, очищаем заказ и переключаемся на Success
class ContactsForm extends Form<IContactsForm>

  // конструктор принимает родительский элемент и обработчик событий
  constructor(container: HTMLFormElement, events: IEvents)

//сеттер для телефона
set phone(value: string)

//сеттер для почты
set email(value: string)

//Класс для оповещения об успешном оформлении заказа, наследует Component
class Success extends Component<ISuccess>

  //внутренние элементы
  protected _close: HTMLButtonElement;
  protected _count: HTMLElement;

    // конструктор принимает родительский элемент и обработчик событий по клику
    constructor(container: HTMLElement, actions: ISuccessActions)

    //сеттер для установки общей суммы оформленного заказа
    set count(value: number)
```
## API
```TypeScript
class LarekAPI extends Api implements ILarekAPI
    readonly cdn: string;
    constructor(cdn: string, baseUrl: string, options?: RequestInit)

    //возвращает товар
    getProduct(id: string): Promise<ICard>

    //возвращает список товаров
    getProductList(): Promise<ICard[]>
```
## Описание событий
```TypeScript
//Инициируется при получении товаров с сервера и рендерит галерею
'items:changed'
//Инициируется при нажатии на карточку товара на главной странице и приводит к сохранению выбранной карточки и отрисовке окна просмотра карточки
'card:select', (item: Product)
//Инициируется при нажатии на кнопку "в корзину" и приводит к добавлению товара в массив в корзине, пересчету суммы заказа и счетчика товаров в корзине
'item:addBasket', (item: Product)
//Инициируется при изменении нажатии на иконку корзины на главной странице и приводит к отрисовке корзины и карточек товаров а корзине
'basket:open'
//Инициируется при нажатии на иконку корзины в корзине и приводит к удалению товара из массива в корзине, пересчету суммы заказа и счетчика товаров в корзине
'item:remove', (item: Product)
//Инициируется при нажатии на кнопку "оформить" и отрисовывает форму для ввода способа оплаты и адреса доставки
'order:open'
//Инициируется при нажатии на кнопку "далее", сохраняет стоимость заказа и отрисовывает форму для ввода контактов
'order:submit'
//Инициируется при нажатии на кнопку "оплатить", отправляет заказ на сервер, очищает текущий заказ и корзину
'contacts:submit'
//Инициируется при нажатии на кнопку "оплатить", принимает id и сумму заказанных товаров и запускает отрисовку успешной оплаты
'order:success', (result: ApiListResponse<string>)
// Блокирует прокрутку страницы, если открыта модалка
'modal:open'
// ... и разблокирует
'modal:close'
//Инициируется при изменении состояния валидации формы ввода адреса и способа оплаты
'orderFormErrors:change', (errors: Partial<IOrderForm>)
//Инициируется при изменении состояния валидации формы ввода адреса и способа оплаты
'contactsFormErrors:change', (errors: Partial<IOrderForm>)
//Инициируется при изменении одного из полей заказа и приводит к изменению значений атрибутов заказа (при успешной валидации)
'order:change', (data: { field: keyof IOrderForm, value: string })
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
