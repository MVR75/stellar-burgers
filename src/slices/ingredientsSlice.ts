import { getIngredientsApi } from '@api';
import {
  createAsyncThunk,
  createSelector,
  createSlice
} from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';
import { RootState } from 'src/services/store';

export const getIngredients = createAsyncThunk<
  TIngredient[],
  void,
  { rejectValue: string }
>('ingredients/get', async (_, { rejectWithValue }) => {
  try {
    return await getIngredientsApi();
  } catch (err) {
    const message =
      err instanceof Error ? err.message : 'Не удалось загрузить данные';
    return rejectWithValue(message);
  }
});

type TIngredientsState = {
  ingredients: TIngredient[];
  isIngredientsLoading: boolean;
  error: string | null;
};

const initialState: TIngredientsState = {
  ingredients: [],
  isIngredientsLoading: false,
  error: null
};

export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  selectors: {
    selectLoading: (state) => state.isIngredientsLoading,
    selectIngredientsErrors: (state) => state.error
  },
  extraReducers: (builder) => {
    builder
      .addCase(getIngredients.pending, (state) => {
        state.isIngredientsLoading = true;
        state.error = null;
      })
      .addCase(getIngredients.fulfilled, (state, action) => {
        state.ingredients = action.payload;
        state.isIngredientsLoading = false;
      })
      .addCase(getIngredients.rejected, (state, action) => {
        state.isIngredientsLoading = false;
        state.error =
          action.payload ?? action.error.message ?? 'Ошибка загрузки';
      });
  }
});

export const selectIngredients = (state: RootState) =>
  state.ingredients.ingredients;

export const selectBuns = createSelector([selectIngredients], (ingredients) =>
  ingredients.filter((item) => item.type === 'bun')
);

export const selectMains = createSelector([selectIngredients], (ingredients) =>
  ingredients.filter((item) => item.type === 'main')
);

export const selectSauces = createSelector([selectIngredients], (ingredients) =>
  ingredients.filter((item) => item.type === 'sauce')
);

export const { selectLoading, selectIngredientsErrors } =
  ingredientsSlice.selectors;
