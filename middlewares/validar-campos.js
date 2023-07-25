// Middleware para validar campos

// Importamos el response para tener la ayuda del tipado
const { response } = require('express');

// Importamos el validador de express
const { validationResult } = require('express-validator');

const validarCampos = ( req, res = response, next ) => {

    // Atrapamos los errores enviados desde el middleware, para ello creamos el
    // arreglo de errores
    const errores = validationResult( req );

    if( !errores.isEmpty() ) {
        return res.status(400).json({
            ok: false,
            errors: errores.mapped()
        });
    }

    // Acá ocupamos una nueva función la cual se invoca cuando todo es correcto y por lo tanto
    // procede al siguiente middleware
    next();

}

// Exportamos para poder usar
module.exports = {
    validarCampos
}