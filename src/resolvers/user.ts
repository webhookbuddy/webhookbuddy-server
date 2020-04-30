import db from '../db';
import * as yup from 'yup';
import { UserInputError } from 'apollo-server';
import { combineResolvers } from 'graphql-resolvers';
import { isAuthenticated } from './authorization';
import { hashPassword, verifyPassword } from '../services/password';
import { createToken } from '../services/authentication';
import { User } from '../types';

type RegisterInput = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

type LoginInput = {
  email: string;
  password: string;
};

export default {
  Query: {
    me: combineResolvers(
      isAuthenticated,
      async (_, __, { me }: { me: User }) => me,
    ),
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
            (
              created_at,
              updated_at,
              first_name,
              last_name,
              email,
              password_hash,
              password_salt,
              last_logged_in_at,
              login_count,
              last_activity_at,
              activity_count,
              last_ip_address
            )
            VALUES
            (
              current_timestamp,
              current_timestamp,
              $1,
              $2,
              $3,
              $4,
              $5,
              current_timestamp,
              1,
              current_timestamp,
              1,
              $6
            )
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
    login: {
      validationSchema: yup.object().shape({
        input: yup.object().shape({
          email: yup.string().trim().required('Email is required'),
          password: yup
            .string()
            .trim()
            .required('Password is required'),
        }),
      }),
      resolve: async (
        _,
        { input }: { input: LoginInput },
        { ipAddress }: { ipAddress: string },
      ) => {
        const { rows } = await db.query(
          `
          SELECT id, password_hash, password_salt
          FROM users
          WHERE email = $1
        `,
          [input.email],
        );

        if (!rows.length) throw new UserInputError('Invalid login.');

        if (
          !verifyPassword(
            input.password,
            rows[0].password_hash,
            rows[0].password_salt,
          )
        )
          throw new UserInputError('Invalid login.');

        await db.query(
          `
            UPDATE users
            SET
              last_logged_in_at = current_timestamp,
              login_count = login_count + 1,
              last_activity_at = current_timestamp,
              activity_count = activity_count + 1,
              last_ip_address = $1
            WHERE id = $2
          `,
          [ipAddress, rows[0].id],
        );

        return {
          token: createToken(
            { id: rows[0].id },
            process.env.JWT_SECRET,
            '60d',
          ),
        };
      },
    },
  },
};
