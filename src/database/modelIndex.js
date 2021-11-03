const { Pool } = require("pg");
require("dotenv/config");


const string = process.env.DATABASE_URL;

let connect = { connectionString: string, 
    ssl: { rejectUnauthorized: false } };

const pool = new Pool(connect);

module.exports = pool;
