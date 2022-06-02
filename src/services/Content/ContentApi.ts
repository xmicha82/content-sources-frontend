import axios from 'axios';

export interface ContentItem {
    uuid: string;
    name: string;
    url: string;
    distribution_version: string;
    distribution_arch: string;
    account_id: string;
    org_id: string;
}

export type ContentList = Array<ContentItem>;

export type Links = {
    first: string;
    last: string;
    next: string;
}

export type Meta = {
    count: number;
    limit: number;
    offset: number;
}

export interface ContentListResponse {
    data: ContentList;
    links: Links;
    meta: Meta;
}

export const getContentList: () => Promise<ContentListResponse> = async () => {
    const { data } = await axios.get('/api/content_sources/v1/repositories/');
    return data;
};

