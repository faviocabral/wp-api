const {  Buttons , List} = require('whatsapp-web.js')
const knex = require('../db/knex')
var moment = require('moment'); // require

const verEmpleado = async(client , msg )=>{
    let mensaje = new Buttons(
        `Ingrese el documento del empleado:`, //button body 
                                [
                                    {id: 'buscar', body:'Buscar'},
                                ],
                                'RRHH CONSULTA EMPLEADO',
                                'Opciones: '
                            );
    client.sendMessage(msg.from , mensaje ) 
};

const consultarLista = async(documento) => {
    let list = []
    try {
      await knex
      .select("*")
      .from(process.env.TABLA_NOMINA)
      .where("codigo", documento)
      .then(rows => {
        //console.log(rows)
        list = rows 
      }); 
  
    } catch (error) {
      console.log('ocurrio un error en la consulta posgres ', error )
    }
    return list 
}

const respuesta = async(client , msg )=>{

    const lista = await consultarLista(msg.body.replace(' ', '').replace('#', '') )
    console.log(lista)
    
    if(lista.length > 0){
        res = `*RRHH CONSULTA NOMINAS*\n\n*CI: #${lista[0]['Codigo']}*\n*Apellido:* ${lista[0]['Apellidos']}\n*Nombre:* ${lista[0]['Nombres']}\n*Sucursal:* ${lista[0]['Sucursal']}\n`
        client.sendMessage(msg.from, res)

    }else{
        res = `*RRHH CONSULTA NOMINAS*\n\n*${msg.body}*\n No existe en la *Lista de Nominas*`
        client.sendMessage(msg.from, res)
    }

}

  
module.exports = {consultarLista, verEmpleado , respuesta }