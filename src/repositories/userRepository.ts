import { baseRepository } from './baseRepository';
import { User } from '../models/user';
import db from '../config/db';
import { createError } from '../utilis/createError';

export const userRepository = {
  ...baseRepository<User>('users'),

  async findUserByEmail(email: string): Promise<User | null> {
    try {
      const query = `SELECT * FROM users WHERE email = $1`;
      const result = await db.query(query, [email]);

      if (!result || result.rows.length === 0) {
        throw createError(
          `Failed to find record by email ${email} in table "users". The database query returned no result.`,
          404
        );
      }

      return result.rows[0];
    } catch (error: any) {
      const errorMessage = error?.message || 'Unknown error occurred while retrieving the record';
      throw createError(`Error finding record by email in table "users": ${errorMessage}`, 500);
    }
  },

  async updatePassword(userId: number, newPassword: string): Promise<void> {
    try {
      const query = `UPDATE users SET password = $1 WHERE id = $2 RETURNING id`;
      const result = await db.query(query, [newPassword, userId]);

      if (!result || result.rowCount === 0) {
        throw createError(
          `Failed to update password for user ID ${userId}. No rows were affected.`,
          404
        );
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Unknown error occurred while updating password';
      throw createError(`Error updating password for user ID ${userId}: ${errorMessage}`, 500);
    }
  }
};
