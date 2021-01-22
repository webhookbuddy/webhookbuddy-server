import { gql } from 'apollo-server-express';

import userSchema from './user';
import endpointSchema from './endpoint';
import webhookSchema from './webhook';
import forwardSchema from './forward';
import forwardUrlSchema from './forwardUrl';
import readSchema from './read';

const linkSchema = gql`
  scalar DateTime

  type Query {
    _: Boolean
  }

  type Mutation {
    _: Boolean
  }

  type Subscription {
    _: Boolean
  }

  type KeyValue {
    key: String!
    value: String
  }

  input KeyValueInput {
    key: String!
    value: String
  }

  type PageInfo {
    endCursor: Int
    hasNextPage: Boolean!
  }
`;

export default [
  linkSchema,
  userSchema,
  endpointSchema,
  webhookSchema,
  forwardSchema,
  forwardUrlSchema,
  readSchema,
];
