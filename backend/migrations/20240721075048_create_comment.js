/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
    return knex.schema.withSchema('public').createTable('comment', function(table) {
        table.increments('id', {
            primaryKey: true
        });
        table.string('comment').notNullable()
        table.integer('commentedby').notNullable()
        table.foreign('commentedby').references('id').inTable('users')
        table.integer('questionid').notNullable()
        table.foreign('questionid').references('id').inTable('question')
        table.timestamps(true, true)
    })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
    return knex.schema.withSchema('public').dropTable('comment')
}
