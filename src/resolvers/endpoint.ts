import { many } from '../db';
import { findById } from '../models/endpoint';
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
      (
        await many(
          `
            SELECT id, url
            FROM forward_urls
            WHERE 
              endpoint_id = $1
              AND 
              user_id = $2
          `,
          [endpoint.id, me.id],
        )
      ).map(e => ({
        id: e.id,
        createdAt: e.created_at,
        referenceId: e.reference_id,
        name: e.name,
      })),
  },
};
