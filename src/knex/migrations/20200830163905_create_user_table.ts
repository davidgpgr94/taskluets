import * as Knex from "knex";


export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('user', table => {
    table.uuid('id').notNullable().unique();
    table.string('login', 7).notNullable().unique();
    table.string('email').notNullable().unique();
    table.string('salt').notNullable();
    table.string('hashedPassword').notNullable();
    table.boolean('active').defaultTo(true).notNullable();
  });
}


export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('user');
}

