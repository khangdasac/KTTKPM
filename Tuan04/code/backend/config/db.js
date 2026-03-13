const mariadb = require("mariadb");

const pool = mariadb.createPool({
    host: "localhost",
    user: "root",
    password: "123",
    database: "products_db",
    connectionLimit: 5
});

module.exports = pool;