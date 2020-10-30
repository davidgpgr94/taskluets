import * as Knex from "knex";


export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable('task', table => {
    table.dateTime('startDate', { precision: 0 }).defaultTo(knex.fn.now(0));
    table.dateTime('dueDate', { precision: 0 }).nullable();
    table.enu('status', ['new', 'progress', 'rejected', 'feedback', 'closed'], { useNative: true, enumName: 'task_status' }).defaultTo('new').notNullable().index('task_status');
    table.timestamp('createdOn', { precision: 0 }).defaultTo(knex.fn.now(0));
    table.timestamp('updatedOn', { precision: 0 }).defaultTo(knex.fn.now(0));
  });
}


export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable('task', table => {
    table.dropColumn('startDate');
    table.dropColumn('dueDate');
    table.dropColumn('status');
    table.dropColumn('createdOn');
    table.dropColumn('updatedOn');
  });
}

