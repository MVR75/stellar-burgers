import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  getUserOrders,
  selectOrdersIsLoading,
  selectUserOrders
} from '../../slices/ordersSlice';

export const ProfileOrders: FC = () => {
  const orders = useSelector(selectUserOrders);
  const isLoading = useSelector(selectOrdersIsLoading);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUserOrders());
  }, [dispatch]);

  return <ProfileOrdersUI orders={orders} isLoading={isLoading} />;
};
