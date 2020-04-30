import { ForbiddenError } from 'apollo-server';
import { skip } from 'graphql-resolvers';
import { any } from '../db';

export const isAuthenticated = (_, __, { me }) =>
  me ? skip : new ForbiddenError('Not authenticated.');

export const isEndpointAllowed = async (_, { id }, { me }) => {
  if (
    await any(
      `
      SELECT e.id
      FROM endpoints as e
        INNER JOIN user_endpoints as ue on ue.endpoint_id = e.id
      WHERE 
        e.id = $1
        AND
        ue.user_id = $2
    `,
      [id, me.id],
    )
  )
    return skip;
  else throw new ForbiddenError('Not allowed.');
};
