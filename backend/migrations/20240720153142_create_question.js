/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
    return knex.schema.withSchema('public').createTable('question', function(table) {
        table.increments('id', {
            primaryKey: true
        });
        table.string('question').notNullable();
        table.integer('askedby').nullable();
        table.foreign('askedby').references('id').inTable('users')
        table.timestamps(true, true)
    });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
    return knex.schema.withSchema('public').dropTable('question');
}
