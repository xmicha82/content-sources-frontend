import { NotAuthorized } from '@redhat-cloud-services/frontend-components/NotAuthorized';
import { useEffect } from 'react';
import { withRouter } from 'react-router-dom';

const NoPermissionsPage = () => {
  useEffect(() => {
    insights?.chrome?.appAction?.('no-permissions');
  }, []);

  return <NotAuthorized serviceName='Sample app' />;
};

export default withRouter(NoPermissionsPage);
