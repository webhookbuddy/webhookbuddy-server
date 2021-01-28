import * as yup from 'yup';
import { skip } from 'graphql-resolvers';
import { UserInputError } from 'apollo-server';

const formatMessage = (errors: yup.ValidationError[]) =>
  !errors.length
    ? 'Error encountered.'
    : errors.length === 1
    ? `${errors[0]}.`
    : `${errors.length} Errors: ${errors
        .map((e, i) => `${i + 1}) ${e}.`)
        .join(' ')}`;

const validate = (schema: yup.AnyObjectSchema) => async (
  _: unknown,
  args: any,
) => {
  try {
    await schema.validate(args, {
      abortEarly: false,
    });
    return skip;
  } catch (error) {
    throw new UserInputError(formatMessage(error.errors));
  }
};

export default validate;
