import { baseRepository } from './baseRepository';
import { User } from '../models/user';
import db from '../config/db';  

export const userRepository = {
  ...baseRepository,

  async findUserByEmail(email: string): Promise<User | null> {
    const query = `SELECT * FROM users WHERE email = $1`;
    try {
      const result = await db.query(query, [email]);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error finding user by email:', error);
      return null;
    }
  }
};
