import knex from "knex";

export async function clearDatabase(database) {
    // List of all your tables in the order that avoids foreign key constraints issues
    const tables = ['comment', 'answer', 'question', 'users'];

    // Truncate each table
    for (const table of tables) {
        await knex(database).table(table).del();
    }

    console.log('Database cleared');
}
