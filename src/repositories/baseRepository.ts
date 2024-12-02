import db from '../config/db';
import { createError } from '../utilis/createError';

type TModel = {
  id: number;
};

export const baseRepository = <T extends TModel>(table: string) => ({
  async create(data: Omit<T, 'id'>): Promise<T> {
    try {
      const fields = Object.keys(data).join(', ');
      const values = Object.values(data);
      const placeholders = values.map((_, index) => `$${index + 1}`).join(', ');

      const query = `INSERT INTO ${table} (${fields}) VALUES (${placeholders}) RETURNING *`;
      const result = await db.query(query, values);

      return result.rows[0];
    } catch (error: any) {
      throw createError(`Error creating record in table "${table}": ${error}`, error.statusCode);
    }
  },

  async findById(id: number): Promise<T | null> {
    try {
      const query = `SELECT * FROM ${table} WHERE id = $1`;
      const result = await db.query(query, [id]);

      return result.rows[0] || null;
    } catch (error: any) {
      throw createError(`Error finding record by ID in table "${table}": ${error}`, error.statusCode);
    }
  },

  async update(id: number, data: Partial<T>): Promise<T | null> {
    try {
      const fields = Object.keys(data).map((key, index) => `${key} = $${index + 1}`).join(', ');
      const values = Object.values(data);
      const query = `UPDATE ${table} SET ${fields} WHERE id = $${values.length + 1} RETURNING *`;

      const result = await db.query(query, [...values, id]);
      return result.rows[0] || null;
    } catch (error: any) {
      throw createError(`Error updating record in table "${table}": ${error}`, error.statusCode);
    }
  },

  async delete(id: number): Promise<boolean> {
    try {
      const query = `DELETE FROM ${table} WHERE id = $1 RETURNING id`;
      const result = await db.query(query, [id]);

      return result.rows.length > 0;
    } catch (error: any) {
      throw createError(`Error deleting record in table "${table}": ${error}`, error.statusCode);
    }
  },

  async findAll(): Promise<T[]> {
    try {
      const query = `SELECT * FROM ${table}`;
      const result = await db.query(query);

      return result.rows;
    } catch (error: any) {
      throw createError(`Error retrieving all records from table "${table}": ${error}`, error.statusCode);
    }
  },
});
