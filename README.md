# API de Domino

Esta es una API para gestionar juegos de dominó.

## Instalación

1. Clona este repositorio.
2. Ejecuta `npm install` para instalar las dependencias.

## Uso

1. Ejecuta `npm start` para iniciar el servidor.
2. Accede a la API en `http://localhost:3000`.

## Endpoints

- `POST /auth/login`: Login del usuario para entrar a la página.
   Espera un json con los siguientes datos
      {
      "email":"gefiw43482@storesr.com",
      "clave":"123456"
      }
   Retorna un json con 
       {
         "data_send": {
            "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImVtYWlsIjoiZ2VmaXc0MzQ4MkBzdG9yZXNyLmNvbSIsImlkIjoiNjYwNDZhMjdiZmMzNjI2ZGE5YWZjMjI1Iiwibm9tYnJlIjoiUGVkcm8gSm9zw6kgTG9wZXoiLCJwZXJmaWwiOiJhdGxldGEifSwiaWF0IjoxNzExNTY3Mjk1LCJleHAiOjE3MTE1NzA4OTV9._RFionqVj2NAK7nozuAx16RbZcXtiOsDuvVcp9aDpgg",
            "nombre": "Pedro José Lopez",
            "telefono": "04122977680",
            "perfil": "atleta"
         },
         "num_status": 0,
         "msg_status": "Login successfully"
       }  
- `POST /auth/register`: Registra un usuario nuevo.
   Espera un json con los siguientes datos:
   -  {
      "nombre": "Pedro Aparicio Perez Hurtado",
      "email": "gefiw43481@storesr.com",
      "telefono": "0412-2977680", 
      "clave": "123456"
      }
- `POST /auth/modify-password`: Modifica el password del usuario por el email
   Espera un jeson con los siguientes datos
       {
         "email":"gefiw43481@storesr.com",
         "oldPassword":"123456",
         "newPassword":"123456789"
       }     

   Retorna: 
      {
         "data_send": "",
         "num_status": 0,
         "msg_status": "Password modified successfully"
      }    
- `GET /users`: Obtiene la lista de todos los usuarios.      
- `GET /user/{id}`: Obtiene los detalles de un usuario específico.
- `PUT /user/update/{id}`: Actualiza un usuario existente.
      Espera el id en la ruta
         user/update/660427df7cc1311e4a675261
      Retorna
         si el usuariono existe
         {
            "data_send": "",
            "num_status": 6,
            "msg_status": "User not found"
         }
         si el usuario existe y lo modifica
         {
            "data_send": {
               "nombre": "Pedro José Lopez",
               "email": "gefiw43481@storesr.com",
               "telefono": "04122977680",
               "perfil": "atleta",
               "estatus": "activo"
            },
            "num_status": 0,
            "msg_status": "User updated successfully"
         }
- `DELETE /user/delete/{id}`: Elimina un usuario de dominó.
      Espera el id en la ruta
         user/delete/660427df7cc1311e4a675261
      Retorna
         {
            "num_status": 0,
            "msg_status": "User deleted successfully"
         }  
## Contribución

Si quieres contribuir a este proyecto, por favor sigue los siguientes pasos:

1. Haz un fork de este repositorio.
2. Crea una rama con tu nueva funcionalidad (`git checkout -b feature/nueva-funcionalidad`).
3. Realiza tus cambios y haz commit (`git commit -m "Agrega nueva funcionalidad"`).
4. Haz push a la rama (`git push origin feature/nueva-funcionalidad`).
5. Abre un pull request en este repositorio.

## Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo [LICENSE](./LICENSE) para más detalles.