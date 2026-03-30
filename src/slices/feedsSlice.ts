import { getFeedsApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder, TOrdersData } from '@utils-types';

type TFeedsPayload = {
  orders: TOrder[];
  total: number;
  totalToday: number;
};

export const getFeeds = createAsyncThunk<
  TFeedsPayload,
  void,
  { rejectValue: string }
>('feed/get', async (_, { rejectWithValue }) => {
  try {
    const { orders, total, totalToday } = await getFeedsApi();
    return { orders, total, totalToday };
  } catch (err) {
    const apiError = err as { success: boolean; message: string };
    return rejectWithValue(apiError.message);
  }
});

type TFeedsState = TOrdersData & {
  isLoading: boolean;
  error: string | null;
};

const initialState: TFeedsState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isLoading: false,
  error: null
};

export const feedsSlice = createSlice({
  name: 'feeds',
  initialState,
  reducers: {},
  selectors: {
    selectFeedsLoading: (state) => state.isLoading,
    selectOrders: (state) => state.orders,
    selectFeed: (state) => ({
      total: state.total,
      totalToday: state.totalToday
    })
  },
  extraReducers: (builder) => {
    builder
      .addCase(getFeeds.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getFeeds.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(getFeeds.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.payload ?? action.error.message ?? 'Ошибка загрузки';
      });
  }
});

export const { selectFeedsLoading, selectOrders, selectFeed } =
  feedsSlice.selectors;
