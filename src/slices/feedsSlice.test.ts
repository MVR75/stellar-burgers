import * as api from '@api';
import { configureStore } from '@reduxjs/toolkit';
import feedsSliceReducer, { getFeeds } from '../slices/feedsSlice';

const feedsMock = {
  success: true,
  orders: [
  {
    _id: '69e2298da64177001b332c9e',
    ingredients: [
      '643d69a5c3f7b9001cfa0942',
      '643d69a5c3f7b9001cfa0943',
      '643d69a5c3f7b9001cfa093d'
    ],
    status: 'done',
    name: 'Spicy флюоресцентный space бургер',
    createdAt: '2026-04-17T12:37:33.754Z',
    updatedAt: '2026-04-17T12:37:33.999Z',
    number: 104194
  }],
  total: 28189,
  totalToday: 34
};

const store = configureStore({
  reducer: {
    feeds: feedsSliceReducer
  }
});

describe('Тест асинхронных экшенов [ingredientsSlice]', () => {
  describe('Получить ленту заказов [getFeeds]', () => {
    test('[pending]', async () => {
      let resolveFn!: (value: typeof feedsMock) => void;

      const pendingPromise = new Promise<typeof feedsMock>((resolve) => {
        resolveFn = resolve;
      });

      const getFeedsSpy = jest.spyOn(api, 'getFeedsApi').mockResolvedValue(pendingPromise as any);

      const dispatchPromise = store.dispatch(getFeeds());

      const { feeds } = store.getState();

      expect(feeds.isLoading).toBe(true);

      expect(getFeedsSpy).toHaveBeenCalledTimes(1);

      resolveFn(feedsMock);
      await dispatchPromise;
    });

    test('[fulfilled]', async () => {
      const getFeedsSpy = jest.spyOn(api, 'getFeedsApi').mockResolvedValue(feedsMock);

      await store.dispatch(getFeeds());

      const { feeds } = store.getState();

      expect(feeds.orders).toEqual(feedsMock.orders);
      expect(feeds.total).toBe(feedsMock.total);
      expect(feeds.totalToday).toBe(feedsMock.totalToday);

      expect(feeds.isLoading).toBe(false);

      expect(getFeedsSpy).toHaveBeenCalledTimes(1);
    });

    test('[rejected]', async () => {
      const getFeedsSpy = jest.spyOn(api, 'getFeedsApi').mockRejectedValue(new Error('error'));

      await store.dispatch(getFeeds());

      const { feeds } = store.getState();

      expect(feeds.error).toBe('error');

      expect(feeds.isLoading).toBe(false);

      expect(getFeedsSpy).toHaveBeenCalledTimes(1);
    });
  });
});
