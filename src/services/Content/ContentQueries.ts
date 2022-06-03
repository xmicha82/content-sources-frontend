import { QueryClient, useMutation, useQuery } from 'react-query';

import { ApiQueryOptions } from '../queryHelpers';
import { ContentListResponse, deleteContentListItem, getContentList } from './ContentApi';

export const useContentListQuery = (options?: ApiQueryOptions<ContentListResponse>) =>
    useQuery<ContentListResponse>(
        'ContentList',
        getContentList,
        options
    );

export const useDeleteContentItemMutate = (queryClient: QueryClient) =>
    useMutation(deleteContentListItem, {
        onMutate: async (uuid: string) => {
            // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
            await queryClient.cancelQueries('ContentList');
            // Snapshot the previous value
            const previousData: Partial<ContentListResponse> = queryClient.getQueryData('ContentList') || {};

            // Optimistically update to the new value
            queryClient.setQueryData('ContentList', (old: Partial<ContentListResponse> = {}) =>
                ({ ...old, data: old.data?.filter(data => uuid !== data.uuid) }));

            // Return a context object with the snapshotted value
            return { previousData };
        },
        // Always refetch after error or success:
        onSettled: () => {
            queryClient.invalidateQueries('ContentList');
        },
        // If the mutation fails, use the context returned from onMutate to roll back
        onError: (_err, _newCustomer, context) => {
            if (context) {
                const { previousData } = context as { previousData: ContentListResponse };
                queryClient.setQueryData('ContentList', previousData);
            }
        }
    });
