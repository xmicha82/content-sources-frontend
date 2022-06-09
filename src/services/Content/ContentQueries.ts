import { AlertVariant } from '@patternfly/react-core';
import { QueryClient, useMutation, useQuery } from 'react-query';

import { useNotification } from './../Notifications/Notifications';
import {
    ContentListResponse,
    deleteContentListItem,
    getContentList
} from './ContentApi';

export const CONTENT_LIST_KEY = 'CONTENT_LIST_KEY';

export const useContentListQuery = (page: number, limit: number) =>
    useQuery<ContentListResponse>(
        [ CONTENT_LIST_KEY, page, limit ],
        () => getContentList(page, limit),
        {
            keepPreviousData: true,
            staleTime: 20000,
            optimisticResults: true
        }
    );

export const useDeleteContentItemMutate = (
    queryClient: QueryClient,
    page: number,
    perPage: number
) => {
    const contentListKeyArray = [ CONTENT_LIST_KEY, page, perPage ];
    const { notify } = useNotification();
    return useMutation(deleteContentListItem, {
        onMutate: async (uuid: string) => {
            // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
            await queryClient.cancelQueries(contentListKeyArray);
            // Snapshot the previous value
            const previousData: Partial<ContentListResponse> =
        queryClient.getQueryData(contentListKeyArray) || {};

            // Optimistically update to the new value
            queryClient.setQueryData(contentListKeyArray, () => {
                return {
                    ...previousData,
                    data: previousData.data?.filter((data) => uuid !== data.uuid),
                    meta: previousData.meta
                        ? {
                            ...previousData.meta,
                            count: previousData.meta.count
                                ? previousData.meta.count - 1
                                : 1
                        }
                        : undefined
                };
            });
            // Return a context object with the snapshotted value
            return { previousData, queryClient };
        },
        onSuccess: (_data, _variables, context) => {
            // Update all of the existing calls "count" to prevent number jumping on pagination
            const { previousData } = context as {
        previousData: ContentListResponse;
      };
            queryClient.setQueriesData(CONTENT_LIST_KEY, (data: any = {}) => {
                if (data?.meta?.count) {
                    data.meta.count = previousData?.meta?.count - 1;
                }

                return data;
            });
            queryClient.invalidateQueries(CONTENT_LIST_KEY);
        },
        // If the mutation fails, use the context returned from onMutate to roll back
        onError: (err, _newData, context) => {
            if (context) {
                const { previousData } = context as {
          previousData: ContentListResponse;
        };
                queryClient.setQueryData(contentListKeyArray, previousData);
                const error = err as Error; // Forced Type
                notify({
                    variant: AlertVariant.danger,
                    title: 'Error deleting item from content list',
                    description: error?.message
                });
            }
        }
    });
};
