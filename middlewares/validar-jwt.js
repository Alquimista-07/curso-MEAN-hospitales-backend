// Middleware para validar JWT y validar el role de los usuarios

const jwt = require('jsonwebtoken');

const { response } = require("express");

// Tomamos el modelo y verificamos en el modelo directamente en la base de datos si tiene el ADMIN_ROLE
const Usuario = require('../models/usuario');

const validarJWT = ( req, res = response, next ) => {

    // Leer el token de los headers
    const token = req.header( 'x-token' );
    
    
    // Validamos el token
    if( !token ) {
        return res.status(401).json({
            ok: false,
            msg: 'No hay token en la petición'
        });
    }

    try {

        const { uid } = jwt.verify( token, process.env.JWT_SECRET );

        req.uid = uid;

        // Tenemos que llamar el next para que se complete y responda
        next();

    }
    catch (err) {
        return res.status(401).json({
            ok: false,
            msg: 'Token no válido'
        });
    }

}

// Metodo para validar el role del lado del backend con el fin de que un usuario con un role diferente
// a administrador pueda cambiar o actualizar la información de cualquier usuario
const validarADMIN_ROLE = async ( req, res, next ) => {

    const uid = req.uid;

    try {

        const usuarioDB = await Usuario.findById( uid );

        if( !usuarioDB ){
            return res.status(404).json({
                ok: false,
                msg: 'Usuario no existe'
            });
        }

        // Si existe el usuario pero no es administrador
        if( usuarioDB.role !== 'ADMIN_ROLE' ){
            return res.status(403).json({
                ok: false,
                msg: 'El usuario no cuenta con los permisos para realizar la operación'
            });
        }

        // Si logra pasar la validación llamamos el next
        next();

    } catch( err ){
        console.log(err);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }

}

// Middelware para validar el ADMIN_ROLE o mismo usuario
const validarADMIN_ROLE_o_MismoUsuario = async ( req, res, next ) => {

    const uid = req.uid;
    const id = req.params.id;

    try {

        const usuarioDB = await Usuario.findById( uid );

        if( !usuarioDB ){
            return res.status(404).json({
                ok: false,
                msg: 'Usuario no existe'
            });
        }

        // Si existe el usuario pero no es administrador o si es un usuario que esta tratando de actualizar su propio perfil
        if( usuarioDB.role === 'ADMIN_ROLE' || uid === id ){

            // Si logra pasar la validación llamamos el next
            next();

        } else {
            return res.status(403).json({
                ok: false,
                msg: 'El usuario no cuenta con los permisos para realizar la operación'
            });
        }

    } catch( err ){
        console.log(err);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }

}

// Exportamos
module.exports = {
    validarJWT,
    validarADMIN_ROLE,
    validarADMIN_ROLE_o_MismoUsuario
}