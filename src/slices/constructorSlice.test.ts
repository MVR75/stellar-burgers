import constructorSliceReducer, {
  addBun,
  addIngredient,
  clearConstructor,
  deleteIngredient,
  initialState,
  moveIngredientDown,
  moveIngredientUp
} from "./constructorSlice";

describe('Тест редьюсера [burgerConstructor]', () => {
  const ingredient = {
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
    __v: 0,
  };

  const ingredientWithId = {
    ...ingredient,
    id: "U-rzbV6K4wWlp6UNE-eLA"
  }

  const secondIngredientWithId = {
    ...ingredient,
    id: "yMGzxesfHphNSDHMOgI44"
  };

  const bun = {
    _id: "643d69a5c3f7b9001cfa093c",
    name: "Краторная булка N-200i",
    type: "bun",
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: "https://code.s3.yandex.net/react/code/bun-02.png",
    image_mobile: "https://code.s3.yandex.net/react/code/bun-02-mobile.png",
    image_large: "https://code.s3.yandex.net/react/code/bun-02-large.png",
    __v: 0
  };

  test('Добавить ингредиент', () => {
    const action = {
      type: addIngredient.type,
      payload: ingredientWithId
    };

    const newState = constructorSliceReducer(initialState, action);

    expect(newState).toEqual({...initialState, ingredients: [ingredientWithId]});
  });

  test('Добавить булочку', () => {
    const newState = constructorSliceReducer(initialState, addBun(bun));

    expect(newState).toEqual({...initialState, bun: bun});
  });

  test('Удалить ингредиент', () => {
    const newState = constructorSliceReducer(
      {...initialState, ingredients: [ingredientWithId]},
      deleteIngredient(ingredientWithId)
    );

    expect(newState).toEqual(initialState);
  });

  test('Передвинуть ингредиент выше в конструкторе', () => {
    const newState = constructorSliceReducer(
      {...initialState, ingredients: [ingredientWithId, secondIngredientWithId]},
      moveIngredientUp(1)
    );

    expect(newState.ingredients[0].id).toBe(secondIngredientWithId.id);
  });

  test('Передвинуть ингредиент ниже в конструкторе', () => {
    const newState = constructorSliceReducer(
      {...initialState, ingredients: [ingredientWithId, secondIngredientWithId]},
      moveIngredientDown(0)
    );

    expect(newState.ingredients[1].id).toBe(ingredientWithId.id);
  });

  test('Очистить конструктор', () => {
    const newState = constructorSliceReducer(
      {...initialState, ingredients: [ingredientWithId]},
      clearConstructor()
    );

    expect(newState).toEqual(initialState);
  });
});
