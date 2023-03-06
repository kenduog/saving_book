import mysql from "mysql2/promise";

require("dotenv").config();

const host = process.env.DB_HOST;
const user = process.env.DB_USERNAME;
const database = process.env.DB_NAME;
const pool = mysql.createPool({
  host: host,
  user: user,
  database: database,
});

export default pool;
