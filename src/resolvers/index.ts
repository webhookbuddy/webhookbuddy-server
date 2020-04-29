import { GraphQLDateTime } from 'graphql-iso-date';
import userResolvers from './user';
import endpointResolvers from './endpoint';
import webhookResolvers from './webhook';

const customScalarResolver = {
  DateTime: GraphQLDateTime,
};

export default [
  customScalarResolver,
  userResolvers,
  endpointResolvers,
  webhookResolvers,
];
