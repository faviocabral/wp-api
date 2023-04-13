//conexion del orm 
const knex_pg = require("knex")({
    client: 'pg',
    connection: {
      host : process.env.PG_HOST,
      //port : 5432,
      user : process.env.PG_USER,
      password : process.env.PG_PASSWORD,
      database : process.env.PG_DATABASE
    }
  });

module.exports = knex_pg