export interface KeyValue {
  key: string;
  value: string;
}

export interface Page<T> {
  nodes: T[];
  pageInfo: PageInfo;
}

export interface PageInfo {
  hasNextPage: boolean;
  endCursor?: number;
}
