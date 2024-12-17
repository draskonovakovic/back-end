import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('invitations', (table) => {
    table.increments('id').primary(); 
    table
      .integer('event_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('events') 
      .onDelete('CASCADE'); 
    table
      .integer('user_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('users') 
      .onDelete('CASCADE'); 
    table.enum('status', ['pending', 'accepted', 'declined']).notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('invitations'); 
}
