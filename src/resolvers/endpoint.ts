import * as yup from 'yup';
import { v4 as uuidv4 } from 'uuid';
import { findById, findByUserId, insert } from '../models/endpoint';
import { isAuthenticated, isEndpointAllowed } from './authorization';
import { combineResolvers } from 'graphql-resolvers';

type CreateEndpointInput = {
  name: string;
};

export default {
  Query: {
    endpoint: combineResolvers(
      isAuthenticated,
      isEndpointAllowed,
      async (_, { id }) => await findById(id),
    ),
    endpoints: combineResolvers(
      isAuthenticated,
      async (_, __, { me }) => await findByUserId(me.id),
    ),
  },

  Mutation: {
    createEndpoint: {
      // TODO: Not ideal. Validation runs before isAuthenticated. This could be a limitation of graphql-yup-middleware: https://github.com/JCMais/graphql-yup-middleware/issues/7
      validationSchema: yup.object().shape({
        input: yup.object().shape({
          name: yup.string().trim().required('Name is required'),
        }),
      }),
      resolve: combineResolvers(
        isAuthenticated,
        async (
          _,
          { input }: { input: CreateEndpointInput },
          { me },
        ) => ({
          endpoint: await insert(uuidv4(), input.name, me.id),
        }),
      ),
    },
  },

  Endpoint: {
    forwardUrls: async (endpoint, _, { me, loaders }) =>
      await loaders.forwardUrl.load({
        userId: me.id,
        endpointId: endpoint.id,
      }),
  },
};
