import { rootReducer } from "./store";

test('Проверка инициализации стора', () => {
  const state = rootReducer(undefined, { type: '@@INIT' });

  expect(state).toEqual({
    ingredients: {
      ingredients: [],
      isIngredientsLoading: false,
      error: null
    },
    burgerConstructor: {
      bun: null,
      ingredients: []
    },
    user: {
      user: null,
      isAuth: false,
      isAuthChecked: false,
      isLoading: false,
      error: null
    },
    feeds: {
      orders: [],
      total: 0,
      totalToday: 0,
      isLoading: false,
      error: null
    },
    orders: {
      orderRequest: false,
      orderModalData: null,
      orders: [],
      ordersIsLoading: false,
      error: null
    }
  });
});
