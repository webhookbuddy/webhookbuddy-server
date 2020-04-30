import { single, many } from '../db';
import { isAuthenticated, isEndpointAllowed } from './authorization';
import { combineResolvers } from 'graphql-resolvers';

export default {
  Query: {
    endpoint: combineResolvers(
      isAuthenticated,
      isEndpointAllowed,
      async (_, { id }) => {
        const endpoint = await single(
          `
            SELECT id, created_at, reference_id, name
            FROM endpoints
            WHERE id = $1
          `,
          [id],
        );

        return {
          id: endpoint.id,
          createdAt: endpoint.created_at,
          referenceId: endpoint.reference_id,
          name: endpoint.name,
        };
      },
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
