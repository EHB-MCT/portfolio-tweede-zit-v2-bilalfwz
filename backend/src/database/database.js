import { config } from 'dotenv';
import knex from 'knex';
config();

const database = knex({
    client: 'pg',
    connection: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        database: 'postgres',
        password: process.env.DB_PASSWORD
    }
});



export default database;