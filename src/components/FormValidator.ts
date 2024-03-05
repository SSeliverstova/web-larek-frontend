// export class FormValidator {
//   constructor(selectors, formElement) {
//     this._inputSelector = selectors.inputSelector;
//     this._submitButtonSelector = selectors.submitButtonSelector;
//     this._inactiveButtonClass = selectors.inactiveButtonClass;
//     this._inputErrorClass = selectors.inputErrorClass;
//     this._formElement = formElement;
//     this._buttonElement = this._formElement.querySelector(
//       this._submitButtonSelector,
//     );
//     this._inputList = this._formElement.querySelectorAll(this._inputSelector);
//     this._inputs = [...this._inputList];
//   }

//   _showInputError(inputElement, errorElement) {
//     inputElement.classList.add(this._inputErrorClass);
//     errorElement.textContent = inputElement.validationMessage;
//   }

//   _hideInputError(inputElement, errorElement) {
//     inputElement.classList.remove(this._inputErrorClass);
//     errorElement.textContent = inputElement.validationMessage;
//   }

//   _checkInputValidity(inputElement) {
//     const isInputValid = inputElement.validity.valid;
//     const errorElement = this._formElement.querySelector(
//       `#${inputElement.name}-error`,
//     );
//     if (isInputValid) {
//       this._hideInputError(inputElement, errorElement);
//     } else {
//       this._showInputError(inputElement, errorElement);
//     }
//   }

//   _enableButton() {
//     this._buttonElement.disabled = false;
//     this._buttonElement.classList.remove(this._inactiveButtonClass);
//   }

//   disableButton() {
//     this._buttonElement.classList.add(this._inactiveButtonClass);
//     this._buttonElement.disabled = true;
//   }

//   _toggleButtonState(isActive) {
//     if (isActive) {
//       this._enableButton();
//     } else {
//       this.disableButton();
//     }
//   }

//   _setEventListeners() {
//     this._toggleButtonState(this._formElement.checkValidity());

//     this._inputs.forEach((inputElement) => {
//       inputElement.addEventListener("input", () => {
//         this._toggleButtonState(this._formElement.checkValidity());
//         this._checkInputValidity(inputElement);
//       });
//     });
//   }

//   enableValidation() {
//     this._setEventListeners();
//   }
// }


//Кнопка перехода к следующему шагу становится доступна только после выполнения действий 
//на текущей странице (выбора товара, способа оплаты, заполнения данных о покупателе)

//если адрес доставки не введён, появляется сообщение об ошибке

//если одно из полей не заполнено, появляется сообщение об ошибке