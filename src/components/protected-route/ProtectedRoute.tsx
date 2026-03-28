import { FC } from 'react';
import { useSelector } from '../../services/store';
import { selectIsAuth, selectIsAuthChecked } from '../../slices/userSlice';
import { Navigate, Outlet } from 'react-router-dom';
import { Preloader } from '@ui';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
};

export const ProtectedRoute: FC<ProtectedRouteProps> = ({
  onlyUnAuth = false
}) => {
  const isAuth = useSelector(selectIsAuth);
  const isAuthChecked = useSelector(selectIsAuthChecked);

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (isAuth && onlyUnAuth) {
    return <Navigate to='/' />;
  }

  if (!isAuth && !onlyUnAuth) {
    return <Navigate to='/login' />;
  }

  return <Outlet />;
};
