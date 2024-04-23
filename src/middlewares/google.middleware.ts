import { use } from "passport"
import { OAuth2Strategy as GoogleStrategy }from "passport-google-oauth";

use(
    new GoogleStrategy(
        {
            clientID: 'TU_CLIENT_ID_DE_GOOGLE',
            clientSecret: 'TU_CLIENT_SECRET_DE_GOOGLE',
            callbackURL: '/auth/google/callback', // Define tu URL de redireccionamiento
        },
        (accessToken, refreshToken, profile, done) => {
            // Maneja la lógica de autenticación aquí
            // Puedes guardar los datos del usuario en tu base de datos o crear un nuevo registro de usuario
            // basado en la información del perfil de Google (profile.id, profile.displayName, etc.)
            // Llama a done() con el objeto de usuario o un error
        }
    )
);