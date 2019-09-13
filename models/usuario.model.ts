
import { Schema, model, Document } from "mongoose";
import bcrypt from 'bcrypt';


const usuarioSchema = new Schema( {
    nombre: {
        type: String,
        required: [ true, 'El nombre es Requerido']
    },
    apellido: {
        type: String,
        required: [ true, 'El apellido es Requerido']
    },
    dni: {
        type: Number,
        required: [ true, 'El DNI es Requerido'],
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
        required: [ true, 'El mail es obligatorio']
    },
    password: {
        type: String,
        required: [ true, 'La contraseña es Obligatoria']
    },
    rol: {
        type: String,
        default: 'tarjeta'
    }
} );


usuarioSchema.method('compararPassword', function( password: string = '' ): boolean {

    if ( bcrypt.compareSync( password, this.password )){
        return true;
    }else return false;
})

interface IUsuario extends Document {
    nombre: string;
    apellido: string;
    avatar: string;
    dni: number;
    direccion: string;
    telefono: string;
    localidad: string;
    provincia: string;
    email: string;
    password: string;
    rol: string;

    compararPassword( password: string):boolean ;
}

export const Usuario = model<IUsuario>('Usuario', usuarioSchema);

