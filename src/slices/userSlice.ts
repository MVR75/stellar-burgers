import {
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  TLoginData,
  TRegisterData,
  updateUserApi
} from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import { deleteCookie, setCookie } from '../utils/cookie';

export const registerUser = createAsyncThunk<
  TUser,
  TRegisterData,
  { rejectValue: string }
>('user/register', async (data: TRegisterData, { rejectWithValue }) => {
  try {
    const response = await registerUserApi(data);

    localStorage.setItem('refreshToken', response.refreshToken);
    setCookie('accessToken', response.accessToken);

    return response.user;
  } catch (err) {
    const apiError = err as { success: boolean; message: string };
    return rejectWithValue(apiError.message);
  }
});

export const loginUser = createAsyncThunk<
  TUser,
  TLoginData,
  { rejectValue: string }
>('user/login', async (data: TLoginData, { rejectWithValue }) => {
  try {
    const response = await loginUserApi(data);

    localStorage.setItem('refreshToken', response.refreshToken);
    setCookie('accessToken', response.accessToken);

    return response.user;
  } catch (err) {
    const apiError = err as { success: boolean; message: string };
    return rejectWithValue(apiError.message);
  }
});

export const updateUser = createAsyncThunk<
  TUser,
  Partial<TRegisterData>,
  { rejectValue: string }
>('user/update', async (data: Partial<TRegisterData>, { rejectWithValue }) => {
  try {
    const response = await updateUserApi(data);
    return response.user;
  } catch (err) {
    const apiError = err as { success: boolean; message: string };
    return rejectWithValue(apiError.message);
  }
});

export const logoutUser = createAsyncThunk('user/logout', async () => {
  await logoutApi();
  localStorage.removeItem('refreshToken');
  deleteCookie('accessToken');
});

export const initAuth = createAsyncThunk<
  TUser | undefined,
  void,
  { rejectValue: string }
>('user/checkAuth', async (_, { rejectWithValue }) => {
  try {
    if (!localStorage.getItem('refreshToken')) {
      return;
    } else {
      const response = await getUserApi();
      return response.user;
    }
  } catch (err) {
    localStorage.removeItem('refreshToken');
    deleteCookie('accessToken');

    const message =
      err instanceof Error ? err.message : 'Не удалось загрузить данные';
    return rejectWithValue(message);
  }
});

type TUserState = {
  user: TUser | null;
  isAuth: boolean;
  isAuthChecked: boolean;
  isLoading: boolean;
  error: string | null;
};

const initialState: TUserState = {
  user: null,
  isAuth: false,
  isAuthChecked: false,
  isLoading: false,
  error: null
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  selectors: {
    selectIsAuth: (state) => state.isAuth,
    selectUserName: (state) => state.user?.name,
    selectUserEmail: (state) => state.user?.email,
    selectIsAuthChecked: (state) => state.isAuthChecked,
    selectUserError: (state) => state.error,
    selectIsLoading: (state) => state.isLoading
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuth = true;
        state.isLoading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.payload ?? action.error.message ?? 'Ошибка загрузки';
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuth = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.error =
          action.payload ?? action.error.message ?? 'Ошибка загрузки';
      })
      .addCase(initAuth.fulfilled, (state, action) => {
        if (!action.payload) {
          state.isAuthChecked = true;
        } else {
          state.user = action.payload;
          state.isAuthChecked = true;
          state.isAuth = true;
        }
      })
      .addCase(initAuth.rejected, (state, action) => {
        state.isAuthChecked = true;
        state.error =
          action.payload ?? action.error.message ?? 'Ошибка загрузки';
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuth = false;
      });
  }
});

export const {
  selectIsAuth,
  selectUserName,
  selectUserEmail,
  selectIsAuthChecked,
  selectUserError,
  selectIsLoading
} = userSlice.selectors;
