import {
  ConstructorPage,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword,
  Feed
} from '@pages';
import '../../index.css';
import styles from './app.module.css';

import { AppHeader, IngredientDetails, Modal, OrderInfo } from '@components';
import { Preloader } from '@ui';
import { Route, Routes } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import { useEffect } from 'react';
import {
  getIngredients,
  selectIngredients
} from '../../slices/ingredientsSlice';
import { Layout } from '../layout/layout';
import { ProtectedRoute } from '../protected-route/ProtectedRoute';
import { initAuth } from '../../slices/userSlice';

const App = () => {
  /** TODO: взять переменные из стора */
  const isIngredientsLoading = false;
  const ingredients = [];
  const error = null;

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getIngredients());
    dispatch(initAuth());
  }, [dispatch]);

  return (
    <>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<ConstructorPage />} />
          <Route path='/feed' element={<Feed />} />
          <Route element={<ProtectedRoute onlyUnAuth />}>
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route path='/forgot-password' element={<ForgotPassword />} />
            <Route path='/reset-password' element={<ResetPassword />} />
            <Route path='/profile' element={<Profile />} />
            <Route path='/profile/orders' element={<ProfileOrders />} />
          </Route>
        </Route>
        <Route path='*' element={<NotFound404 />} />
      </Routes>

      <Routes>
        <Route
          path='/feed/:number'
          element={
            <Modal title='hz' onClose={() => {}}>
              <OrderInfo />
            </Modal>
          }
        />
        <Route
          path='/ingredients/:id'
          element={
            <Modal title='hz' onClose={() => {}}>
              <IngredientDetails />
            </Modal>
          }
        />
        <Route
          path='/profile/orders/:number'
          element={
            <Modal title='hz' onClose={() => {}}>
              <OrderInfo />
            </Modal>
          }
        />
      </Routes>
    </>

    //проверить все todo

    // <div className={styles.app}>
    //   <AppHeader />
    //   {isIngredientsLoading ? (
    //     <Preloader />
    //   ) : error ? (
    //     <div className={`${styles.error} text text_type_main-medium pt-4`}>
    //       {error}
    //     </div>
    //   ) : ingredients.length > 0 ? (
    //     <ConstructorPage />
    //   ) : (
    //     <div className={`${styles.title} text text_type_main-medium pt-4`}>
    //       Нет игредиентов
    //     </div>
    //   )}
    // </div>
  );
};

export default App;
