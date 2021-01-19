import { many, single } from '../db';

export interface User {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  firstName?: string;
  lastName?: string;
  email?: string;
  passwordHash?: string;
  passwordSalt?: string;
  lastLoggedInAt?: Date;
  loginCount: number;
  lastActivityAt?: Date;
  activityCount: number;
  lastIpAddress?: string;
}

const map = (entity): User | null =>
  entity === null
    ? null
    : {
        id: entity.id,
        createdAt: entity.created_at,
        updatedAt: entity.updated_at,
        firstName: entity.first_name,
        lastName: entity.last_name,
        email: entity.email,
        passwordHash: entity.password_hash,
        passwordSalt: entity.password_salt,
        lastLoggedInAt: entity.last_logged_in_at,
        loginCount: entity.login_count,
        lastActivityAt: entity.last_activity_at,
        activityCount: entity.activity_count,
        lastIpAddress: entity.last_ip_address,
      };

export const findById = async (id: number) =>
  map(await single(`SELECT * FROM users WHERE id = $1`, [id]));

export const findByIds = async (ids: number[]) => {
  const users = await many(
    `SELECT * FROM users WHERE id = ANY($1::int[])`,
    [ids],
  );

  return ids.map(id => map(users.find(user => user.id === id)));
};

export const findByEmail = async (email: string) =>
  map(await single(`SELECT * FROM users WHERE email = $1`, [email]));

export const insert = async (
  firstName: string,
  lastName: string,
  email: string,
  passwordHash: string,
  passwordSalt: string,
  ipAddress: string,
) =>
  map(
    await single(
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
        firstName,
        lastName,
        email,
        passwordHash,
        passwordSalt,
        ipAddress,
      ],
    ),
  );

export const updateActivity = async (
  id: number,
  ipAddress: string,
  incrementLogin: boolean,
  incrementActivity: boolean,
) =>
  map(
    await single(
      `
        UPDATE users
        SET
          ${
            incrementLogin
              ? 'last_logged_in_at = current_timestamp, login_count = login_count + 1, failed_login_attempts = 0,'
              : ''
          }
          ${
            incrementActivity
              ? 'last_activity_at = current_timestamp, activity_count = activity_count + 1,'
              : ''
          }
          last_ip_address = $1
        WHERE id = $2
        RETURNING *
      `,
      [ipAddress, id],
    ),
  );

export const incrementFailedLoginAttempts = async (id: number) =>
  map(
    await single(
      `
        UPDATE users
        SET failed_login_attempts = failed_login_attempts + 1
        WHERE id = $1
        RETURNING *
      `,
      [id],
    ),
  );
