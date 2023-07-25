// Controladores de busqueda

const { response } = require('express');

// Importamos el modelo de usuarios
const Usuario = require('../models/usuario');
// Importamos el modelo de medicos
const Medico = require('../models/medico');
// Importamos el modelo de hospitales
const Hospital = require('../models/hospital');

const getTodo = async(req, res = response) => {

    const busqueda = req.params.busqueda;
    const regex = new RegExp( busqueda, 'i' );

    const [ usuarios, medicos, hospitales ] = await Promise.all([
        Usuario.find({ nombre: regex }),
        Medico.find({ nombre: regex }),
        Hospital.find({ nombre: regex })
    ]);

    res.json({
        ok: true,
        busqueda,
        usuarios,
        medicos,
        hospitales,
        msg: 'Ok busqueda'
    })

}

const getDocumentosColeccion = async(req, res = response) => {

    const tabla = req.params.tabla;
    const busqueda = req.params.busqueda;
    const regex = new RegExp( busqueda, 'i' );

    let data = [];

    switch ( tabla ) {
        case 'medicos':
            data = await Medico.find({ nombre: regex })
                               .populate('usuario', 'nombre img')
                               .populate('hospital', 'nombre img');
            break;

        case 'hospitales':
            data = await Hospital.find({ nombre: regex })
                                 .populate('usuario', 'nombre img');
            break;

        case 'usuarios':
            data = await Usuario.find({ nombre: regex });
            break;
    
        default:
            return res.status(400).json({
                ok: false,
                msg: "La tabla tiene que ser usuarios/medicos/hospitales"
            });
    }

    res.json({
        ok: true,
        resultados: data
    });

}

// Exportamos la funcionalidades
module.exports = {
    getTodo,
    getDocumentosColeccion
}