import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('users', (table) => {
    table.increments('id').primary(); 
    table.string('name', 100).notNullable(); 
    table.string('surname', 100).notNullable(); 
    table.string('email', 255).notNullable().unique();
    table.string('password').notNullable(); 
    table.timestamp('createdAt').defaultTo(knex.fn.now()); 
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('users'); 
}
