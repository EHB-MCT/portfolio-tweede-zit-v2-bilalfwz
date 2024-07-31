import { config } from 'dotenv';
import knex from 'knex';
import {
    development,
    test
} from '../../knexfile.js'
config();

let database;
if (process.env.NODE_ENV === 'test'){
    database = knex(test);
} else {
    database = knex(development);
}

export default database;