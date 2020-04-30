import { query } from '../db';
import { isAuthenticated, isEndpointAllowed } from './authorization';
import { combineResolvers } from 'graphql-resolvers';

export default {
  Query: {
    endpoint: combineResolvers(
      isAuthenticated,
      isEndpointAllowed,
      async (_, { id }) => {
        const { rows } = await query(
          `
            SELECT id, created_at, reference_id, name
            FROM endpoints
            WHERE id = $1
          `,
          [id],
        );

        return {
          id: rows[0].id,
          createdAt: rows[0].created_at,
          referenceId: rows[0].reference_id,
          name: rows[0].name,
        };
      },
    ),
  },

  Mutation: {},

  Endpoint: {
    forwardUrls: async (endpoint, _, { me }) => {
      const { rows } = await query(
        `
          SELECT id, url
          FROM forward_urls
          WHERE 
            endpoint_id = $1
            AND 
            user_id = $2
        `,
        [endpoint.id, me.id],
      );

      return rows;
    },
  },
};
