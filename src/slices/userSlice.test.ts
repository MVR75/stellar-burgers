import * as api from '@api';
import userSliceReducer, { initAuth, loginUser, logoutUser, registerUser, updateUser } from './userSlice';
import { configureStore } from '@reduxjs/toolkit';
import * as cookie from '../utils/cookie';

const registerMock = {
  success: true,
  refreshToken: 'test-refresh',
  accessToken: 'test-access',
  user: {
    email: "smvr75@mail.ru",
    name: "Влад"
  }
};

const userMock = {
  success: true,
  user: {
    email: "smvr75@mail.ru",
    name: "Влад"
  }
};

const makeStore = () => 
  configureStore({
    reducer: {
      user: userSliceReducer
    }
  });

let store: ReturnType<typeof makeStore>;

describe('Тест асинхронных экшенов [userSlice]', () => {
  beforeEach(() => {
    store = makeStore();
    localStorage.clear();
    jest.resetAllMocks();
  });

  describe('Зарегистрировать пользователя [registerUser]', () => {
    test('[pending]', async () => {
      let resolveFn!: (value: typeof registerMock) => void;

      const pendingPromise = new Promise<typeof registerMock>((resolve) => {
        resolveFn = resolve;
      });

      const registerUserSpy = jest.spyOn(api, 'registerUserApi').mockReturnValue(pendingPromise as any);

      const dispatchPromise = store.dispatch(registerUser({email: 'example@yandex.ru', name: 'Vlad', password: '123'}));

      const { user } = store.getState();

      expect(user.isLoading).toBe(true);
      expect(user.error).toBe(null);

      expect(registerUserSpy).toHaveBeenCalledTimes(1);

      resolveFn(registerMock);
      await dispatchPromise;
    });

    test('[fulfilled]', async () => {
      const registerUserSpy = jest.spyOn(api, 'registerUserApi').mockResolvedValue(registerMock);
      const setCookieSpy = jest.spyOn(cookie, 'setCookie').mockImplementation(() => {});

      await store.dispatch(registerUser({email: 'example@yandex.ru', name: 'Vlad', password: '123'}));

      const { user } = store.getState();

      expect(user.isAuth).toBeTruthy();
      expect(user.isLoading).toBeFalsy();
      expect(user.user).toEqual(registerMock.user);

      expect(localStorage.getItem('refreshToken')).toBe('test-refresh');
      expect(setCookieSpy).toHaveBeenCalledWith('accessToken', 'test-access');

      expect(registerUserSpy).toHaveBeenCalledTimes(1);
    });

    test('[rejected]', async () => {
      const registerUserSpy = jest.spyOn(api, 'registerUserApi').mockRejectedValue(new Error('error'));

      await store.dispatch(registerUser({email: 'example@yandex.ru', name: 'Vlad', password: '123'}));

      const { user } = store.getState();

      expect(user.isLoading).toBeFalsy();
      expect(user.error).toBe('error');

      expect(registerUserSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('Залогинить пользователя [loginUser]', () => {
    test('[fulfilled]', async () => {
      const loginUserSpy = jest.spyOn(api, 'loginUserApi').mockResolvedValue(registerMock);
      const setCookieSpy = jest.spyOn(cookie, 'setCookie').mockImplementation(() => {});

      await store.dispatch(loginUser({email: 'example@yandex.ru', password: '123'}));

      const { user } = store.getState();

      expect(user.isAuth).toBeTruthy();
      expect(user.user).toEqual(registerMock.user);

      expect(localStorage.getItem('refreshToken')).toBe('test-refresh');
      expect(setCookieSpy).toHaveBeenCalledWith('accessToken', 'test-access');

      expect(loginUserSpy).toHaveBeenCalledTimes(1);
    });

    test('[rejected]', async () => {
      const loginUserSpy = jest.spyOn(api, 'loginUserApi').mockRejectedValue(new Error('error'));

      await store.dispatch(loginUser({email: 'example@yandex.ru', password: '123'}));

      const { user } = store.getState();

      expect(user.error).toBe('error');

      expect(loginUserSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('Инициализировать авторизацию [initAuth]', () => {
    test('[fulfilled]', async () => {
      localStorage.setItem('refreshToken', 'test-refresh');

      const initAuthSpy = jest.spyOn(api, 'getUserApi').mockResolvedValue(userMock);

      await store.dispatch(initAuth());

      const { user } = store.getState();

      expect(user.isAuthChecked).toBeTruthy();
      expect(user.isAuth).toBeTruthy();
      expect(user.user).toEqual(userMock.user);

      expect(initAuthSpy).toHaveBeenCalledTimes(1);
    });

    test('[rejected]', async () => {
      localStorage.setItem('refreshToken', 'test-refresh');

      const deleteCookieSpy = jest.spyOn(cookie, 'deleteCookie').mockImplementation(() => {});
      const initAuthSpy = jest.spyOn(api, 'getUserApi').mockRejectedValue(new Error('error'));

      await store.dispatch(initAuth());

      const { user } = store.getState();

      expect(user.isAuthChecked).toBeTruthy();
      expect(user.error).toBe('error');

      expect(localStorage.getItem('refreshToken')).toBe(null);
      expect(deleteCookieSpy).toHaveBeenCalledWith('accessToken');

      expect(initAuthSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('Обновить пользователя [updateUser]', () => {
    test('[fulfilled]', async () => {
      const updateUserSpy = jest.spyOn(api, 'updateUserApi').mockResolvedValue(userMock);

      await store.dispatch(updateUser({email: 'example@yandex.ru', name: 'Vlad', password: '123'}));

      const { user } = store.getState();

      expect(user.user).toEqual(userMock.user);

      expect(updateUserSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('Разлогинить пользователя [logoutUser]', () => {
    test('[fulfilled]', async () => {
      localStorage.setItem('refreshToken', 'test-refresh');

      const deleteCookieSpy = jest.spyOn(cookie, 'deleteCookie').mockImplementation(() => {});
      const logoutUserSpy = jest.spyOn(api, 'logoutApi').mockResolvedValue({success: true});

      await store.dispatch(logoutUser());

      const { user } = store.getState();

      expect(user.isAuth).toBeFalsy();
      expect(user.user).toBe(null);

      expect(localStorage.getItem('refreshToken')).toBe(null);
      expect(deleteCookieSpy).toHaveBeenCalledWith('accessToken');

      expect(logoutUserSpy).toHaveBeenCalledTimes(1);
    });
  });
});
