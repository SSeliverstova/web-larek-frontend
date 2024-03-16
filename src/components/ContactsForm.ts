import { Form } from "./common/Form";
import { IContactsForm } from "../types";

export class ContactsForm extends Form<IContactsForm> {
  //при нажатии на сабмит закрываем форму, очищаем заказ и переключаемся на Success
}