# CursoAngular

# NOTAS IMPORTANTES

Configuración Inicial
=====================

Como este es un backend que se va a crear con node para crearlo debemos ejecutar los siguientes pasos:

1. El siguiente comando nos permite inicializar y crear de manera automática el archivo package.json

```
npm init -y
```

2. Posteriormente procedemos a instalar express usando el siguiente comando:

```
npm install express --save
```

El paquete express es la parte crucial para montar rápidamente un servidor con servicios REST, además de que es un framework muy puplar.


3. Luego en la ruta nos creamos un archivo index.js que es nuestro punto inicial.

4. Podemos colocar un console.log('Hola desde Node') dentro del archivo index.js que creamos para probar.

5. Posteriormente procedemos a ejecutar en la consola el siguiente comando:
```
node index.js
```

Y esto nos va a responder con el consolo.log() que hayamos puesto.

Adicionalmente indicar la extensión .js al archivo es opcional y tenemos exactamente el mismo resultado.

```
node index
```

6. Adicionalmente podemos instalar Nodemon, el cual nos permite hacer live reload del servidor permitiendonos desarrollar de una manera más rápida. Para instalarlo debemos ejecutar el siguiente comando el cual instala el paquete de manera global:

```
npm install -g nodemon
```

NOTA: Como sabemos si no queremos instalar el paquete de manera global lo unico que debemos hacer es reemplazar el -g y por un --save-dev

Adicionalmente podemos ver más documentación sobre Nodemon en el siguiente enlace: 

* [Nodemon](https://www.npmjs.com/package/nodemon)

7. Posteriormente de tener instalado Nodemon lo unico que debemos hacer es ejecutar nuestro servidor ejecutando el siguiente comando:

```
nodemon index.js
```
Y de esta manera ahora el live reload va a estar escuchando siempre los cambios y podremos ver los cambios que realicemos en nuestro codigo en tiempo real y sin tener que bajar y volver a subir el servidor.

8. Luego también podemos configurar los scripts, los cuales no es que sea obligatorio configurarlos, pero nos va a ayudar a no tener que memorizarnos cual es el punto de inicio de nuestra aplicación, y que tengo que hacer cuando lo despliegue. Entonces para ello abrimos el archivo package.json que se había creado anteriormente y agregamos los siguientes scripts:

```
"dev": "nodemon index.js",
"start": "node index.js"
```

Ó podemos definir el script también de la siguiente manera:

```
"start:dev": "nodemon index.js",
"start": "node index.js"
```

NOTA: Cuando especificamos "dev" o "start:dev" lo que hace es ejecutar el index.js usando Nodemon para desarrollo y el "start" es para cuando pasemos la aplicación a producción y le indique que ejecute el archivo index.js usando el comando node.

9. Por lo tanto ya con la configuración de los scripts ya no sería necesario ejecutar el comando "nodemon index.js" como se había explicado anteriormente, sino que ya solo deberíamos usar el siguiente comando:

```
npm run dev
```

Ó si lo definimos como "start:dev" ejecutamos el comando de la siguiente forma:

```
npm run start:dev
```

Y lo que le decimos es que cuando yo ejecute "npm run" le indicamos que ejecute un script llamado "dev" o "start:dev", y por lo tanto tenemos exactamente el mismo resultado que cuando ejecutamos el comando "nodemon index.js"

10. Ahora ya cuando vayamos a ejecutar la aplicación en producción no es necesario indicar el "run" sino que simplemente ejecutamos "npm" y le indicamos que el script se llama "start" de la siguiente manera:

```
npm start
```

Configuración Base De Datos MongoDB
====================================

Ahora es necesario realizar el registro y creación de la base de datos en MongoDB, no es necesario hacerlo con Mongo, se puede usar mysql, oracle, o cualquier otra base de datos pero para el caso del curso se usa MongoDB. Unas de las bondades que tiene esta base de datos es que es NoSQL y permite trabajar con documentos además de que es de código abiero, también la inserción y trabajo con los datos se hace de una forma muy parecida a como se trabaja con objetos en JavaScript, otra cosa es que al crearse en clusters es muy eficiente.
Entonces para realizar la configuración seguimos los siguientes pasos:

1. Inicialmente procedemos a crear una cuenta en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) y para ello debemos dar click en Try Free y crear la ya sea llenando el formulario o directamente con una cuenta de google.

2. Posteriormente procedemos a crear nuestro cluster, el cual para el caso del curso va a ser gratuito, pero perfectamente se puede adquirir uno de pago. Adicionalmente podemos colocar un nombre al cluster que para el curso se llamo MiCluster, y posteriormente procedemos a dare click en crear cluster y esperamos a que el cluster sea creado.

3. Luego en la página principal de Database procedemos a dar click en donde dice CONNECT.

4. Luego procedemos a dar click en Add a connection IP y elegimos la ip o dejamos la que viene por defecto.

5. Posteriormente es necesario crear un database user con su respectiva contraseña la cual se puede especificar o autogenerar. También podemos crear más usuarios haciendo click en Database Access.

6. A continuación le damos en choose connection y se nos va a abrir una lista con las opciones, que en este caso vamos a usar MongoDB Compass y para ello seleccionamos dicha forma de conexión. También hay que tener en cuenta que si no se tiene instalado el programa MongoDB compass es necesario realizar la instalación.

7. A continuación copiamos la cadena de conexión que se nos muestra y la usamos para crear una nueva variable de entorno en nuestro archivo .env en el cual tenemos que ajustar el nombre de la base de datos (que en este caso la llamé miBaseDatos), también es necesario especificar el usuario y la contraseña.

8. El siguiente paso es tomar la cadena de conexión que ya teníamos con su respectivo usuario, contraseña y base de datos, para proceder a colocarla en el campo de conexión del programa mongodb compass y dar click en conectar.

Instalaciones necesarias para el backend
=========================================

* A través del siguiente comando instalamos "mongoose" el cual es un ORM que nos va a servir para interactuar y realizar la comunicación, conexión y trabajo con la base de datos MongoDB.

```
npm i mongoose
```

* A través del siguiente comando instalamos "dotenv" el cual es un paquete que sirve para configurar variables de entorno.

```
npm i dotenv
```

* A través del siguiente comando instalamos "cors" el cual es un paquete que nos va a permitir hacer peticiones Cross Domain, y esto es algo necesario si vamos a aceptar peticiones provenientes de otros dominios. 

```
npm i cors
```

* A través del siguiente comando instalamos el "express-validator" el cual es un paquete que nos sirve para hacer validaciones en express por ejemplo de que los campos tengan la información que se necesita.

```
npm i express-validator
```

* A través del siguiente comando instalamos el "bcryptjs" el cual es un paquete que va a permitir encriptar y hacer hash de una sola vía de las contraseñas para que nadie aunque tenga el código hash no lo va a poder reconstruir.

```
npm i bcryptjs
```

* A través del siguiente comando instalamos el "JWT" el cual es un paquete que nos va a permitir generar JSON Web Tokens para gestionar la sesión de nuestros usuarios de una manera pasiva.

```
npm i jsonwebtoken
```

### NOTA:

* Adicionalmente si necesitamos instalar una versión específica de un paquete lo podemos hacer indicando un @ seguido de la versión a instalar. Un ejemplo sería el siguiente:

```
npm i express@4.17.1
```