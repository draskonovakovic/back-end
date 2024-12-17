import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('events', (table) => {
    table.increments('id').primary();
    table.string('title', 255).notNullable();
    table.text('description').notNullable(); 
    table.timestamp('date_time').notNullable(); 
    table.string('location').notNullable(); 
    table.string('type', 100).notNullable();
    table
      .integer('creator_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('users') 
      .onDelete('CASCADE'); 
    table.boolean('active').defaultTo(true);
    table.jsonb('notifications_sent').defaultTo('{}'); 
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('events'); 
}
