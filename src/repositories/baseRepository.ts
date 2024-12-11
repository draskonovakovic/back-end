import db from '../config/db';
import { createError } from '../utilis/createError';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

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

      if (!result || !result.rows || !result.rows[0]) {
        throw createError(
          `Failed to create record in table "${table}". The database query did not return a valid result.`,
          500
        );
      }

      return result.rows[0];
    } catch (error: any) {
      const errorMessage = error?.message || 'Unknown error occurred while creating the record';
      throw createError(`Error creating record in table "${table}": ${errorMessage}`, 500);
    }
  },

  async findById(id: number): Promise<T | null> {
    try {
      const query = `SELECT * FROM ${table} WHERE id = $1`;
      const result = await db.query(query, [id]);
  
      if (!result || !result.rows || result.rows.length === 0) {
        throw createError(
          `Failed to find record by ID ${id} in table "${table}". The database query returned no result.`,
          404
        );
      }
  
      const row = result.rows[0];
      if (row.date_time) {
        row.date_time = dayjs.utc(row.date_time).tz('Europe/Belgrade').format(); // ili neka druga vremenska zona
      }
  
      return row || null;
    } catch (error: any) {
      const errorMessage = error?.message || 'Unknown error occurred while retrieving the record';
      throw createError(`Error finding record by ID in table "${table}": ${errorMessage}`, 500);
    }
  },

  async update(id: number, data: Partial<T>): Promise<T | null> {
    try {
      const fields = Object.keys(data).map((key, index) => `${key} = $${index + 1}`).join(', ');
      const values = Object.values(data);
      const query = `UPDATE ${table} SET ${fields} WHERE id = $${values.length + 1} RETURNING *`;

      const result = await db.query(query, [...values, id]);

      if (!result || !result.rows || !result.rows[0]) {
        throw createError(
          `Failed to update record with ID ${id} in table "${table}". The database query did not return a valid result.`,
          500
        );
      }

      return result.rows[0];
    } catch (error: any) {
      const errorMessage = error?.message || 'Unknown error occurred while updating the record';
      throw createError(`Error updating record in table "${table}": ${errorMessage}`, 500);
    }
  },

  async delete(id: number): Promise<number> {
    try {
      const query = `DELETE FROM ${table} WHERE id = $1 RETURNING id`;
      const result = await db.query(query, [id]);

      if (!result || !result.rows || result.rows.length === 0) {
        throw createError(
          `Failed to delete record with ID ${id} in table "${table}". The record may not exist.`,
          404
        );
      }

      return id;
    } catch (error: any) {
      const errorMessage = error?.message || 'Unknown error occurred while deleting the record';
      throw createError(`Error deleting record in table "${table}": ${errorMessage}`, 500);
    }
  },

  async findAll(): Promise<T[]> {
    try {
      const query = `SELECT * FROM ${table}`;
      const result = await db.query(query);

      if (!result || !result.rows) {
        throw createError(
          `Failed to retrieve records from table "${table}". The database query did not return a valid result.`,
          500
        );
      }

      return result.rows;
    } catch (error: any) {
      const errorMessage = error?.message || 'Unknown error occurred while retrieving records';
      throw createError(`Error retrieving all records from table "${table}": ${errorMessage}`, 500);
    }
  },
});