import { Grid, Spinner } from '@patternfly/react-core';
import { ActionsColumn, Caption, IAction, TableComposable, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import { createUseStyles } from 'react-jss';
import { useQueryClient } from 'react-query';

import { ContentList } from '../../services/Content/ContentApi';
import { useContentListQuery, useDeleteContentItemMutate } from '../../services/Content/ContentQueries';

const useStyles = createUseStyles({
    invisible: {
        opacity: 0
    }
});

const ContentListTable = ()=> {
    const classes = useStyles();
    const queryClient = useQueryClient();
    const hasActionPermissions = true;

    const { isLoading, isFetching, data = { data: [] as ContentList }} = useContentListQuery();
    const { mutate, isLoading: isDeleting } = useDeleteContentItemMutate(queryClient);

    //Other update actions will be added to this later.
    const actionTakingPlace = isDeleting || isFetching;

    const rowActions = ({ uuid }:{uuid: string}): IAction[] => [
        {
            title: 'Delete',
            onClick: () => mutate(uuid)
        }
    ];

    const columnHeaders = [
        'Name',
        'Url',
        'Arch',
        'Version',
        'Account ID',
        'Org ID'
    ];

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
                        <Th>
                            <Spinner size="md" className={ actionTakingPlace ?   '' : classes.invisible }  />
                        </Th>
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
                    }) =>  (
                        <Tr key={ uuid }>
                            <Td>{name}</Td>
                            <Td>{url}</Td>
                            <Td>{distribution_arch}</Td>
                            <Td>{distribution_version}</Td>
                            <Td>{account_id}</Td>
                            <Td>{org_id}</Td>
                            <Td isActionCell>
                                {hasActionPermissions ? (
                                    <ActionsColumn items={ rowActions({ uuid }) } />
                                ) : null}
                            </Td>
                        </Tr>
                    ))}
                </Tbody>
            </TableComposable>
        </Grid >);
};

export default ContentListTable;
