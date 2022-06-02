import { Main, PageHeader as _PageHeader, PageHeaderTitle } from '@redhat-cloud-services/frontend-components';
import { PageHeaderProps as _PageHeaderProps } from '@redhat-cloud-services/frontend-components/PageHeader/PageHeader';
import {  FunctionComponent, useEffect } from 'react';
import { ReactElement } from 'react';
import {  withRouter } from 'react-router-dom';

import ContentListTable from '../../components/ContentListTable/ContentListTable';

// Example of how to extend inaccurately typed imports
interface PageHeaderProps extends _PageHeaderProps {
  children?: ReactElement;
}

const PageHeader = _PageHeader as FunctionComponent<PageHeaderProps>;

const SamplePage = () => {
    useEffect(() => {
        insights?.chrome?.appAction?.('view-list-page');
    }, []);

    return (
        <>
            <PageHeader>
                <PageHeaderTitle title="Content Sources" />
            </PageHeader>
            <Main>
                <ContentListTable />
            </Main>
        </>
    );
};

export default withRouter(SamplePage);
