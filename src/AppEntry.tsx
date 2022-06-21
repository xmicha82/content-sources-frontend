import { getBaseName } from '@redhat-cloud-services/insights-common-typescript';
import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import * as Redux from 'redux';

import App from './App';
import { createStore, resetStore } from './store';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // TODO: Have a conversation about this
    },
  },
});

interface AppEntryProps {
  logger?: Redux.Middleware;
}

const AppEntry: React.FunctionComponent<AppEntryProps> = (props) => {
  const store = React.useMemo(() => {
    resetStore();
    if (props.logger) {
      return createStore(props.logger).store;
    } else {
      return createStore().store;
    }
  }, [props.logger]);

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <Router basename={getBaseName(window.location.pathname)}>
          <App />
        </Router>
      </QueryClientProvider>
    </Provider>
  );
};

export default AppEntry;
