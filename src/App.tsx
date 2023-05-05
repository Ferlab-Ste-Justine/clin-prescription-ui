import { SyntheticEvent, useEffect, useRef } from 'react';
import intl from 'react-intl-universal';
import { useDispatch } from 'react-redux';
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  RouteChildrenProps,
  RouteComponentProps,
  Switch,
} from 'react-router-dom';
import Empty from '@ferlab/ui/core/components/Empty';
import loadable from '@loadable/component';
import { useKeycloak } from '@react-keycloak/web';
import { ConfigProvider } from 'antd';
import enUS from 'antd/lib/locale/en_US';
import frFR from 'antd/lib/locale/fr_FR';
import ProtectedRoute from 'ProtectedRoute';
import ContextProvider from 'providers/ContextProvider';
import ErrorPage from 'views/Error';

import ErrorBoundary from 'components/ErrorBoundary';
import PageLayout from 'components/Layout';
import { Roles } from 'components/Roles/Rules';
import Spinner from 'components/uiKit/Spinner';
import NotificationContextHolder from 'components/utils/GenericModal/NotificationContextHolder';
import { useLang } from 'store/global';
import { fetchFhirServiceRequestCodes } from 'store/global/thunks';
import { fetchConfig, fetchPractitionerRole } from 'store/user/thunks';
import { LANG } from 'utils/constants';
import ROUTES from 'utils/routes';
const loadableProps = { fallback: <Spinner size="large" /> };
import { logout } from 'auth/keycloak';
const PrescriptionEntity = loadable(() => import('views/Prescriptions/Entity'), loadableProps);
// const PrescriptionSearch = loadable(() => import('views/Prescriptions/Search'), loadableProps);
import { keycloakConfig } from 'utils/config';

const HomePage = loadable(() => import('views/Home'), loadableProps);
// window.onunload = function (e) {
//   e.preventDefault();
//   alert('logout onunload');
//   logout();
// };

const useUnload = (fn: () => void) => {
  const callback = useRef(fn);

  useEffect(() => {
    callback.current = fn;
  }, [fn]);

  useEffect(() => {
    const onUnload = callback.current;
    window.addEventListener('beforeunload', onUnload);
    return () => window.removeEventListener('beforeunload', onUnload);
  }, []);
};

const App = () => {
  const lang = useLang();
  const dispatch = useDispatch();
  // const params = useQueryParams();
  const { keycloak, initialized } = useKeycloak();
  const keycloakIsReady = keycloak && initialized;

  useEffect(() => {
    if (keycloakIsReady && keycloak.authenticated) {
      dispatch(fetchPractitionerRole());
      dispatch(fetchFhirServiceRequestCodes());
      dispatch(fetchConfig());

      // const sharedFilterId = params.get(SHARED_FILTER_ID_QUERY_PARAM_KEY);
      // if (sharedFilterId) {
      //   dispatch(fetchSharedSavedFilter(sharedFilterId));
      // }
    }
    // eslint-disable-next-line
  }, [keycloakIsReady, keycloak]);

  useUnload(() => {
    console.log('dismount logout');
    const httprequest = new XMLHttpRequest();
    const userid = keycloak.loadUserInfo();
    console.log(`${keycloakConfig.url}realms/clin/protocol/openid-connect/logout`);
    window.open(`${keycloakConfig.url}realms/clin/protocol/openid-connect/logout`);

    Promise.resolve(logout());

    httprequest.open(
      'GET',
      `${keycloakConfig.url}realms/clin/protocol/openid-connect/logout`,
      false,
    );
    httprequest.send();

    // fetch(`${keycloakConfig.url}realms/clin/protocol/openid-connect/logout`, {
    //   method: 'GET',
    // }).then((response: Response) => {
    //   console.log('response : ', response);
    // });
    // const redirect = {
    //   redirectUri: `${window.location.origin}/`,
    // };
    // Promise.resolve(keycloak.logout(redirect));
    // logout();
    keycloak.clearToken();
  });
  keycloak.loadUserInfo().then((res) => {
    // @ts-ignore
    window.user = res;
  });
  //@ts-ignore
  window.keycloak = keycloak;

  return (
    <ConfigProvider
      locale={lang === LANG.FR ? frFR : enUS}
      renderEmpty={() => <Empty imageType="grid" description={intl.get('no.data.available')} />}
    >
      <div className="App" id="appContainer">
        {keycloakIsReady ? (
          <Router>
            <Switch>
              <ProtectedRoute
                exact
                path={ROUTES.HOME}
                layout={PageLayout}
                roles={[Roles.Prescriber]}
              >
                <HomePage />
              </ProtectedRoute>
              <ProtectedRoute
                exact
                path={ROUTES.PRESCRIPTION_ENTITY}
                layout={PageLayout}
                roles={[Roles.Prescriber]}
              >
                {(
                  props: RouteChildrenProps<{
                    id: string;
                  }>,
                ) => <PrescriptionEntity prescriptionId={props.match?.params.id!} />}
              </ProtectedRoute>
              <Route
                path={ROUTES.ERROR_STATUS}
                render={(props: RouteComponentProps<{ status?: any }>) => (
                  <ErrorPage status={props.match.params.status} />
                )}
              />
              <Redirect from="*" to={ROUTES.HOME} />
            </Switch>
            <NotificationContextHolder />
          </Router>
        ) : (
          <Spinner size={'large'} />
        )}
      </div>
    </ConfigProvider>
  );
};

const EnhanceApp = () => (
  <ErrorBoundary>
    <ContextProvider>
      <App />
    </ContextProvider>
  </ErrorBoundary>
);

export default EnhanceApp;
