import { Form } from "./common/Form";
import { IDeliveryForm } from "../types";
import { IEvents } from "./base/events";

export class DeliveryForm extends Form<IDeliveryForm> {
  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);
}

set cash(value: string) {
    (this.container.elements.namedItem('cash') as HTMLInputElement).value = value;
}

set address(value: string) {
    (this.container.elements.namedItem('address') as HTMLInputElement).value = value;
}
  //при клике на один из вариатов способа оплаты, второй неактивен
  //при нажатии на сабмит закрываем форму и переключаемся на orderingSecond
}