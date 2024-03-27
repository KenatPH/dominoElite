import nmailer from 'nodemailer';
import config from "./config";

const path_confirm = config.MAIL.path_confirm;

let transporter = nmailer.createTransport({
   host  : "smtp.gmail.com",
   port  : 465,
   secure: true, //true for port 465, false for other ports
   auth  : {
      user  : config.MAIL.correo,
      pass  : config.MAIL.passw
   }
});

export const sendMail = async (email: string, subject: string, html: string) => {
   try {
      await transporter.sendMail({
         from     : `JLRAMIREZ <${config.MAIL.correo}>`,
         to       : email,
         subject,
         text     : "Buenas tardes estimado usuario,",
         html,
      });
   } catch (error) {
      console.log('No fue posible enviar email de confirmación, '+error)
   }
}

export const getTemplateHtml = (nombre: string, token: string) => {
   return `
      <div id="email__content">
         <img src="" alt="">
         <h2>Estimado usuario ${nombre}</h2>
         <p>Para confirmar tu cuenta ingresa al siguiente enlace</p>
         <a href="${path_confirm}?token=${token}">Confirmar cuenta</a>
      </div>
   `
}
