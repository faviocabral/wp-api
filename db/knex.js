//conexion del orm 
const knex = require("knex")({
    client: 'mssql',
    connection: {
      host : process.env.MSQL_HOST ,
      port : process.env.MSQL_PORT ,
      user : process.env.MSQL_USER,
      password : process.env.MSQL_PASSWORD,
      database : process.env.MSQL_DATABASE
    }
  });

module.exports = knex