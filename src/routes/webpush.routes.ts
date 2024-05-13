import { Router } from "express";
import { enviarNotificacion, suscribe } from "../controllers/webpush.controller";
const router = Router();


router.post('/subscribe', suscribe);
router.post('/enviar', enviarNotificacion)


export default router