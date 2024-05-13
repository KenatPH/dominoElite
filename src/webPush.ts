
import config from "./config/config";
import * as webpush from 'web-push';
import SubscripcionesPush from "./models/subscripcionesPush.model";

webpush.setVapidDetails(
    'mailto:example@yourdomain.org',
    config.webpush.publicKey,
    config.webpush.privateKey
);

const WP = webpush

export default WP

// export class NotificacionPush{

//     subscripcion:any
//     payload = {
//             "notification": {
//                 "title": "Domino Elite",
//                 "body": "",
//                 "vibrate": [100, 50, 100],
//                 "image": "",
//                 "actions": [{
//                     /**"action": "explore",
//                     "title": "Go to the site"*/
//                 }]
//             }
//     }
//     userId = ''
//     tipo = ''

//     constructor(userId, tipo){
//         this.userId = userId
//         this.tipo= tipo
//         this.tipoNotificacion
//     }

//     getSubscripcion = async () =>{

//         const sub = await SubscripcionesPush.findOne({
//             where: { userId: this.userId }
//         })

//         if(sub){
//             this.subscripcion = JSON.parse(sub.subscription)
//         }


//     }


//     tipoNotificacion = ()=>{
//         switch (this.tipo) {
//             case 'invitacionTorneo':
//                 this.payload.notification.body = "Usted a Sido invidado a torneo"
             
//                 break;
        
//             default:
//                 break;
//         }
//     }


//     enviarNotificacion = ()=>{

//         webpush.sendNotification(
//             this.subscripcion,
//             JSON.stringify(this.payload))
//             .then(res => {
//                 console.log('Enviado !!');
//             }).catch(err => {
//                 console.log('Error', err);
//             })


//     }


// }

