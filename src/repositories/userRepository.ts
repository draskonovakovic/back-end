import { baseRepository } from './baseRepository';
import { User } from '../models/user';
import db from '../config/db';
import { createError } from '../utilis/createError';

export const userRepository = {
  ...baseRepository<User>('users'),

  async findUserByEmail(email: string): Promise<User | null> {
    try{
      const query = `SELECT * FROM users WHERE email = $1`;
      const result = await db.query(query, [email]);

      if (!result) {
        throw createError(
          `Failed to find record by email ${email} in table "users". The database query returned no result.`,
          404
        );
      }

      return result.rows[0] || null;
    } catch(error: any){
      const errorMessage = error?.message || 'Unknown error occurred while retrieving the record';
      throw createError(`Error finding record by email in table "users": ${errorMessage}`, 500);
    }
  }
};
