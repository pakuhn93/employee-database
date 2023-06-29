const mysql = require('mysql2');

// creates a connection to my MySQL server
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'employees_db'
});

db.connect(function(err) {
    if (err) throw err;
});

module.exports = db;