import * as yup from 'yup';
import { v4 as uuidv4 } from 'uuid';
import {
  findById,
  findByUserId,
  insert,
  deleteEndpoint,
} from '../models/endpoint';
import { isAuthenticated, isEndpointAllowed } from './authorization';
import validate from './validate';
import { combineResolvers } from 'graphql-resolvers';

type CreateEndpointInput = {
  name: string;
};

type DeleteEndpointInput = {
  id: number;
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
    createEndpoint: combineResolvers(
      isAuthenticated,
      validate(
        yup.object().shape({
          input: yup.object().shape({
            name: yup.string().trim().required('Name is required'),
          }),
        }),
      ),
      async (
        _,
        { input }: { input: CreateEndpointInput },
        { me },
      ) => ({
        endpoint: await insert(uuidv4(), input.name, me.id),
      }),
    ),
    deleteEndpoint: combineResolvers(
      isAuthenticated,
      isEndpointAllowed,
      async (_, { input }: { input: DeleteEndpointInput }) => ({
        affectedRows: await deleteEndpoint(input.id),
      }),
    ),
  },

  Endpoint: {
    forwardUrls: async (endpoint, _, { me, loaders }) =>
      await loaders.forwardUrl.load({
        userId: me.id,
        endpointId: endpoint.id,
      }),
  },
};
