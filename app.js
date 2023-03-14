const fs = require('fs')
const express = require('express')
const app = express()
const port = 5000
const qrcode = require('qrcode-terminal');
const { Client,LocalAuth , Buttons , List} = require('whatsapp-web.js');

//helpers 
const agenda = require('./helpers/callcenter')
const servicio = require('./helpers/servicio')
const repuesto = require('./helpers/repuesto')

let fecha ='', hora =''
// Use the saved values
const client = new Client({
	 authStrategy: new LocalAuth({ clientId: "bot-server" })

});
 
client.on('qr', (qr) => {
    // Generate and scan this code with your phone
    console.log('QR RECEIVED', qr);
	qrcode.generate(qr, {small: true});	
});

client.on('ready', () => {
    console.log('Client is ready!');

});

client.on('message', msg => {
  
	console.log(msg)

  //test respuesto... 
  if(msg.body.toLowerCase() == 'repuesto'){
    let datos = {nombre : msg._data.notifyName , telefono: msg.from }
    repuesto.consulta(client, datos )
  }


  //ejemplo de agenda... 
  if (msg.body.toLowerCase() == 'agenda') {
    agenda.recordatorio(client, msg, {fecha:'13/03/2023', hora:'09:30', ubicacion: 'https://goo.gl/maps/KeDz5FATfjm3gLub9' , telefono: msg.from.replace('@c.us', '') })
  }

  //listener 
  agenda.respuestas(client, msg )
  servicio.respuestaGarantia(client, msg )
  repuesto.respuesta(client, msg )

/*
    //si responde con un botton 
    if(msg.type === 'buttons_response'){

      if(msg.selectedButtonId === 'confirmaOt'){
        let res =  ` Sr/Sra. ${msg._data.notifyName} la 🔧OT esta ✔️confirmada❗️❗️`
        client.sendMessage(msg.from, res)
      }

      if(msg.selectedButtonId === 'cancelaOt'){
        let res =  ` Sr/Sra. ${msg._data.notifyName} la 🔧OT esta ❌cancelada❗️❗️`
        client.sendMessage(msg.from, res)
      }


      //si cancela agenda 
      if(msg.selectedButtonId === 'cancelAgenda'){ // CASO QUE CANCELE 
        let button = new Buttons(
          `Lamentamos que su cita de servicios haya sido cancelado Sr/Sra. ${msg._data.notifyName} si desea *re-agendar* indique en el boton mas abajo❗️ `, //button body 
          [
            {id: 'noReagendar', body:'❌ No!'},
            {id: 'siReagendar', body:'✔️ Si!'},
          ],
          '📆 AGENDA CANCELADA !!',
          'Opciones: '
        ); 
        client.sendMessage(msg.from , button )

      }else if(msg.selectedButtonId === 'okAgenda'){ //CASO QUE CONFIRME 
        let res =  
`Buenas tardes Sr/Sra. ${msg._data.notifyName}
✅Su cita se encuentra CONFIRMADA!! 
🗓️ Día: 03/03/2023 
⏰ Horario: 07:30hs
🚘🔧Taller: https://goo.gl/maps/KeDz5FATfjm3gLub9
Le esperamos❗️`
        client.sendMessage(msg.from, res)
      }else if(msg.selectedButtonId === 'siReagendar'){

        let diasDisponibles = new List(
          " 👉🏻 Una vez que re-agende quedara automaticamente agendado ❗️ ❗️ ", //cuerpo del mensaje 
          "Ver Fechas", // texto del boton de la lista
          [
            {
              title: "Fechas Disponibles", //titulo de la lista
              rows: [ //opciones 
                { id: "fecha1", title: "07/03/2023" },
                { id: "fecha2", title: "08/03/2023" },
                { id: "fecha3", title: "09/03/2023" },
              ],
            },
          ],
          "🗓️ Seleccione una fecha Disponible❗️❗️"
        ); 
        client.sendMessage(msg.from, diasDisponibles)

      }else if(msg.selectedButtonId === 'noReagendar'){
        let res =  
` Sr/Sra. ${msg._data.notifyName}
😔 Su cita se encuentra CANCELADA❗️❗️ 
🗓️ Lamentamos que no haya podido re-agendar su cita 
👨🏻‍💼 Un agente se pondra en contacto para mejor atencion 
Le esperamos❗️`
        client.sendMessage(msg.from, res)

      }
    }
    //cuando responde con el listado 
    if(msg.type === 'list_response'){
      if( 'fecha1 fecha2 fecha3'.includes(msg.selectedRowId)){
        fecha = msg.body
        let horasDisponibles = new List(
          " 👉🏻 Una vez que re-agende quedara automaticamente agendado❗️❗️ ", //cuerpo del mensaje 
          "Ver Horas", // texto del boton de la lista
          [
            {
              title: "Horas Disponibles", //titulo de la lista
              rows: [ //opciones 
                { id: "hora1", title: "08:00" },
                { id: "hora2", title: "09:30" },
                { id: "hora3", title: "10:00" },
              ],
            },
          ],
          `🗓️ Seleccione una hora Disponible de la fecha *${fecha}* ❗️❗️ `
        ); 
        client.sendMessage(msg.from, horasDisponibles)

      }else if( 'hora1 hora2 hora3'.includes(msg.selectedRowId)){
        hora = msg.body
        let res =  
`Sr/Sra. ${msg._data.notifyName}
✅Su cita se encuentra *RE-AGENDADA*❗️❗️ 
🗓️ Día: *${fecha}* 
⏰ Horario: *${hora}hs*
🚘🔧Taller: https://goo.gl/maps/KeDz5FATfjm3gLub9
Le esperamos❗️`
        client.sendMessage(msg.from, res)
      }
    }    
*/

});

client.initialize();

app.get('/', (req, res) => {   
  res.send('whatsapp api')
})

app.get('/garantia', (req, res) => {
  var datos = req.query
  let button = new Buttons(
    ` Sr/Sra. ${datos.nombre} Desea confirmar la orden de Garantia❗️`, //button body 
    [
      {id: 'cancelaOt', body:'❌ No!'},
      {id: 'confirmaOt', body:'✔️ Si!'},
    ],
    '🔧ORDEN GARANTIA !!',
    'Opciones: '
  ); 
  client.sendMessage( `595${datos.telefono}@c.us`, button )
  res.send('mensaje enviado')
})

app.get('/agenda', (req, res)=>{
  var datos = req.query

  let cita = {fecha:'13/03/2023', hora:'09:30', ubicacion: 'https://goo.gl/maps/KeDz5FATfjm3gLub9' , telefono: datos.telefono || '994086890' , cliente: datos.nombre || 'Luz Ortiz'}
  agenda.recordatorio(client, cita )

})

app.get('/repuesto', (req, res)=>{
  var {telefono, nombre} = req.query

  let datos = {nombre : nombre , telefono: '595'+telefono+'@c.us'  }
  repuesto.consulta(client, datos ) 

})

app.get('/chat', async (req, res)=>{
  var {telefono , limit } = req.query

  client.getChatById(`595${telefono}@c.us`).then((chat)=>{
    console.log(chat) 
    chat.fetchMessages({limit: limit}).then((msg)=>{
      console.log(msg) 
      res.status(200).json(msg)
    })
  })
  
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})