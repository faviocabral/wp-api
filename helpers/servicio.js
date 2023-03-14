const {  Buttons , List} = require('whatsapp-web.js');

const confirmarGarantia = (client , datos)=>{
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
}

const respuestaGarantia = (client , msg )=>{

  //cuando el cliente haya elegido 
  if(msg.type === 'buttons_response'){
    let res = ''
    //respuesta del cliente... 
    switch (msg.selectedButtonId) {

      //cuando confirma la ot 
      case 'confirmaOt':
        res =  `Sr/Sra. ${msg._data.notifyName} la 🔧OT esta ✔️confirmada❗️❗️`
        client.sendMessage(msg.from, res)
        break;

      //cuando confirma la ot 
      case 'cancelaOt':
        res =  `Sr/Sra. ${msg._data.notifyName} la 🔧OT esta ❌cancelada❗️❗️`
        client.sendMessage(msg.from, res)
        break;
    
      default:
        break;
    }
  }

}

module.exports = {confirmarGarantia , respuestaGarantia}