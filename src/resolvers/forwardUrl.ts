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
            url: yup.string().trim().required('URL is required'), // don't add url validation b/c localhost isn't supported: https://github.com/jquense/yup/issues/800
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
