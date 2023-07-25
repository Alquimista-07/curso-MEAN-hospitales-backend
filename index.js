// Importamos express
const express = require('express');

// Para congigurar las variables de entorno configuramos usando el paquete dotenv que
// habíamos instalado el cual toma el archivo .env por defecto y nos permite usar las 
// variables de entorno definidas allí.
require('dotenv').config();

// Ahora para los CORS (Cross Domain) es necesario realizar la siguiente importación
const cors = require('cors');

// Importamos el archivo de configuración de la base de datos
const { dbConnection } = require('./database/config');

// Crear el servidor express
const app = express();

//=================================================================================================================
// CORS
//=================================================================================================================
// NOTA: Para configurar el cors vamos a usar algo que se conoce como un middleware.
//       Y un middleware no es más que una función que se ejecuta cuando el interprete pase evaluando
//       cada una de las líneas de código. En este caso el middleware es el use() el cual recibe la 
//       función cors(), la cual si la dejamos sin parametro ya tendríamos la configuración básica, pero 
//       hay que tener en cuenta que le podemos mandar como parámetro más configuraciones del cors como por
//       ejemplo, si solo necesitaramos aceptar peticiones que vienen de un dominio y ese dominio conocemos cual es
//       se lo podemos definir como parámetro al cors y esto ayuda un poco a la protección del backend, ojo no es que
//       lo haga infalible pero si ayuda un poco a la protección del mismo.
//
//       Ahora hay que tener en cuenta que cuando probamos con el Postman visualmente no se ve nada ya que postman por defecto
//       tiene unas cosas que se saltan el cors, pero ya cuando este montado en un servidor ahí si vamos a ver diferencias como
//       por ejemplo google chrome me va a advertir que mi hosting no esta configurado con el cors y que las peticiones de cross
//       domain no son permitidas.
//
//       Ahora el CORS lo ejecutamos como cualquier otro middleware, entonces lo hacemos de la siguiente
//       manera:
app.use( cors() );

// Carpeta publica
// Documentación oficial Google Identity
// URL: https://developers.google.com/identity/gsi/web/guides/overview?hl=es-419
app.use( express.static('public') );

// Lectura y parseo del body
app.use( express.json() );

// Base de datos
dbConnection();

// Rutas
// Usamos un middleware para las rutas las cuales se manejan con su respectiva ruta y controlador
app.use( '/api/usuarios', require('./routes/usuarios') );

app.use( '/api/login', require('./routes/auth') );

// Creamos la ruta de hospitales
app.use( '/api/hospitales', require('./routes/hospitales') );

// Creamos la ruta de medicos
app.use( '/api/medicos', require('./routes/medicos') );

// Creamos la ruta de busqueda
app.use( '/api/todo', require('./routes/busquedas') );

// Creamos la ruta de la carga de archivos
app.use( '/api/upload', require('./routes/uploads') );

// Para levantar el servidor
app.listen( process.env.PORT, () =>{
    console.log( 'Servidor corriendo en puerto ' + process.env.PORT );
});