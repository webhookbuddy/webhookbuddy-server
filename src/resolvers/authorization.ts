import { ForbiddenError } from 'apollo-server';
import { skip } from 'graphql-resolvers';
import db from '../db';
import { User } from '../types';

export const isAuthenticated = (_, __, { me }: { me: User }) =>
  me ? skip : new ForbiddenError('Not authenticated.');

export const isEndpointAllowed = async (_, { id }, { me }) => {
  const { rows } = await db.query(
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
  );

  if (!rows.length) throw new ForbiddenError('Not allowed.');
  else return skip;
};
