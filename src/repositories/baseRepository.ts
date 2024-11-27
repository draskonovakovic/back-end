import db from '../config/db';  

type TModel = {
  id: number;
};

export const baseRepository = <T extends TModel>(table: string) => ({
    async create(data: Omit<T, 'id'>): Promise<T> {
      const fields = Object.keys(data).join(', ');
      const values = Object.values(data);
      const placeholders = values.map((_, index) => `$${index + 1}`).join(', ');
  
      const query = `INSERT INTO ${table} (${fields}) VALUES (${placeholders}) RETURNING *`;
      const result = await db.query(query, values);
      return result.rows[0];
    },
  
    async findById(id: number): Promise<T | null> {
      const query = `SELECT * FROM ${table} WHERE id = $1`;
      const result = await db.query(query, [id]);
      return result.rows[0] || null;
    },
  
    async update(id: number, data: Partial<T>): Promise<T | null> {
      const fields = Object.keys(data).map((key, index) => `${key} = $${index + 1}`).join(', ');
      const values = Object.values(data);
      const query = `UPDATE ${table} SET ${fields} WHERE id = $${values.length + 1} RETURNING *`;
  
      const result = await db.query(query, [...values, id]);
      return result.rows[0] || null;
    },
  
    async delete(id: number): Promise<boolean> {
      const query = `DELETE FROM ${table} WHERE id = $1 RETURNING id`;
      const result = await db.query(query, [id]);
      return result.rows.length > 0;
    },
  
    async findAll(): Promise<T[]> {
      const query = `SELECT * FROM ${table}`;
      const result = await db.query(query);
      return result.rows;
    },
});
  
  