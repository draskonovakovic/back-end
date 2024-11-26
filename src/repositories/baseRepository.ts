import db from '../config/db';  

type TModel = {
  id: number;
};

export const baseRepository = {
  async create<T extends TModel>(table: string, data: Omit<T, 'id'>): Promise<T | null> {
    const fields = Object.keys(data).join(', ');
    const values = Object.values(data);
    const placeholders = values.map((_, index) => `$${index + 1}`).join(', ');
    
    const query = `INSERT INTO ${table} (${fields}) VALUES (${placeholders}) RETURNING *`;
    try {
      const result = await db.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Error creating record:', error);
      return null;
    }
  },

  async findById<T extends TModel>(table: string, id: number): Promise<T | null> {
    const query = `SELECT * FROM ${table} WHERE id = $1`;
    try {
      const result = await db.query(query, [id]);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error finding record by ID:', error);
      return null;
    }
  },

  async update<T extends TModel>(table: string, id: number, data: Partial<T>): Promise<T | null> {
    const fields = Object.keys(data).map((key, index) => `${key} = $${index + 1}`).join(', ');
    const values = Object.values(data);
    const query = `UPDATE ${table} SET ${fields} WHERE id = $${values.length + 1} RETURNING *`;
    
    try {
      const result = await db.query(query, [...values, id]);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error updating record:', error);
      return null;
    }
  },

  async delete(table: string, id: number): Promise<boolean> {
    const query = `DELETE FROM ${table} WHERE id = $1 RETURNING id`;
    try {
      const result = await db.query(query, [id]);
      return result.rowCount! > 0;
    } catch (error) {
      console.error('Error deleting record:', error);
      return false;
    }
  },

  async findAll<T extends TModel>(table: string): Promise<T[]> {
    const query = `SELECT * FROM ${table}`;
    try {
      const result = await db.query(query);
      return result.rows; 
    } catch (error) {
      console.error('Error fetching all records:', error);
      return []; 
    }
  },
};
