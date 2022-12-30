const mysql = require('knex')({
    client: 'mysql',
    connection: {
      host: process.env.MYSQL_HOST_IP,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
    }
});

module.exports = mysql;