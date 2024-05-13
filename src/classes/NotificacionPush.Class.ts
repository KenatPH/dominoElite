import ColaNotificaciones from "../models/colaNotificaciones.model"
import SubscripcionesPush from "../models/subscripcionesPush.model"
import WP from "../webPush"

export class NotificacionPush {

    subscripcion: any
    payload = {
        "notification": {
            "title": "Domino Elite",
            "body": "",
            "vibrate": [100, 50, 100],
            "image": "",
            "actions": [{
                "action": "explore",
                "title": "Go to the site"
            }]
        }
    }
    userId = ''
    tipo = ''

    constructor(userId:string, tipo:string) {
        this.userId = userId
        this.tipo = tipo
        this.tipoNotificacion()
    }

    getSubscripcion = async () => {

        const sub = await SubscripcionesPush.findOne({
            where: { id: this.userId }
        })

        if (sub) {
            this.subscripcion = JSON.parse(sub.subscription)
        }


    }


    tipoNotificacion = () => {
        switch (this.tipo) {
            case 'invitacionTorneo':
                this.payload.notification.body = "Usted a Sido invidado a torneo"

                break;

            default:
                break;
        }
    }


    enviarNotificacion = async () => {

        await this.getSubscripcion()

        console.log(this.subscripcion);
        

        // WP.sendNotification(
        //     this.subscripcion,
        //     JSON.stringify(this.payload))
        //     .then(res => {
        //         console.log('Enviado !!');
        //     }).catch(err => {
        //         console.log('Error', err);
        //     })

        await ColaNotificaciones.create( { tipo: 'invitacionTorneo', userId: this.userId } )

    }


}
