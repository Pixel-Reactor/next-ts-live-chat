import mysql from "mysql2/promise";

let connection: any;
console.log("from db ", process.env.DB_HOST,process.env.DB_PWD);
if (!connection) {
  connection = mysql.createPool({
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    host: process.env.DB_HOST,
    port: 3306,
    database: process.env.DB_DB,
  });
}
export { connection };
