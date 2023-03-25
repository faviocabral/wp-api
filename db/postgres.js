//conexion del orm 
const knex_pg = require("knex")({
    client: 'pg',
    connection: {
      host : '192.168.10.54',
      //port : 5432,
      user : 'postgres',
      password : 'kernel1979',
      database : 'reservas_stellantis'
    }
  });

module.exports = knex_pg