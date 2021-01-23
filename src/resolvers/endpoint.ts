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
import { User } from '../models/user';

interface CreateEndpointInput {
  name: string;
}

interface DeleteEndpointInput {
  id: string;
}

export default {
  Query: {
    endpoint: combineResolvers(
      isAuthenticated,
      isEndpointAllowed,
      async (_, { id }: { id: string }) =>
        await findById(parseInt(id, 10)),
    ),
    endpoints: combineResolvers(
      isAuthenticated,
      async (_, __, { me }: { me: User }) =>
        await findByUserId(me.id),
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
        { me }: { me: User },
      ) => ({
        endpoint: await insert(uuidv4(), input.name, me.id),
      }),
    ),
    deleteEndpoint: combineResolvers(
      isAuthenticated,
      isEndpointAllowed,
      async (_, { input }: { input: DeleteEndpointInput }) => ({
        affectedRows: await deleteEndpoint(parseInt(input.id, 10)),
      }),
    ),
  },
};
