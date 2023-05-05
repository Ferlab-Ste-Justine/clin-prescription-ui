import React from 'react';
import { Route, RouteProps } from 'react-router-dom';
import { useKeycloak } from '@react-keycloak/web';

import LoginWrapper from 'components/LoginWrapper';
import Forbidden from 'components/Results/Forbidden';
import { Roles, validate } from 'components/Roles/Rules';
import Spinner from 'components/uiKit/Spinner';
import ConditionalWrapper from 'components/utils/ConditionalWrapper';
import { useRpt } from 'hooks/useRpt';
import { useUser } from 'store/user';

type OwnProps = Omit<RouteProps, 'component' | 'render' | 'children'> & {
  layout?: (children: any) => React.ReactElement;
  roles?: Roles[];
  children: React.ReactNode;
};

const ProtectedRoute = ({ roles, children, layout, ...routeProps }: OwnProps) => {
  const { keycloak, initialized } = useKeycloak();
  const RouteLayout = layout!;
  const keycloakIsReady = keycloak && initialized;
  const showLogin = keycloakIsReady && !keycloak.authenticated;
  const { user } = useUser();
  // eslint-disable-next-line react-hooks/rules-of-hooks

  if (showLogin) {
    return <LoginWrapper Component={<Spinner size={'large'} />} />;
  }

  const { decodedRpt } = useRpt();

  if (!keycloakIsReady || user.practitionerRoles.length === 0) {
    return <Spinner size={'large'} />;
  }

  const code = !!user.practitionerRoles?.find(
    (role) =>
      !!role.code?.find(
        (code) =>
          !!code.coding?.find((coding) => coding.code === '405277009' || coding.code === 'doctor'),
      ),
  );

  if ((roles && decodedRpt && !validate(roles, decodedRpt, false)) || !code) {
    children = <Forbidden />;
  }

  return (
    <ConditionalWrapper
      condition={!!RouteLayout}
      wrapper={(children) => <RouteLayout>{children}</RouteLayout>}
    >
      <Route {...routeProps}>{children}</Route>
    </ConditionalWrapper>
  );
};

export default ProtectedRoute;
