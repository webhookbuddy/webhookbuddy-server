import db from '../db';
import * as yup from 'yup';
import { hashPassword } from '../services/password';
import { createToken } from '../services/authentication';

type RegisterInput = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export default {
  Query: {
    me: () => ({
      id: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      firstName: 'Lou',
      lastName: 'Ferigno',
      email: 'lou@email.com',
    }),
  },

  // validating with graphql-up-middleware: https://github.com/JCMais/graphql-yup-middleware
  // for examples, see Step 2: Adding the validation schema: https://itnext.io/graphql-mutation-arguments-validation-with-yup-using-graphql-middleware-645822fb748
  Mutation: {
    register: {
      validationSchema: yup.object().shape({
        input: yup.object().shape({
          firstName: yup
            .string()
            .trim()
            .required('First name is required'),
          lastName: yup
            .string()
            .trim()
            .required('Last name is required'),
          email: yup
            .string()
            .email('Email is invalid')
            .required('Email is required'),
          password: yup
            .string()
            .required('Password is required')
            .min(6, 'Password must be at least 6 characters'),
        }),
      }),
      resolve: async (
        _,
        { input }: { input: RegisterInput },
        { ipAddress }: { ipAddress: string },
      ) => {
        const {
          rows: existingUsers,
        } = await db.query('SELECT id FROM users WHERE email = $1', [
          input.email,
        ]);

        if (existingUsers.length)
          throw new Error('Email is already registered.');

        const hash = hashPassword(input.password);

        const { rows: newUsers } = await db.query(
          `
            INSERT INTO users
              (created_at, updated_at, first_name, last_name, email, password_hash, password_salt, last_ip_address, last_logged_in_at, last_activity_at)
            VALUES
              (current_timestamp, current_timestamp, $1, $2, $3, $4, $5, $6, current_timestamp, current_timestamp)
            RETURNING *
          `,
          [
            input.firstName,
            input.lastName,
            input.email,
            hash.hash,
            hash.salt,
            ipAddress,
          ],
        );

        if (newUsers.length === 0)
          throw new Error('Error creating user.');

        const newUser = newUsers[0];
        return {
          token: createToken(
            { id: newUser.id },
            process.env.JWT_SECRET,
            '60d',
          ),
        };
      },
    },
  },
};
