import { FC, useCallback, useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useLocation, useNavigate } from 'react-router-dom';

import { Panel, Title, Input, Button } from '../../shared/components';
import { CenteredPage, GuestLayout } from '../../layouts';
import { EButtonVariant } from '../../shared/components/Button';
import { EAboutAppRoutes } from '../../shared/routes/interfaces/interfaces';
import localStorageManager from '../../shared/localStorage/localStorageManager';
import { AUTH_REFRESH_TOKEN } from '../../shared/hooks/userAuth/constants';

const LoginPage: FC = () => {
  const [login, setLogin] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogIn = useCallback(async () => {
    try {
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(
        auth,
        login,
        password
      );
      const user = userCredential.user;
      const userRefreshToken = user.refreshToken;

      localStorageManager.setValue(AUTH_REFRESH_TOKEN, userRefreshToken);

      navigate(location.state?.urlToGoAfter || EAboutAppRoutes.ABOUT_PAGE, {
        replace: true,
      });
    } catch (error) {
      console.log(error);
    }
  }, [login, password]);

  return (
    <GuestLayout>
      <CenteredPage>
        <Panel>
          <Title>Авторизация</Title>
          <form>
            <Input value={login} onChange={setLogin} label={'Логин'} />
            <Input
              label={'Пароль'}
              type={'password'}
              value={password}
              onChange={setPassword}
            />
          </form>
          <Button
            type="submit"
            variant={EButtonVariant.FILLED}
            onClick={handleLogIn}
          >
            Войти
          </Button>
        </Panel>
      </CenteredPage>
    </GuestLayout>
  );
};

export default LoginPage;
