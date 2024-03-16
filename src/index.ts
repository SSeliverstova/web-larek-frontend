import './scss/styles.scss';
import { LarekAPI } from './components/LarekApi'
import {API_URL, CDN_URL} from './utils/constants'
import { ensureElement, cloneTemplate } from './utils/utils';
import { EventEmitter } from './components/base/events';
import { Page } from './components/Page';
import { AppState } from './components/AppData';
import { Modal } from './components/common/Modal';
import { Success } from './components/Success';

const api = new LarekAPI(API_URL, CDN_URL)
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
const success = new Success(cloneTemplate(successTemplate), {
  onClick: () => {
      console.log(success);
      modal.close();
      appData.resetBasket();
      events.emit('modal:close');
  }
});
console.log(success);

// Получаем товары с сервера
api.get('/product')
    .then(appData.setGallery.bind(appData))
    .catch(err => {
        console.error(err);
    });

// Закрытие модального окна
events.on('modal:close', () => {
  page.blocked = false;
  appData.resetOrder();
});
