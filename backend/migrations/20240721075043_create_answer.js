/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
    return knex.schema.withSchema('public').createTable('answer', function(table) {
        table.increments('id', {
            primaryKey: true
        })
        table.string('answer').notNullable()
        table.integer('questionid').notNullable()
        table.foreign('questionid').references('id').inTable('question')
        table.integer('answeredby').notNullable()
        table.foreign('answeredby').references('id').inTable('users')
        table.boolean('correct').defaultTo(false)
        table.timestamps(true, true)
    })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return knex.schema.withSchema('public').dropTable('answer');
}
