import { BaseRepository } from './baseRepository';
import db from '../config/db';
import { User } from '../models/user';

export const createUserRepository = (): BaseRepository<User> => ({
  async create(user) {
    try {
      const query = `
        INSERT INTO users (name, surname, email, password, created_at)
        VALUES ($1, $2, $3, $4, $5) RETURNING *`;
      const params = [user.name, user.surname, user.email, user.password, new Date()];
      const result = await db.query(query, params);
      return result.rows[0];
    } catch (error: unknown) {
      if (isErrorWithMessage(error)) {
        console.error('Error creating user:', error);

        // Handling duplicate key error
        if (error.message.includes('duplicate key value violates unique constraint')) {
          // Return a custom error message with status code 409 (Conflict)
          return {
            success: false,
            status: 409,
            message: `Email ${user.email} is already in use. Please choose a different email.`,
          };
        }

        // Generic error message
        return {
          success: false,
          status: 500,
          message: `Unable to create user: ${error.message}`,
        };
      } else {
        console.error('Unknown error:', error);
        return {
          success: false,
          status: 500,
          message: 'An unknown error occurred.',
        };
      }
    }
  },

  async findById(id) {
    try {
      const result = await db.query('SELECT * FROM users WHERE id = $1', [id]);
      return result.rows[0] || null;
    } catch (error: unknown) {
      if (isErrorWithMessage(error)) {
        console.error('Error finding user by ID:', error);
        return {
          success: false,
          status: 500,
          message: `Unable to find user with ID ${id}: ${error.message}`,
        };
      } else {
        console.error('Unknown error:', error);
        return {
          success: false,
          status: 500,
          message: 'An unknown error occurred.',
        };
      }
    }
  },

  async findAll() {
    try {
      const result = await db.query('SELECT * FROM users');
      return result.rows; 
    } catch (error: unknown) {
      if (isErrorWithMessage(error)) {
        console.error('Error finding all users:', error);
        return []; 
      } else {
        console.error('Unknown error:', error);
        return []; 
      }
    }
  },

  async update(id, user) {
    try {
      const fields = Object.keys(user).map((key, index) => `${key} = $${index + 1}`).join(', ');
      const values = Object.values(user);
      const query = `UPDATE users SET ${fields} WHERE id = $${values.length + 1} RETURNING *`;
      const result = await db.query(query, [...values, id]);
      return result.rows[0] || null;
    } catch (error: unknown) {
      if (isErrorWithMessage(error)) {
        console.error('Error updating user:', error);
        return {
          success: false,
          status: 500,
          message: `Unable to update user with ID ${id}: ${error.message}`,
        };
      } else {
        console.error('Unknown error:', error);
        return {
          success: false,
          status: 500,
          message: 'An unknown error occurred.',
        };
      }
    }
  },

  async delete(id) {
    try {
      const result = await db.query('DELETE FROM users WHERE id = $1 RETURNING id', [id]);

      if (result.rowCount! > 0) {
        return true; 
      } else {
        return false; 
      }
    } catch (error: unknown) {
      if (isErrorWithMessage(error)) {
        console.error('Error deleting user:', error);
        return false; 
      } else {
        console.error('Unknown error:', error);
        return false; 
      }
    }
  },
});

function isErrorWithMessage(error: unknown): error is Error {
  return (error as Error).message !== undefined;
}
