import React from 'react';
import { Redirect, Route, RouteProps } from 'react-router-dom';
import { useKeycloak } from '@react-keycloak/web';

import { Roles } from 'components/Roles/Rules';
import Spinner from 'components/uiKit/Spinner';
import { useUser } from 'store/user';
import { REDIRECT_URI_KEY } from 'utils/constants';
import { STATIC_ROUTES } from 'utils/routes';

import ProtectedRouteWrapper from './ProtectedRouteWrapper';

type OwnProps = Omit<RouteProps, 'component' | 'render' | 'children'> & {
  layout?: (children: any) => React.ReactElement;
  roles?: Roles[];
  children: React.ReactNode;
};

const ProtectedRoute = ({ roles, children, layout, ...routeProps }: OwnProps) => {
  const { keycloak, initialized } = useKeycloak();
  const keycloakIsReady = keycloak && initialized;
  const showLogin = keycloakIsReady && !keycloak.authenticated;
  const { user } = useUser();

  if (showLogin) {
    return (
      <Redirect
        to={{
          pathname: STATIC_ROUTES.LANDING,
          search: `${REDIRECT_URI_KEY}=${routeProps.location?.pathname}${routeProps.location?.search}`,
        }}
      />
    );
  }

  if (!keycloakIsReady || user.practitionerRoles.length === 0) {
    return <Spinner size={'large'} />;
  }

  return (
    <ProtectedRouteWrapper roles={roles} layout={layout} practitionerRoles={user.practitionerRoles}>
      <Route {...routeProps}>{children}</Route>
    </ProtectedRouteWrapper>
  );
};

export default ProtectedRoute;
