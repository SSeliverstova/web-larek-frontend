// export class Card {
//   constructor({
//     templateSelector,
//     data,
//     userId,
//     handleCardClick,
//     handleDelete,
//     addLike,
//     removeLike,
//   }) {
//     this._data = data;
//     this._templateSelector = templateSelector;
//     this._name = data.name;
//     this._link = data.link;
//     this._id = data._id;
//     this._handleCardClick = handleCardClick;
//     this._handleDelete = handleDelete;
//     this._addLike = addLike;
//     this._removeLike = removeLike;
//     this._likes = data.likes;
//     this._userId = userId;
//     this._ownerId = data.owner._id;
//   }

//   _getTemplate() {
//     const cardElement = document
//       .querySelector(this._templateSelector)
//       .content.querySelector(".element")
//       .cloneNode(true);

//     return cardElement;
//   } 

//   createCard() {
//     this._element = this._getTemplate();
//     this._countLikes = this._element.querySelector(".element__like-count");
//     this._countLikes.textContent = this._likes.length;
//     this._elementImage = this._element.querySelector(".element__image");
//     this._elementText = this._element.querySelector(".element__text");
//     this._elementLike = this._element.querySelector(".element__like");
//     this._elementDel = this._element.querySelector(".element__del");
//     this._elementImage.src = this._link;
//     this._elementImage.alt = "тут должна быть картинка " + this._name;
//     this._elementText.textContent = this._name;

//     this._setEventListeners();
//     this._removeDelIcon();
//     this._isOwnerLike();

//     return this._element;
//   }

//   //слушатель клика на карточку --> открытие карточки
//   _setEventListeners() {
//     this._elementLike.addEventListener("click", () => {
//       if (this._isLiked()) {
//         this._removeLike(this._id);
//       } else {
//         this._addLike(this._id);
//       }
//     });
//     this._elementDel.addEventListener("click", () => {
//       this._handleDelete(this._id);
//     });
//     this._elementImage.addEventListener("click", () => {
//       this._handleCardClick(this._link, this._name);
//     });
//   }

//   _isLiked() {
//     return this._likes.some((user) => this._userId === user._id);
//   }

// }
