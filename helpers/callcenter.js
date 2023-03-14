const {  Buttons , List} = require('whatsapp-web.js');

////////////////////////////////
// para enviar recordatorio al cliente 
////////////////////////////////////////////////////////////////
const recordatorio = (client , cita )=>{

    let mensaje = new Buttons(
        `Buenas tardes Sr/Sra. ${cita.cliente}
        ✅Su cita se encuentra reservada 
        🗓️ Día: ${cita.fecha}
        ⏰ Horario: ${cita.hora}hs
        📍 Taller: ${cita.ubicacion}
        Le esperamos ❗️ `, //button body 
                        [
                            {id: 'cancelAgenda', body:'❌ Cancelar!'},
                            {id: 'okAgenda', body:'✔️ Confirmar!'},
                        ],
                        ' 📆 AGENDA',
                        'Opciones: '
            );
    client.sendMessage( `595${cita.telefono}@c.us` , mensaje )
};

////////////////////////////////
// para resonder al cliente segun las opciones
////////////////////////////////////////////////////////////////

const respuestas = (client , msg , cita  )=>{

    //si responde con un botton 
    if(msg.type === 'buttons_response'){

        let res = '' 
        switch (msg.selectedButtonId) {
    
            //respueta cuando confirma agenda el cliente la cita 
            case 'okAgenda':
                let res =  
                `Buenas tardes Sr/Sra. ${msg._data.notifyName || 'Juan Perez'}
                ✅Su cita se encuentra CONFIRMADA!! 
                🗓️ Día: ${cita.fecha || '20/03/2023'} 
                ⏰ Horario: ${cita.hora || '09:30'}hs
                📍 Taller: ${cita.ubicacion || 'https://goo.gl/maps/KeDz5FATfjm3gLub9'}
                Le esperamos❗️`
                client.sendMessage(msg.from, res)
                break;
    
            //respuesta cuando cancela el cliente la cita 
            case 'cancelAgenda':
                let button = new Buttons(
                    `Lamentamos que su cita de servicio haya sido *cancelado* Sr/Sra. ${msg._data.notifyName}, si desea *RE-AGENDAR* indique en el boton mas abajo❗️ `, //button body 
                    [
                      {id: 'noReagendar', body:'❌ No!'},
                      {id: 'siReagendar', body:'✔️ Si!'},
                    ],
                    '📆 AGENDA CANCELADA !!',
                    'Opciones: '
                  ); 
                client.sendMessage(msg.from , button )
                break;
    
            //respuesta 
            case 'siReagendar':
    
                //consultar fechas disponibles para la agenda
                // api 
                ////////////////////////////////
                let diasDisponibles = new List(
                    " 👉🏻 Una vez que re-agende quedara automaticamente agendado❗️❗️", //cuerpo del mensaje 
                    "Ver Fechas", // texto del boton de la lista
                    [
                      {
                        title: "Fechas Disponibles", //titulo de la lista
                        rows: [ //opciones 
                          { id: "fecha1", title: "20/03/2023" },
                          { id: "fecha2", title: "21/03/2023" },
                          { id: "fecha3", title: "22/03/2023" },
                        ],
                      },
                    ],
                    "🗓️ Seleccione una fecha Disponible❗️❗️"
                  ); 
                  client.sendMessage(msg.from, diasDisponibles)
                break;
                
            //respuesta cuando cancela el cliente la cita 
            case 'noReagendar':
                res =  
                ` Sr/Sra. ${msg._data.notifyName}
                😔 Su cita se encuentra *CANCELADA*❗️❗️ 
                🗓️ Lamentamos que no haya podido re-agendar su cita 
                👨🏻‍💼 Un agente se pondra en contacto con usted para una mejor atencion gracias.
                Le esperamos❗️`
                client.sendMessage(msg.from, res)
                break;
    
            default:
                break;
        }
    }

    //cuando responde con el listado 
    if(msg.type === 'list_response'){

        ////////////////////////////////
        // aqui debemos recuperar hora disponibles 
        ////////////////////////////////

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
        }
        if( 'hora1 hora2 hora3'.includes(msg.selectedRowId)){
            hora = msg.body
            res =  
                `Sr/Sra. ${msg._data.notifyName}
                ✅Su cita se encuentra *RE-AGENDADA*❗️❗️ 
                🗓️ Día: *${fecha}* 
                ⏰ Horario: *${hora}hs*
                📍 Taller: ${cita.ubicacion}
                Le esperamos❗️`
            client.sendMessage(msg.from, res)
          }                
    }

}

module.exports = {recordatorio , respuestas}