import { orderBurgerApi } from '@api';
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

type TOrderState = {
  orderRequest: boolean;
  orderModalData: number | null;
  orders: TOrder[];
};

const initialState: TOrderState = {
  orderRequest: false,
  orderModalData: null,
  orders: []
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
    selectOrderModalData: (state) => state.orderModalData
  },
  extraReducers: (builder) => {
    builder
      .addCase(orderBurger.pending, (state) => {
        state.orderRequest = true;
      })
      .addCase(orderBurger.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload;
      });
  }
});

export const { selectOrderRequest, selectOrderModalData } =
  ordersSlice.selectors;

export const { clearOrderModalData } = ordersSlice.actions;
