"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const usuario_model_1 = require("../models/usuario.model");
const bcrypt_1 = __importDefault(require("bcrypt"));
const token_1 = __importDefault(require("../classes/token"));
const autenticacion_1 = require("../middlewares/autenticacion");
const userRoutes = express_1.Router();
// Login
userRoutes.post('/login', (req, res) => {
    const body = req.body;
    usuario_model_1.Usuario.findOne({ dni: body.dni }, (err, userDB) => {
        if (err)
            throw err;
        if (!userDB) {
            return res.json({
                ok: false,
                mensaje: "Usuario/Contraseña no son correctos"
            });
        }
        ;
        if (userDB.compararPassword(body.password)) {
            const tokenUser = token_1.default.getJwtToken({
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
            });
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
        }
        else {
            return res.json({
                ok: false,
                mensaje: "Usuario/Contraseña no son correctos"
            });
        }
    });
});
// Crear un Usuario
userRoutes.post('/create', (req, res) => {
    const user = {
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        dni: req.body.dni,
        direccion: req.body.direccion,
        telefono: req.body.telefono,
        localidad: req.body.localidad,
        provincia: req.body.provincia,
        email: req.body.email,
        password: bcrypt_1.default.hashSync(req.body.password, 10),
        avatar: req.body.avatar
    };
    // Guardo en Base de datos
    usuario_model_1.Usuario.create(user).then(userDB => {
        // Si todo va bien, muestro el resultado
        const tokenUser = token_1.default.getJwtToken({
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
        });
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
    }).catch(err => {
        res.json({
            ok: false,
            error: err
        });
    });
});
// Actualizar Usuario
userRoutes.post('/update', autenticacion_1.verificaToken, (req, res) => {
    const user = req.body;
    usuario_model_1.Usuario.findByIdAndUpdate(req.usuario._id, user, { new: true }, (err, userDB) => {
        if (err)
            throw err;
        if (!userDB) {
            return res.json({
                ok: false,
                mensaje: 'No existe usuario en DB'
            });
        }
        const tokenUser = token_1.default.getJwtToken({
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
        });
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
    });
});
exports.default = userRoutes;
