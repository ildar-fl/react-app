import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useMemo } from 'react';

import localStorageManager from '../../localStorage/localStorageManager';
import { publicRoutes, routes } from '../../routes';

import { AUTH_REFRESH_TOKEN } from './constants';

export const useCheckUserAuth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const refreshToken = localStorageManager.getValue(AUTH_REFRESH_TOKEN);

  const isPublicRoute = useMemo(
    () => publicRoutes.some((route) => route === location.pathname),
    [location]
  );

  useEffect(() => {
    if (isPublicRoute) {
      return;
    }

    if (refreshToken) {
      return;
    }

    if (!refreshToken) {
      console.log('we go after login to:', {
        urlToGoAfter: location.pathname,
      });

      navigate(routes.login.loginPage, {
        state: {
          urlToGoAfter: location.pathname,
        },
      });
    }
  }, [isPublicRoute, refreshToken, navigate, location.pathname]);
};
