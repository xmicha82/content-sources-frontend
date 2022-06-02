import { useQuery } from 'react-query';

import { ApiQueryOptions } from '../queryHelpers';
import { ContentListResponse, getContentList } from './ContentApi';

export const useContentListQuery = (options?: ApiQueryOptions<ContentListResponse>) =>
    useQuery<ContentListResponse>(
        'ContentList',
        getContentList,
        options
    );
