"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const bcrypt_1 = __importDefault(require("bcrypt"));
const usuarioSchema = new mongoose_1.Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es Requerido']
    },
    apellido: {
        type: String,
        required: [true, 'El apellido es Requerido']
    },
    dni: {
        type: Number,
        required: [true, 'El DNI es Requerido'],
        unique: true
    },
    direccion: {
        type: String,
    },
    telefono: {
        type: String,
    },
    localidad: {
        type: String,
    },
    provincia: {
        type: String,
    },
    avatar: {
        type: String,
        default: 'av-1.png'
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El mail es obligatorio']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es Obligatoria']
    },
    rol: {
        type: String,
        default: 'tarjeta'
    }
});
usuarioSchema.method('compararPassword', function (password = '') {
    if (bcrypt_1.default.compareSync(password, this.password)) {
        return true;
    }
    else
        return false;
});
exports.Usuario = mongoose_1.model('Usuario', usuarioSchema);
