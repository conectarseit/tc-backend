import { Router, Request, Response } from "express";
import { Usuario } from '../models/usuario.model';
import bcrypt from 'bcrypt';
import Token from '../classes/token';
import { verificaToken } from '../middlewares/autenticacion';




const userRoutes = Router();

// Login
userRoutes.post('/login', (req: Request, res:Response) => {
    const body = req.body;

    Usuario.findOne( { dni: body.dni }, ( err, userDB ) => {
        if(err) throw err;

        if( !userDB ) {
            return res.json({
                ok: false,
                mensaje: "Usuario/Contraseña no son correctos"
            });
        };

        if( userDB.compararPassword(body.password) ) {
            
            const tokenUser = Token.getJwtToken( {
                _id: userDB._id,
                nombre: userDB.nombre,
                apellido: userDB.apellido,
                dni: userDB.dni,
                direccion: userDB.direccion,
                telefono: userDB.telefono,
                localidad: userDB.localidad,
                provincia: userDB.provincia,
                email: userDB.email,
                avatar: userDB.avatar
            })
            
            
            res.json({
                ok: true,
                token: tokenUser,
                user: {
                    nombre: userDB.nombre,
                    apellido: userDB.apellido,
                    dni: userDB.dni,             
                    localidad: userDB.localidad,
                    provincia: userDB.provincia,
                    email: userDB.email,
                    avatar: userDB.avatar

                }

            });
        }else {
            return res.json({
                ok: false,
                mensaje: "Usuario/Contraseña no son correctos"
            });
        }
        

    } )
})


// Crear un Usuario
userRoutes.post('/create', ( req: Request, res: Response )=> {
    
    const user = {
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        dni: req.body.dni,
        direccion: req.body.direccion,
        telefono: req.body.telefono,
        localidad: req.body.localidad,
        provincia: req.body.provincia,
        email: req.body.email,
        password: bcrypt.hashSync( req.body.password, 10 ),
        avatar: req.body.avatar
    }

    // Guardo en Base de datos
    Usuario.create( user ).then( userDB => {
       
        // Si todo va bien, muestro el resultado
        const tokenUser = Token.getJwtToken( {
            _id: userDB._id,
            nombre: userDB.nombre,
            apellido: userDB.apellido,
            dni: userDB.dni,
            direccion: userDB.direccion,
            telefono: userDB.telefono,
            localidad: userDB.localidad,
            provincia: userDB.provincia,
            email: userDB.email,
            avatar: userDB.avatar
        })
        
        
        res.json({
            ok: true,
            token: tokenUser,
            user: {
                nombre: userDB.nombre,
                apellido: userDB.apellido,
                dni: userDB.dni,             
                localidad: userDB.localidad,
                provincia: userDB.provincia,
                email: userDB.email,
                avatar: userDB.avatar

            }

        });

     
    }).catch( err => {

        res.json({
            ok: false,
            error: err
        })

    });


})


// Actualizar Usuario
userRoutes.post('/update', verificaToken ,(req: any, res:Response) => {
    
    const user = req.body;
            

    Usuario.findByIdAndUpdate( req.usuario._id, user, { new: true }, ( err, userDB) => {
        if(err) throw err;

        if( !userDB ) {
            return res.json({
                ok: false,
                mensaje: 'No existe usuario en DB'
            })
        }

        const tokenUser = Token.getJwtToken( {
            _id: userDB._id,
            nombre: userDB.nombre,
            apellido: userDB.apellido,
            dni: userDB.dni,
            direccion: userDB.direccion,
            telefono: userDB.telefono,
            localidad: userDB.localidad,
            provincia: userDB.provincia,
            email: userDB.email,
            avatar: userDB.avatar
        })
        
        
        res.json({
            ok: true,
            token: tokenUser,
            user: {
                nombre: userDB.nombre,
                apellido: userDB.apellido,
                dni: userDB.dni,             
                localidad: userDB.localidad,
                provincia: userDB.provincia,
                email: userDB.email,
                avatar: userDB.avatar
            }

        });

    })
    

});


export default userRoutes;