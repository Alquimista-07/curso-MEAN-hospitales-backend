// Modelo de mongoose encargado del modelo de base de datos y agregar ciertas
// restricciones para que cada registro de usuarios se vea de la forma que
// queremos

const { Schema, model } = require('mongoose');

// Creamos el schema que es la definición de cada uno de los registros que van a estar
// dentro de una colección ("tabla usuarios" por así decirlo que del todo no es cierto ya que mongo es una
// DB noSQL)
const HospitalSchema = Schema({

    nombre: {
        type: String,
        required: true
    },
    img: {
        type: String
    },
    // Referencia al usuario para saber siempre quién lo creó
    usuario: {
        required: true,
        // Aca indicamos que el schema va a tener una realación con la referencia
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    }

}, { collection: 'hospitales' }); // Cambiamos para que en la DB no aparezca hospitals sino como queremos que se muestre que sera hospitales

// NOTA: Cabe resaltar que esto que se hace afecta visualmente y no directamente en la base de datos, adicionalmente
//       esto es de manera global, es decir en todo lado donde tengamos ese id va a aparecer como uid
HospitalSchema.method('toJSON', function() {
    // Extraemos la versión, y el resto del objeto
    const { __v, ...object } = this.toObject();
    return object;
});

// Exportamos el modelo
module.exports = model( 'Hospital', HospitalSchema );