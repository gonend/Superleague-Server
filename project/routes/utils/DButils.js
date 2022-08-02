require("dotenv").config();
const sql = require("mssql");

const config = {
  user:tedious_userName,
  password:tedious_password,
  server:tedious_server,
  database:tedious_database,
  options: {
    encrypt: true,
    enableArithAbort: true
  }
};

const pool = new sql.ConnectionPool(config);
const poolConnect = pool.connect();

exports.execQuery = async function (query) {
  await poolConnect;
  try {
    var result = await pool.request().query(query);
    return result.recordset;
  } catch (err) {
    console.error("SQL error", err);
    throw err;
  }
};