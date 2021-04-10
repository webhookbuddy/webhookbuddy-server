import * as yup from 'yup';
import { combineResolvers } from 'graphql-resolvers';
import { isAuthenticated, isEndpointAllowed } from './authorization';
import {
  findByUserEndpoint,
  insert,
  deleteForwardUrls,
} from '../models/forwardUrl';
import validate from './validate';
import { User } from '../models/user';

interface AddForwardUrlInput {
  endpointId: string;
  url: string;
}

interface DeleteForwardUrlInput {
  endpointId: string;
  url: string;
}

export default {
  Query: {
    forwardUrls: combineResolvers(
      isAuthenticated,
      isEndpointAllowed,
      async (
        _,
        { endpointId }: { endpointId: string },
        { me }: { me: User },
      ) => await findByUserEndpoint(me.id, parseInt(endpointId, 10)),
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
        { me }: { me: User },
      ) => ({
        forwardUrl: await insert(
          parseInt(input.endpointId, 10),
          me.id,
          input.url,
        ),
      }),
    ),

    deleteForwardUrls: combineResolvers(
      isAuthenticated,
      isEndpointAllowed,
      async (
        _,
        { input }: { input: DeleteForwardUrlInput },
        { me }: { me: User },
      ) => {
        const affectedRows = await deleteForwardUrls(
          me.id,
          parseInt(input.endpointId, 10),
          input.url,
        );

        return { affectedRows };
      },
    ),
  },
};
