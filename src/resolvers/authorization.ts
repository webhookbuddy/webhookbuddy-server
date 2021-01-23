import { AuthenticationError, ForbiddenError } from 'apollo-server';
import { skip } from 'graphql-resolvers';
import { isEndpointUser } from '../models/endpoint';
import { User } from '../models/user';
import { isWebhookUser } from '../models/webhook';

export const isAuthenticated = (_, __, { me }: { me: User }) =>
  me ? skip : new AuthenticationError('Not authenticated.');

export const isEndpointAllowed = async (
  _,
  args,
  { me }: { me: User },
) => {
  if (
    await isEndpointUser(
      args.id ??
        args.endpointId ??
        args.input?.id ??
        args.input?.endpointId,
      me.id,
    )
  )
    return skip;
  else throw new ForbiddenError('Not allowed.');
};

export const isWebhookAllowed = async (
  _,
  args,
  { me }: { me: User },
) => {
  if (
    await isWebhookUser(
      args.id ?? args.input?.webhookId ?? args.input?.id,
      me.id,
    )
  )
    return skip;
  else throw new ForbiddenError('Not allowed.');
};
