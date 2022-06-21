import { Bullseye, Spinner } from '@patternfly/react-core';
import React, { Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import { ErrorPage } from './components/Error/ErrorPage';
import ContentPage from './pages/ContentPage/ContentPage';
import NoPermissionsPage from './pages/NoPermissionsPage/NoPermissionsPage';
import OopsPage from './pages/OopsPage/OopsPage';

interface Path {
  path: string;
  component: React.ComponentType;
}

export const pathRoutes: Path[] = [
  {
    path: '/content',
    component: ContentPage,
  },
  {
    path: '/oops',
    component: OopsPage,
  },
  {
    path: '/no-permissions',
    component: NoPermissionsPage,
  },
];

export const Routes = () => (
  <Suspense
    fallback={
      <Bullseye>
        <Spinner />
      </Bullseye>
    }
  >
    <Switch>
      {pathRoutes.map(({ path, component: Component }) => (
        <Route
          key={path}
          path={path}
          component={() => (
            <ErrorPage>
              <Component />
            </ErrorPage>
          )}
        />
      ))}
      <Route>
        <Redirect exact to='/content' />
      </Route>
    </Switch>
  </Suspense>
);
