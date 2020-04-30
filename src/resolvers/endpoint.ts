import { findById } from '../models/endpoint';
import { findByUserEndpoint } from '../models/forwardUrls';
import { isAuthenticated, isEndpointAllowed } from './authorization';
import { combineResolvers } from 'graphql-resolvers';

export default {
  Query: {
    endpoint: combineResolvers(
      isAuthenticated,
      isEndpointAllowed,
      async (_, { id }) => await findById(id),
    ),
  },

  Mutation: {},

  Endpoint: {
    forwardUrls: async (endpoint, _, { me }) =>
      await findByUserEndpoint(me.id, endpoint.id),
  },
};
