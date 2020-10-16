import * as Knex from "knex";


export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .createTable('task', table => {
      table.uuid('id').notNullable().unique();
      table.string('title').notNullable();
      table.text('description', 'longtext').defaultTo('');
    })
    .createTable('assigned', table => {
      table.uuid('id').notNullable().unique();
      table.uuid('taskId').references('id').inTable('task');
      table.uuid('userId').references('id').inTable('user');
    });
}


export async function down(knex: Knex): Promise<void> {
  return knex.schema
    .dropTableIfExists('assigned')
    .dropTableIfExists('task');
}

