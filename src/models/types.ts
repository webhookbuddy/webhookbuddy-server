export type KeyValue = {
  key: string;
  value: string;
};

export type Page<T> = {
  nodes: T[];
  pageInfo: PageInfo;
};

export type PageInfo = {
  hasNextPage: boolean;
  endCursor?: number;
};
