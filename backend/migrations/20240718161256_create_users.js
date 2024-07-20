/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema.withSchema('public').createTable('users', function(table) {
      table.increments('id', {
          primaryKey: true
      });
      table.string('firstname').notNullable();
      table.string('lastname').notNullable();
      table.string('email').unique().notNullable();
      table.string('password').notNullable();
    });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return knex.withSchema('public').dropTable('users')
}
