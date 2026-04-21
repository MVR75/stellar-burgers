import * as api from '@api';
import ordersSliceReducer, { getUserOrders, orderBurger, initialState, clearOrderModalData } from './ordersSlice';
import { configureStore } from '@reduxjs/toolkit';

const orderMock = {
  success: true,
  name: "Флюоресцентный люминесцентный бургер",
  order: {
    ingredients: [
      {
        _id: "643d69a5c3f7b9001cfa093d",
        name: "Флюоресцентная булка R2-D3",
        type: "bun",
        proteins: 44,
        fat: 26,
        carbohydrates: 85,
        calories: 643,
        price: 988,
        image: "https://code.s3.yandex.net/react/code/bun-01.png",
        image_mobile: "https://code.s3.yandex.net/react/code/bun-01-mobile.png",
        image_large: "https://code.s3.yandex.net/react/code/bun-01-large.png",
        __v: 0
      },
      {
        _id: "643d69a5c3f7b9001cfa093e",
        name: "Филе Люминесцентного тетраодонтимформа",
        type: "main",
        proteins: 44,
        fat: 26,
        carbohydrates: 85,
        calories: 643,
        price: 988,
        image: "https://code.s3.yandex.net/react/code/meat-03.png",
        image_mobile: "https://code.s3.yandex.net/react/code/meat-03-mobile.png",
        image_large: "https://code.s3.yandex.net/react/code/meat-03-large.png",
        __v: 0
      },
      {
        _id: "643d69a5c3f7b9001cfa093d",
        name: "Флюоресцентная булка R2-D3",
        type: "bun",
        proteins: 44,
        fat: 26,
        carbohydrates: 85,
        calories: 643,
        price: 988,
        image: "https://code.s3.yandex.net/react/code/bun-01.png",
        image_mobile: "https://code.s3.yandex.net/react/code/bun-01-mobile.png",
        image_large: "https://code.s3.yandex.net/react/code/bun-01-large.png",
        __v: 0
      }
    ],
    _id: "69e61a56a64177001b3332dd",
    owner: {
      name: "Влад",
      email: "smvr75@mail.ru",
      createdAt: "2026-03-26T10:59:02.985Z",
      updatedAt: "2026-03-30T12:56:51.671Z"
    },
    status: "done",
    name: "Флюоресцентный люминесцентный бургер",
    createdAt: "2026-04-20T12:21:42.619Z",
    updatedAt: "2026-04-20T12:21:42.846Z",
    number: 104347,
    price: 2964
  }
};

const userOrdersMock = [
  {
    _id: "69c7a288a64177001b330c9f",
    ingredients: [
      "643d69a5c3f7b9001cfa093d",
      "643d69a5c3f7b9001cfa093e",
      "643d69a5c3f7b9001cfa0941",
      "643d69a5c3f7b9001cfa093d"
    ],
    status: "done",
    name: "Био-марсианский флюоресцентный люминесцентный бургер",
    createdAt: "2026-03-28T09:42:32.916Z",
    updatedAt: "2026-03-28T09:42:33.155Z",
    number: 103338
  }
];

const makeStore = () =>
  configureStore({
    reducer: {
      orders: ordersSliceReducer
    }
  });

let store: ReturnType<typeof makeStore>;

describe('Тест слайса [ordersSlice]', () => {
  describe('Тест асинхронных экшенов', () => {
    beforeEach(() => {
      store = makeStore();
    });

    describe('Сделать заказ [orderBurger]', () => {
      test('[pending]', async () => {
        let resolvedFn!: (value: typeof orderMock) => void;

        const pendingPromise = new Promise<typeof orderMock>((resolve) => {
          resolvedFn = resolve;
        });

        const orderBurgerSpy = jest.spyOn(api, 'orderBurgerApi').mockReturnValue(pendingPromise as any);

        const dispatchPromise = store.dispatch(orderBurger([]));

        const { orders } = store.getState();

        expect(orders.orderRequest).toBe(true);

        expect(orderBurgerSpy).toHaveBeenCalledTimes(1);

        resolvedFn(orderMock);
        await dispatchPromise;
      });

      test('[fulfilled]', async () => {
        const orderBurgerSpy = jest.spyOn(api, 'orderBurgerApi').mockResolvedValue(orderMock);

        await store.dispatch(orderBurger([]));

        const { orders } = store.getState();

        expect(orders.orderRequest).toBe(false);
        expect(orders.orderModalData).toBe(orderMock.order.number);

        expect(orderBurgerSpy).toHaveBeenCalledTimes(1);
      });
    });

    describe('Получить список заказов пользователя [getUserOrders]', () => {
      test('[pending]', async () => {
        let resolvedFn!: (value: typeof userOrdersMock) => void;

        const pendingPromise = new Promise<typeof userOrdersMock>((resolve) => {
          resolvedFn = resolve;
        });

        const getUserOrdersSpy = jest.spyOn(api, 'getOrdersApi').mockReturnValue(pendingPromise as any);

        const dispatchPromise = store.dispatch(getUserOrders());

        const { orders } = store.getState();

        expect(orders.ordersIsLoading).toBe(true);
        expect(orders.error).toBe(null);

        expect(getUserOrdersSpy).toHaveBeenCalledTimes(1);

        resolvedFn(userOrdersMock);
        await dispatchPromise;
      });

      test('[fulfilled]', async () => {
        const getUserOrdersSpy = jest.spyOn(api, 'getOrdersApi').mockResolvedValue(userOrdersMock);

        await store.dispatch(getUserOrders());

        const { orders } = store.getState();

        expect(orders.ordersIsLoading).toBe(false);
        expect(orders.orders).toEqual(userOrdersMock);

        expect(getUserOrdersSpy).toHaveBeenCalledTimes(1);
      });

      test('[rejected]', async () => {
        const getUserOrdersSpy = jest.spyOn(api, 'getOrdersApi').mockRejectedValue(new Error('error'));

        await store.dispatch(getUserOrders());

        const { orders } = store.getState();

        expect(orders.ordersIsLoading).toBe(false);
        expect(orders.error).toBe('error');

        expect(getUserOrdersSpy).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('Тест редюсера', () => {
    test('Очистить данные модального окна', () => {
      const newState = ordersSliceReducer({...initialState, orderModalData: 32}, clearOrderModalData());

      expect(newState.orderModalData).toBe(null);
    });
  });
});
