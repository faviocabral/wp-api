//conexion del orm 
const knex = require('knex')({
    client: 'mssql',
    connection: {
      host : '192.168.10.160',
      port : 1433,
      user : 'sa',
      password : 'Sqlservices*',
      database : 'control'
    }
  });
module.exports = knex 
