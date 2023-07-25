// Modelo de mongoose encargado del modelo de base de datos y agregar ciertas
// restricciones para que cada registro de usuarios se vea de la forma que
// queremos

const { Schema, model } = require('mongoose');

// Creamos el schema que es la definición de cada uno de los registros que van a estar
// dentro de una colección ("tabla usuarios" por así decirlo que del todo no es cierto ya que mongo es una
// DB noSQL)
const UsuarioSchema = Schema({

    nombre: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    img: {
        type: String
    },
    role: {
        type: String,
        required: true,
        default: 'USER_ROLE'
    },
    google: {
        type: Boolean,
        default: false
    }

});

// Configuramos para que el _id que crea mongo se muestre de una manera personalizada como lo queremos
// y esto lo hacemos sobreescribiendo el metodo.
// NOTA: Cabe resaltar que esto que se hace afecta visualmente y no directamente en la base de datos, adicionalmente
//       esto es de manera global, es decir en todo lado donde tengamos ese id va a aparecer como uid
UsuarioSchema.method('toJSON', function() {
    // Extraemos la versión, el id y el resto del objeto
    const { __v, _id, password, ...object } = this.toObject();
    object.uid = _id;
    return object;
});

// Implementamos el modelo
module.exports = model( 'Usuario', UsuarioSchema );