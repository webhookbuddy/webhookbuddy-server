import { GraphQLDateTime } from 'graphql-iso-date';
import userResolvers from './user';
import endpointResolvers from './endpoint';
import webhookResolvers from './webhook';
import forwardResolvers from './forward';
import forwardUrlResolvers from './forwardUrl';

const customScalarResolver = {
  DateTime: GraphQLDateTime,
};

export default [
  customScalarResolver,
  userResolvers,
  endpointResolvers,
  webhookResolvers,
  forwardResolvers,
  forwardUrlResolvers,
];
