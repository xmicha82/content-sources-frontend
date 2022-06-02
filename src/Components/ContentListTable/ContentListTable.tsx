import { Grid, Spinner } from '@patternfly/react-core';
import { Caption, TableComposable, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';

import { ContentList } from '../../services/Content/ContentApi';
import { useContentListQuery } from '../../services/Content/ContentQueries';

const ContentListTable = ()=> {
    const columnHeaders = [
        'Name',
        'Url',
        'Arch',
        'Version',
        'Account ID',
        'Org ID'
    ];
    const { isLoading, data = { data: [] as ContentList }} = useContentListQuery();
    if (isLoading) return <Spinner />;
    const { data: contentList } = data;
    return (
        <Grid>
            <TableComposable
                aria-label="content sources table"
                variant="compact"
                borders={ false }
            >
                <Caption>This is a list of your content sources</Caption>
                <Thead>
                    <Tr>
                        {columnHeaders.map(columnHeader =>
                            <Th key={ columnHeader }>{columnHeader}</Th>)}
                    </Tr>
                </Thead>
                <Tbody>
                    {contentList.map(({
                        uuid,
                        name,
                        url,
                        distribution_arch,
                        distribution_version,
                        account_id,
                        org_id
                    }) => (
                        <Tr key={ uuid }>
                            <Td> {name} </Td>
                            <Td> {url} </Td>
                            <Td> {distribution_version} </Td>
                            <Td> {distribution_arch} </Td>
                            <Td> {account_id} </Td>
                            <Td> {org_id} </Td>
                        </Tr>
                    ))}
                </Tbody>
            </TableComposable>
        </Grid >);
};

export default ContentListTable;
