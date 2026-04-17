import * as api from '@api';
import { configureStore } from '@reduxjs/toolkit';
import ingredientsSliceReducer, { getIngredients } from '../slices/ingredientsSlice';

const expectedResult = [
  {
    "_id": "643d69a5c3f7b9001cfa093c",
    "name": "Краторная булка N-200i",
    "type": "bun",
    "proteins": 80,
    "fat": 24,
    "carbohydrates": 53,
    "calories": 420,
    "price": 1255,
    "image": "https://code.s3.yandex.net/react/code/bun-02.png",
    "image_mobile": "https://code.s3.yandex.net/react/code/bun-02-mobile.png",
    "image_large": "https://code.s3.yandex.net/react/code/bun-02-large.png",
    "__v": 0
  }
];

const store = configureStore({
  reducer: {
    ingredients: ingredientsSliceReducer
  }
});

describe('Тест асинхронных экшенов [ingredientsSlice]', () => {
  test('Получить список ингредиентов [pending]', async () => {
    let resolveFn!: (value: typeof expectedResult) => void;

    const pendingPromise = new Promise<typeof expectedResult>((resolve) => {
      resolveFn = resolve;
    });

    const getIngredientsSpy = jest.spyOn(api, 'getIngredientsApi').mockResolvedValue(pendingPromise as any);

    const dispatchPromise = store.dispatch(getIngredients());

    const { ingredients } = store.getState();

    expect(ingredients.isIngredientsLoading).toBe(true);

    expect(getIngredientsSpy).toHaveBeenCalledTimes(1);

    resolveFn(expectedResult);
    await dispatchPromise;
  });

  test('Получить список ингредиентов [fulfilled]', async () => {
    const getIngredientsSpy = jest.spyOn(api, 'getIngredientsApi').mockResolvedValue(expectedResult);

    await store.dispatch(getIngredients());

    const { ingredients } = store.getState();

    expect(ingredients.ingredients).toEqual(expectedResult);

    expect(ingredients.isIngredientsLoading).toBe(false);

    expect(getIngredientsSpy).toHaveBeenCalledTimes(1);
  });

  test('Получить список ингредиентов [rejected]', async () => {
    const getIngredientsSpy = jest.spyOn(api, 'getIngredientsApi').mockRejectedValue(new Error('error'));

    await store.dispatch(getIngredients());

    const { ingredients } = store.getState();

    expect(ingredients.error).toBe('error');

    expect(ingredients.isIngredientsLoading).toBe(false);

    expect(getIngredientsSpy).toHaveBeenCalledTimes(1);
  });
});
