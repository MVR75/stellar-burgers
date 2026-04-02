import { TOrder } from '@utils-types';

export type BurgerConstructorUIProps = {
  constructorItems: any;
  orderRequest: boolean;
  price: number;
  orderModalData: number | null;
  onOrderClick: () => void;
  closeOrderModal: () => void;
};
