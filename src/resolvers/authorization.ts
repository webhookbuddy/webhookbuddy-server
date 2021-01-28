import { AuthenticationError, ForbiddenError } from 'apollo-server';
import { skip } from 'graphql-resolvers';
import { isEndpointUser } from '../models/endpoint';
import { User } from '../models/user';
import { isWebhookUser } from '../models/webhook';

export const isAuthenticated = (
  _: unknown,
  __: unknown,
  { me }: { me: User },
) => (me ? skip : new AuthenticationError('Not authenticated.'));

export const isEndpointAllowed = async (
  _: unknown,
  args: any,
  { me }: { me: User },
) => {
  const id: string | undefined =
    args.id ??
    args.endpointId ??
    args.input?.id ??
    args.input?.endpointId;

  if (!!id && (await isEndpointUser(parseInt(id, 10), me.id)))
    return skip;
  else throw new ForbiddenError('Not allowed.');
};

export const isWebhookAllowed = async (
  _: unknown,
  args: any,
  { me }: { me: User },
) => {
  const id: string | undefined =
    args.id ?? args.input?.webhookId ?? args.input?.id;

  if (!!id && (await isWebhookUser(parseInt(id, 10), me.id)))
    return skip;
  else throw new ForbiddenError('Not allowed.');
};
