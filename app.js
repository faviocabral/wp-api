const fs = require('fs')
const express = require('express')
const app = express()
const port = 5000
const qrcode = require('qrcode-terminal');
const { Client,LocalAuth , Buttons , List} = require('whatsapp-web.js');
const {moment } = require('moment');
var cors = require('cors')
var bodyParser = require('body-parser')

app.use(cors())

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

//helpers 
const agenda = require('./helpers/callcenter')
const servicio = require('./helpers/servicio')
const repuesto = require('./helpers/repuesto')
const rrhh = require('./helpers/rrhh')

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
    agenda.recordatorio(client, {fecha:'13/03/2023', hora:'09:30', ubicacion: 'https://goo.gl/maps/KeDz5FATfjm3gLub9', cliente: msg._data.notifyName || '' , telefono: msg.from })
  }

  //consulta rrhh
  if (msg.body.toLowerCase() == 'rrhh'){
    client.sendMessage( msg.from, `*RRHH CONSULTA NOMINAS*\n\n* Para buscar una nomina ingrese # mas el ci del empleado ej: #123456\n Gracias!` )
    //rrhh.verEmpleado(client , msg)
  }

  //listener 
  //agenda.consultarCitas()
  agenda.respuestas(client, msg )
  servicio.respuestaGarantia(client, msg )
  repuesto.respuesta(client, msg )

  const regexp = new RegExp('^#[0-9]+$') // si empieza con un hashtag verificamos
  if(regexp.test(msg.body.replace(' ', ''))){
    rrhh.respuesta(client, msg)
  }

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
  var datos = req.query // datos que vienen 
  let cita = {fecha:'13/03/2023', hora:'09:30', ubicacion: 'https://goo.gl/maps/KeDz5FATfjm3gLub9' , telefono: `595${datos.telefono}@c.us` || '595981302793@c.us' , cliente: datos.nombre || 'Favio Cabral'}
  agenda.recordatorio(client, cita )
})

app.post('/agenda', (req, res)=>{
  var datos = req.body // datos que vienen 
  //let cita = {fecha:'13/03/2023', hora:'09:30', ubicacion: 'https://goo.gl/maps/KeDz5FATfjm3gLub9' , telefono: `595${datos.telefono}@c.us` || '595981302793@c.us' , cliente: datos.nombre || 'Favio Cabral'}
  agenda.recordatorio(client, datos )
})



app.get('/verificar' , async (req, res)=>{
  var numero = req.query.numero
  console.log('nro para verificar ', numero)
  try {
    console.log('entro para verificar el nro...')
    const ischeck = await client.isRegisteredUser(`595${numero.slice(-9)}@c.us`)
    res.status(200).json({message: (ischeck )? 'si': 'no'})
  } catch (error) {
    console.log('hubo un error en la verificacion de nro' , error)
    res.status(400).json({message:'error' , error: error}) 
  }
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

app.get('/rrhh', async (req, res)=>{
  var documento = req.query.documento

  const lista = await rrhh.consultarLista(documento)
  res.status(200).json(lista)

})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})