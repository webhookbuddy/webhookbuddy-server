import * as yup from 'yup';
import { combineResolvers } from 'graphql-resolvers';
import { isAuthenticated, isEndpointAllowed } from './authorization';
import { findByUserEndpoint, insert } from '../models/forwardUrl';
import validate from './validate';

type AddForwardUrlInput = {
  endpointId: number;
  url: string;
};

export default {
  Query: {
    forwardUrls: combineResolvers(
      isAuthenticated,
      isEndpointAllowed,
      async (_, { endpointId }, { me }) =>
        await findByUserEndpoint(me.id, endpointId),
    ),
  },

  Mutation: {
    addForwardUrl: combineResolvers(
      isAuthenticated,
      isEndpointAllowed,
      validate(
        yup.object().shape({
          input: yup.object().shape({
            url: yup
              .string()
              .trim()
              .required('URL is required')
              .url('URL is invalid'),
          }),
        }),
      ),
      async (
        _,
        { input }: { input: AddForwardUrlInput },
        { me },
      ) => ({
        forwardUrl: await insert(input.endpointId, me.id, input.url),
      }),
    ),
  },
};
