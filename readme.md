# Repositorio con las configs para Microservicios de ASP
## Larrosa-Settimo-Zawrzykraj


---
### Creacion de un Usuario Administrador y una nueva Organizacion.
![Admin user creation](https://github.com/ArqSoftPractica/Larrosa-Settimo-Zawrzykraj-Main/blob/master/images/RF1.gif "Admin user creation")

La creacion de un usuario administrador y una nueva organizacion involucra la coreografia de multiples microservicios.   
Al generarse la solicitud de creacion. El microservicio de usuarios realiza los chequeos correspondientes:   
    - Que el *body* de la solicitud tenga el formato correcto   
    - Que no exista previamente un usuario con el mismo email como el del usuario que se esta queriendo crear.   
Luego por comunicacion **sincronica** el microservicio de usuarios solicita al microservicio de Organizaciones la creacion de una organizacion.   
Este microservicio realiza las siguientes verificaciones:   
    - Comprueba que no exista una organizacion previamente creada con el mismo nombre.   
Si todo es correcto, el microservicio de organizaciones crea la nueva organizacion y luego:   
    - Emite un mensaje **asincrono** para que otros microservicios que lo necesiten puedan consumir la nueva organizacion creada   
    - Responde de forma **sincrona** al microservicio de usuarios la correcta creacion de la organizacion.   
Con la respuesta del microservicio de organizaciones, el servicio de usuarios crea el usuario y luego:   
      - Emite un mensaje **asincrono** para que otros microservicios que lo necesiten puedan consumir el nuevo usuario creado.   
      - Responde al cliente que el usuario y la organizacion se crearon correctamente.   
   
#### Los microservicios que consumen los mensajes asincronos de este caso de uso son:   
  - El microservicio de **BUGS**, para llevar una copia local de los IDs de los usuarios creados.   
  - El microservicio de **REPORTES**, para tener una copia de usuarios que existen en el sistema a fin de generar los reportes solicitados.   
  - El microservicio de **COSTOS**, para llevar la cuenta de cuantos usuarios fueron creados en el sistema y así cobrar por el uso del sistema.   
   
---   
   
### Invitacion de un Usuario a una Organizacion
![Create invitation](https://github.com/ArqSoftPractica/Larrosa-Settimo-Zawrzykraj-Main/blob/master/images/RF2Invite.gif "Create invitation")

La invitación de un usuario para una organización existente involucra al microservicio de usuarios y al servicio que envía los correos electrónicos.   
Al generarse una solicitud de creación de una invitación. El microservicio de usuarios realiza los siguientes chequeos:   
    - Que el *body* de la solicitud tenga el formato correcto.   
    - Que el rol del usuario que invita sea de administrador.   
    - Que el usuario ya no exista dentro en el sistema.   
Si todo es correcto, el servicio de usuarios crea la invitación y luego:   
      - Emite un mensaje **asincrono** para que que el servicio de envío de correos electrónicos despache el email.    
      - Responde al cliente que la invitación se creó correctamente.   

#### Los microservicios que consumen los mensajes asincronos de este caso de uso son:   
  - El microservicio de **MAIL SERVER**, para poder enviar mediante *SMTP* el correo electrónico.   

---

### Aceptar una Invitacion y crear el usuario.
![Confirm invitation and create user](https://github.com/ArqSoftPractica/Larrosa-Settimo-Zawrzykraj-Main/blob/master/images/RF2Create.gif "Confirm invitation and create user")

La creacion de un usuario a partir de una invitacion involucra al microservicio de usuarios.   
Una vez que el usuario hace click en la invitacion que le llego por correo. El microservicio de usuarios le retorna de forma **sincrona** al frontend los datos de la invitacion.   
    - Que la invitacion sigua siendo valida.   
    - El nombre de la organizacion a la cual se registrara.   
Cuando el usuario completa los datos correctos de la invitacion, el frontend envia la solicitud de creacion al backend para el que microservicio de usuarios cree la invitacion.   
El microservicio de usuarios verifica que:   
    - El *body* de la solicitud tenga el formato correcto.   
    - La invitacion no haya sido aceptada previamente.   
    - El email que envio el usuario coincida con el email registrado en la invitacion.   
Si todo es correcto, el microservicio de usuarios:   
    - Marca a esta invitacion como aceptada.   
    - Marca otras invitaciones que pueda tener ese usuario como denegadas.   
    - Confirma el usuario como creado en la base de datos.   
    - Responde al frontend como usuario creado.   
    - Genera un mensaje **asincrono** para que otros microservicios puedan consumir procesar el nuevo usuario.   
    - 
#### Los microservicios que consumen los mensajes asincronos de este caso de uso son:   
  - El microservicio de **BUGS**, para llevar una copia local de los IDs de los usuarios creados.   
  - El microservicio de **REPORTES**, para tener una copia de usuarios que existen en el sistema a fin de generar los reportes solicitados.   
  - El microservicio de **COSTOS**, para llevar la cuenta de cuantos usuarios fueron creados en el sistema y así cobrar por el uso del sistema.

---

### Autenticacion por token.
![Authentication](https://github.com/ArqSoftPractica/Larrosa-Settimo-Zawrzykraj-Main/blob/master/images/RF3.gif "Authentication")

El esquema de autenticacion que adoptamos fue el del uso de una arquitectura de identidad federada.   
El microservicio de usuarios es quien autenticara a los usuario, por su email y contrasenia y asi generar los tokens de sesion. Este actuara como identidad federada de todo el sistema.       
Para cada request que se requiera autenticacion (en cualquier microservicio). Se realiza una comprobacion del token enviado por el usuario.   
Para el primer request de un usuario hacia cualquier microservicio que requiera autentication:   
    - Serealiza una consulta **sincrona** hacia el endpoint de verificacion de tokens del microservicio de usuarios.    
    - El microservicio de usuarios responde con los datos del usuario, incluido su rol para que se verifique el acceso por roles.   
    - El microservicio que realizo la consulta de validacion del token guarda en su cache el estado del token para futuros requests que ocurran con el mismo token de usuario.   
Para los siguientes requests del usuario con el mismo token:   
    -El microservicio utiliza los datos almacenados en su cache para validar al usuario.   

---

### Creacion de un ambiente.
![Environment creation](https://github.com/ArqSoftPractica/Larrosa-Settimo-Zawrzykraj-Main/blob/master/images/RF4.gif "Environment creation")

La creacion de un ambiente se realiza por el microservicio de organizaciones.
Al generarse la solicitud de creacion. El microservicio de organizaciones realiza los chequeos correspondientes:   
    - Que el *body* de la solicitud tenga el formato correcto.      
    - Que el rol del usuario sea administrador.   
    - Que no exista previamente un ambiente con el mismo nombre dentro de esa organizacion.   
Si todo es correcto, el microservicio de organizaciones
    - Crea el nuevo ambiente.
    - Emite un mensaje **asincrono** para que otros microservicios que lo necesiten puedan consumir los datos del nuevo ambiente creado.   
    - Retorna los datos del nuevo ambiente al usuario, entre ellos el datos de token de ambiente o `keyConnection`      
#### Los microservicios que consumen los mensajes asincronos de este caso de uso son:   
  - El microservicio de **BUGS**, para llevar una copia local de los IDs de los ambitentes creados.   

---

### Creacion de un Bug
![Bug creation](https://github.com/ArqSoftPractica/Larrosa-Settimo-Zawrzykraj-Main/blob/master/images/RF9.gif "Bug creation")

La creacion de un bug recorre varios procesos del microservicio de Bugs.
Al generarse la solicitud de creacion de bug. El microservicio de bugs, (proceso bugs-api) realiza los chequeos correspondientes:   
    - Que el *body* de la solicitud tenga el formato correcto.      \
Este proceso, encola el bug recibido en una cola de mensajes y retorna una respuesta 200 OK al cliente.   
El mensaje que se encola contine un bug en un estado previo a que este se valida y se persista. El mensaje se publica en el topico `bug.new`.   

Como siguiente paso. El proceso worker BugProcessor consume los mensajes con topico `bug.new` y:   
    - Realiza la insercion del bug en la base de datos.   
    - Emite un mensaje en el topico `bug.create` para que otros microservicios consuman el bug creado recientemente.   
#### Los microservicios que consumen los mensajes asincronos de este caso de uso son:   
  - El microservicio de **BUGS**, para almacenar los bugs en la base de datos.   
  - El microservicio de **COSTOS**, para llevar la cuenta de cuantos bugs fueron creados en la organización y así cobrar por el uso del sistema.   
  - El microservicio de **REPORTES**, para tener una copia los bugs que existen en el sistema a fin de generar los reportes solicitados.   

### Actualizacion de un Bug.
![Bug update](https://github.com/ArqSoftPractica/Larrosa-Settimo-Zawrzykraj-Main/blob/master/images/RF5.gif "Bug update")

La actualizacion de las propiedades de un bug, ya sea:   
    - La asignacion del bugs a un desarrollador.   
    - El cambio de su titulo, descripcion o severidad .   
    - El cambio de su estado, Abierto --> Cerrado, Cerrado --> Abierto   
Todas estos cambios de propiedades son manejados por la WebAPI del microservicio de bugs.   
Se verifica que el actor que realiza el cambio de propiedasdes tenga los permisos correctos para hacerlo mediante la comprobacion de su rol.   
Una vez creado un cambio en las propiedasdes de un bug. El microservicio emite un mensaje asíncrono `bug.update`. Así otros microservicios pueden consumir ese mensaje y realizar los cambios que necesiten.   
#### Los microservicios que consumen los mensajes asincronos de este caso de uso son:   
  - El microservicio de **REPORTES**, para llevar la cuenta de cómo se han modificado los bugs a fin de crear reportes actualizados a los usuarios
  - El microservicio de **NOTIFICACIONES**, con el fin de almacenar o despachar notificaciones inmediatas por correo a aquellos usuarios que lo hayan solicitado.   

---




## Rabbit Console

URL:  http://localhost:15672

```bash
admin:admin123 (admin account)
ops0:ops0 (msg producer account)
ops1:ops1 (msg consumer account)
```

## PG Admin

URL:  http://localhost:8080

```bash
user@user.com:postgres
```

Conexión pgadmin local con docker:

`Connection: postgres`

`Maintenance database: postgres`

`username: postgres`

## Postgres

```bash
DATABASE_USER=postgres
DATABASE_PASSWORD=centinelaDevPwd
DATABASE_NAME=Centinela
DATABASE_HOST=postgres
DATABASE_PORT=5432
```

## Logger

El logger se encuentra en la siguiente página https://www.npmjs.com/package/centinela-logger

## Instalación del logger

El log se encuentra en la siguiente página https://www.npmjs.com/package/centinela-logger

Se instala de la siguiente manera:

`npm install centinela-logger`
