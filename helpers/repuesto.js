const {  Buttons , List} = require('whatsapp-web.js');
//helpers 
const knex = require('../db/knex')

const sucursales = [
    {almacen: 'REGA', nombre: 'SUC KIA CENTRAL', ubicacion: 'https://goo.gl/maps/CKLtg6R61M63Z6EdA'},
    {almacen: 'MRABLOQ1', nombre: 'SUC KIA MRA', ubicacion: 'https://goo.gl/maps/CKLtg6R61M63Z6EdA'},
    {almacen: 'YYY', nombre: 'SUC ENCARNACION' , ubicacion:'https://goo.gl/maps/GWw619eqYPZog9Ms7'},
]

const consulta = (client, datos  )=>{

    let mensaje = new Buttons(
`Buenas Sr/Sra. ${datos.nombre || 'juan perez' }
✅Bienvenidos al area de repuestos Kia Paraguay, por favor indique que tipo consulta quiere realizar
*Estos son nuestros Locales Autorizados:*
📍 Local Kia Victoria: https://goo.gl/maps/aMg2Cn4o1Lkhabin8
📍 Local kia MRA: https://goo.gl/maps/SYFXr9bthiDoYUas9
Le esperamos❗️`, //button body 
                        [
                            {id: 'consultaCliente', body:'🚗 Particular!'},
                            {id: 'consultaAseguradora', body:'🚚 Aseguradora!'},
                        ],
                        '🔧REPUESTOS KIA PARAGUAY',
                        'Opciones: '
                    );
      client.sendMessage(datos.telefono , mensaje ) 
};

const respuesta = (client , msg )=>{
    //si responde con un botton 
    if(msg.type === 'buttons_response'){
        let res = ''
        switch (msg.selectedButtonId) {

            //consulta particular 
            case 'consultaCliente':
                res =  `Sr/Sra. ${msg._data.notifyName} para agilizar su pedido favor ingrese los ultimos 🔟 digitos del vin de su 🚗vehiculo ❗️❗️`
                client.sendMessage(msg.from, res)
                break;

            //consulta asguradora
            case 'consultaAseguradora':
                let mensaje = new Buttons(
                    `Sr/Sra. ${msg._data.notifyName} favor indique como quiere realizar la consulta:`, //button body 
                                    [
                                        {id: 'consultaVin', body:'🚗 VIN!'},
                                        {id: 'consultaItem', body:'🔖 ITEM!'},
                                        {id: 'consultaListaItem', body:'📋 LISTA ITEM!'},
                                    ],
                                    '🔧REPUESTOS KIA PARAGUAY',
                                    'Opciones: '
                                );
                  client.sendMessage(msg.from , mensaje )
                            break;
        
            //consulta por vin  
            case 'consultaVin':
                res =  `Sr/Sra. ${msg._data.notifyName} para agilizar su pedido favor ingrese los ultimos 🔟 digitos del vin de su 🚗vehiculo ❗️❗️`
                client.sendMessage(msg.from, res)
                break;

            //consulta por item 
            case 'consultaItem':
                res = new Buttons(
                    `Sr/Sra. ${msg._data.notifyName} por favor ingrese el codigo que quiere buscar, luego presione el boton *listo*, si quiere volvere a renviar el codigo presione *re-enviar*:`, //button body 
                                    [
                                        {id: 'reenviarItem', body:'❌ RE-ENVIAR!'},
                                        {id: 'buscarItem', body:'✔️ LISTO!'},
                                    ],
                                    '🔧REPUESTOS KIA PARAGUAY',
                                    'Opciones: '
                                );
                client.sendMessage(msg.from, res)
                break;

            //consulta por listado
            case 'buscarItem':
                client.getChatById(msg.from).then((chat)=>{
                    console.log(chat) 
                    chat.fetchMessages({limit: 3 }).then(async (msg)=>{
                      console.log(msg) 
                      console.log('este es el codigo que el cliente esta buscando ', msg[1].body)
                      await knex.select()
                      .from('vListaRepuesto_wp')
                      .where('codigo', msg[1].body)
                      .then((rows)=>{
                        console.log(res)
                        console.log(rows)
                        res = `📋 *DATOS DEL ARTICULO*\n` 
                        rows.forEach((item , index) => {
                            let ubicacion = sucursales.find(x => x.almacen === item.ubicacion )
                            res += `*#${index+1}*\n⚙️ *codigo:* ${item.codigo}\n🛒 *articulo:* ${item.articulo}\n📍 *ubicacion:* ${ubicacion.nombre}\n${ubicacion.ubicacion}\n📦 *saldo:* ${item.saldo}\n💰 *precio:* ${item.precio.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.') } GS\n\n`
                        });
                        client.sendMessage(msg[1].from, res)
                      })
                    })
                  })

                break;

            case 'reenviarItem':
                    res = new Buttons(
                    `Sr/Sra. ${msg._data.notifyName} por favor ingrese el codigo que quiere buscar, luego presione el boton *listo*, si quiere volvere a renviar el codigo presione *re-enviar*:`, //button body 
                                    [
                                        {id: 'reenviarItem', body:'❌ RE-ENVIAR!'},
                                        {id: 'buscarItem', body:'✔️ LISTO!'},
                                    ],
                                    '🔧REPUESTOS KIA PARAGUAY',
                                    'Opciones: '
                                );
                client.sendMessage(msg.from, res)
                break;

            //consulta por listado
            case 'consultaListaItem':
                res = new Buttons(
                    `Sr/Sra. ${msg._data.notifyName} por favor ingrese de una vez los codigos separados por coma que quiere buscar, luego presione el boton *listo*, si quiere volvere a renviar el codigo presione *re-enviar*:`, //button body 
                                    [
                                        {id: 'reenviarListadoItem', body:'❌ RE-ENVIAR!'},
                                        {id: 'buscarListadoItem', body:'✔️ LISTO!'},
                                    ],
                                    '🔧REPUESTOS KIA PARAGUAY',
                                    'Opciones: '
                                );
                client.sendMessage(msg.from, res)
                break;

            //consulta por listado
            case 'reenviarListadoItem':
                res = new Buttons(
                    `Sr/Sra. ${msg._data.notifyName} por favor ingrese de una vez los codigos separados por coma que quiere buscar, luego presione el boton *listo*, si quiere volvere a renviar el codigo presione *re-enviar*:`, //button body 
                                    [
                                        {id: 'reenviarListadoItem', body:'❌ RE-ENVIAR!'},
                                        {id: 'buscarListadoItem', body:'✔️ LISTO!'},
                                    ],
                                    '🔧REPUESTOS KIA PARAGUAY',
                                    'Opciones: '
                                );
                client.sendMessage(msg.from, res)
                break;
            //consulta por listado
            case 'buscarListadoItem':
                client.getChatById(msg.from).then((chat)=>{
                    console.log(chat) 
                    chat.fetchMessages({limit: 3 }).then(async (msg)=>{
                      console.log(msg) 
                      console.log('este es el codigo que el cliente esta buscando ', msg[1].body)
                      await knex.select()
                      .from('vListaRepuesto_wp')
                      .whereIn('codigo', msg[1].body.replace(' ', '').replace('\n', '').split(','))
                      .then((rows)=>{
                        res = `📋 *DATOS DEL ARTICULO*\n` 
                        rows.forEach((item , index) => {
                            let ubicacion = sucursales.find(x => x.almacen === item.ubicacion )
                            res += `*#${index+1}*\n⚙️ *codigo:* ${item.codigo}\n🛒 *articulo:* ${item.articulo}\n📍 *ubicacion:* ${ubicacion.nombre}\n${ubicacion.ubicacion}\n📦 *saldo:* ${item.saldo}\n💰 *precio:* ${item.precio.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.') } GS\n\n`
                        });
                        client.sendMessage(msg[1].from, res)
                      })
                    })
                  })

                break;

            default:
                break;
        }

    }

    if(msg.type === 'list_response'){

    }
}

module.exports = {consulta , respuesta }