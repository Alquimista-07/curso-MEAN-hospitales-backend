const jwt = require('jsonwebtoken');

const generarJWT = ( uid ) => {

    // Convertimos en una promesa para tener el resolve y reject y de esta manera
    // usar el async y el await ya que debemos usar esta función de manera síncrona
    // para esperar que este proceso se haya realizado antes de contestar de manera 
    // satisfactoria del lado de nuestro controlador
    return new Promise( ( resolve, reject ) => {

        // NOTA: En el payload como sabemos podemos grabar la información que queramos pero hay que tener en cuenta
        //       que no debemos grabar información sensible puesto que esta información puede ser decodificada y puede comprometer
        //       la información sensible de nuestros usuarios.
        const payload = {
            uid
        };
    
        // Acá creamos el JWT y recibe como primer argumento lo que vamos a firmar, y como segundo argumento recibe la lleve 
        // (secretOrPrivateKey) que es nuestra semilla o seed y la cual debemos proteger de forma celosa en nuestro servidor
        // debido a que si alguién tiene acceso a ella podría firmar tokens como si lo realizara la aplicación y por ende comprometer
        // la seguridad de nuestra aplicación, posteriormente recibe otro argumento el cual es un objeto que contiene características
        // que le vamos a dar al token como por ejemplo la expiración de este.
        jwt.sign( payload, process.env.JWT_SECRET, {
            expiresIn: '12h'
        }, ( error, token ) => {
            if ( error ){
                console.log(error);
                reject( 'No se pudo generar el JWT' );
            }
            else {
                resolve( token );
            }
        });

    });

}

// Exportamos
module.exports = {
    generarJWT
}