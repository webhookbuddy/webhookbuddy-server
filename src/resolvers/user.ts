import db from '../db';
import * as yup from 'yup';
import { AuthenticationError } from 'apollo-server-express';
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
    me: async (_, __, { me, ipAddress }) => {
      if (!me) throw new AuthenticationError('Not authenticated.');

      const { rows } = await db.query(
        `
        SELECT id, created_at, updated_at, first_name, last_name, email
        FROM users
        WHERE id = $1
      `,
        [me.id],
      );

      if (!rows.length)
        throw new AuthenticationError('User not found.');

      await db.query(
        `
        UPDATE users
        SET last_ip_address = $1, last_activity_at = current_timestamp
        WHERE id = $2;
      `,
        [ipAddress, me.id],
      );

      return {
        id: rows[0].id,
        createdAt: rows[0].created_at,
        updatedAt: rows[0].updated_at,
        firstName: rows[0].first_name,
        lastName: rows[0].last_name,
        email: rows[0].email,
      };
    },
  },

  // validating with graphql-up-middleware: https://github.com/JCMais/graphql-yup-middleware
  // for examples:
  // - see Step 2: Adding the validation schema: https://itnext.io/graphql-mutation-arguments-validation-with-yup-using-graphql-middleware-645822fb748
  // - https://github.com/jquense/yup#usage
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
