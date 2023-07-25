// Este archivo continen la configuración de la conexión con la base de datos
// mongoose

const mongoose = require('mongoose');

// Creamos una función que sea la encargada de establecer la conexión
const dbConnection = async() => {

    try {
        
        // la función connect recibe la cadena de conexión, la cual la podemos definir en una variable de entorno.
        // Adicionalmente recibe un objeto con la configuración que en la página oficial de mongoose recomiendan
        await mongoose.connect( process.env.DB_CNN , {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            // useCreateIndex: true // Se comento ya que en el video colocan esta propiedad pero arroja error en consola y no conecta la DB
        });

        // Si pasa entonces mostramos un mensaje de información
        console.log( 'DB Online!!!...' );

    }
    catch (error) {
        // Imprimimos en consola unos mensajes para saber el detalle del error y adicionalmente si se muestran
        // ya se que nada va a funcionar, ni siquiera los servicios REST
        console.log(error);
        throw new Error('Error a la hora de inicializar la DB revisar logs');
    }


}

// Ahora como necesito usar la función y demás cosas que tenemos acá
// necesitamos exportarla
module.exports = {
    dbConnection
}