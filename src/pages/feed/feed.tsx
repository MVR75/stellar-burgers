import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  getFeeds,
  selectFeedsLoading,
  selectOrders
} from '../../slices/feedsSlice';

export const Feed: FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getFeeds());
  }, [dispatch]);

  const orders = useSelector(selectOrders);
  const isLoading = useSelector(selectFeedsLoading);

  return isLoading ? (
    <Preloader />
  ) : (
    <FeedUI orders={orders} handleGetFeeds={() => {}} />
  );
};
