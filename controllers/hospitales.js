// Controladores de hospitales

const { response } = require('express');

// Importamos el modelo
const Hospital = require('../models/hospital');

const getHospitales = async(req, res = response) => {

    // Implementación de la paginación para hospitales
    //--------------------
    // Paginación Forma 2
    //--------------------
    const desde = Number(req.query.desde) || 0;

    // Obtenemos los hospitales, adicionalmente también obtenemos el nombre no solo el id de
    // quién lo creo usando el método populate indicando que vamos a llamar y como segundo
    // parámetro indicamos los campos que necesitemos como por ejemplo el nombre, el email, etc
    const [hospitales, total] = await  Promise.all([
        Hospital
                .find({}, 'nombre img')
                // Usamos el skip para que se salte todos los registros que están antes del desde
                .skip( desde )
                .populate('usuario', 'img')
                // Establecemos el limite que indica cuantos registros voy a mostrar por página
                .limit( 5 ),

        Hospital.countDocuments()
    ]);

    res.json({
        ok: true,
        hospitales,
        uid: req.uid,
        total
    });

}

const crearHospital = async(req, res = response) => {

    // Extraemos el id del usuario que lo esta grabando
    const uid = req.uid;

    const hospital = new Hospital( {
        usuario: uid,
        ...req.body
    } );

    try {

        const hospitalDB = await hospital.save();

        res.json({
            ok: true,
            hospital: hospitalDB
        })

    } catch (err) {
        console.log(err);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }

}

// Controlador para actualizar el hospital
const actualizarHospital = async (req, res = response) => {

    const hospitalId = req.params.id;
    const uid        = req.uid;

    try {

        // Obtenemos la referencia para ver si existe un hospital con ese id
        const hospitalDB = await Hospital.findById( hospitalId );

        // Si no existe mandamos un error
        if ( !hospitalDB ) {
            return res.status(404).json({
                ok: false,
                msg: 'Hospital no encontrado por id'
            });
        }

        // Si existe actualizamos el nombre que es el unico campo que vamos a actualizar, pero pues este metodo nos sirve para n campos.
        // Establecemos el nombre
        const cambiosHospital = {
            ...req.body,
            usuario: uid // Obtenemos el id de la ultima persona que realizo la modificación
        }
        // Ya esta establecido entonces lo actualizamos
        const hospitalActualizado = await Hospital.findByIdAndUpdate( hospitalId, cambiosHospital, { new: true } ) // La instrucción  new: true devuelve el ultimo documento actualizado

        res.json({
            ok: true,
            hospital: hospitalActualizado
        });
        
    } catch (err) {
        console.log(err);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }

}

const borrarHospital = async (req, res = response) => {

    const hospitalId = req.params.id;

    try {

        // Obtenemos la referencia para ver si existe un hospital con ese id
        const hospitalDB = await Hospital.findById( hospitalId );

        // Si no existe mandamos un error
        if ( !hospitalDB ) {
            return res.status(404).json({
                ok: false,
                msg: 'Hospital no encontrado por id'
            });
        }

        // Borramos el hospital
        await Hospital.findByIdAndDelete( hospitalId )

        res.json({
            ok: true,
            msg: 'Hospital Eliminado Correctamente'
        });
        
    } catch (err) {
        console.log(err);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }

}

module.exports = {
    getHospitales,
    crearHospital,
    actualizarHospital,
    borrarHospital
}