import knex from "knex";

export async function clearDatabase(database) {
    const tables = ['comment', 'answer', 'question', 'users'];
    for (const table of tables) {
        await knex(database).table(table).del();
    }
}
