import { getOrdersApi, orderBurgerApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

export const orderBurger = createAsyncThunk<
  number,
  string[],
  { rejectValue: string }
>('orders/createOrder', async (data, { rejectWithValue }) => {
  try {
    const response = await orderBurgerApi(data);
    return response.order.number;
  } catch (err) {
    const apiError = err as { success: boolean; message: string };
    return rejectWithValue(apiError.message);
  }
});

export const getUserOrders = createAsyncThunk<
  TOrder[],
  void,
  { rejectValue: string }
>('orders/getUserOrders', async (_, { rejectWithValue }) => {
  try {
    return await getOrdersApi();
  } catch (err) {
    const apiError = err as { success: boolean; message: string };
    return rejectWithValue(apiError.message);
  }
});

type TOrderState = {
  orderRequest: boolean;
  orderModalData: number | null;
  orders: TOrder[];
  ordersIsLoading: boolean;
  error: string | null;
};

const initialState: TOrderState = {
  orderRequest: false,
  orderModalData: null,
  orders: [],
  ordersIsLoading: false,
  error: null
};

export const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearOrderModalData: (state) => {
      state.orderModalData = null;
    }
  },
  selectors: {
    selectOrderRequest: (state) => state.orderRequest,
    selectOrderModalData: (state) => state.orderModalData,
    selectUserOrders: (state) => state.orders,
    selectOrdersIsLoading: (state) => state.ordersIsLoading
  },
  extraReducers: (builder) => {
    builder
      .addCase(orderBurger.pending, (state) => {
        state.orderRequest = true;
      })
      .addCase(orderBurger.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload;
      })
      .addCase(getUserOrders.pending, (state) => {
        state.ordersIsLoading = true;
        state.error = null;
      })
      .addCase(getUserOrders.fulfilled, (state, action) => {
        state.ordersIsLoading = false;
        state.orders = action.payload;
      })
      .addCase(getUserOrders.rejected, (state, action) => {
        state.ordersIsLoading = false;
        state.error =
          action.payload ?? action.error.message ?? 'Ошибка загрузки';
      });
  }
});

export const {
  selectOrderRequest,
  selectOrderModalData,
  selectUserOrders,
  selectOrdersIsLoading
} = ordersSlice.selectors;

export const { clearOrderModalData } = ordersSlice.actions;
