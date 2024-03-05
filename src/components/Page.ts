// export default class Page {
//   constructor({ renderer }, containerSelector) {
//     this._renderer = renderer;
//     this._container = document.querySelector(containerSelector);
//   }

//   //рендерим список товаров
//   renderItems(items) {
//     items.forEach((item) => {
//       this._renderer(item);
//     });
//   }

//   //открываем корзину
//   addItem(element) {
//     this._container.prepend(element);
//   }
// }