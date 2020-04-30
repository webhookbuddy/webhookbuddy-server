import { findById, findByUserId } from '../models/endpoint';
import { isAuthenticated, isEndpointAllowed } from './authorization';
import { combineResolvers } from 'graphql-resolvers';

export default {
  Query: {
    endpoint: combineResolvers(
      isAuthenticated,
      isEndpointAllowed,
      async (_, { id }) => await findById(id),
    ),
    endpoints: combineResolvers(
      isAuthenticated,
      async (_, __, { me }) => await findByUserId(me.id),
    ),
  },

  Mutation: {},

  Endpoint: {
    forwardUrls: async (endpoint, _, { me, loaders }) =>
      await loaders.forwardUrl.load({
        userId: me.id,
        endpointId: endpoint.id,
      }),
  },
};
