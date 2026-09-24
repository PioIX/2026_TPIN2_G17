"use client"

import Input from "@/components/Input";
export default function Registro({ mail, nombre, contrasena, foto_perfil, onChange }){

    return(
        <>
        <p>Ingresa el mail</p>
        <Input onChange={onChange} value={mail}  />
        <hr></hr>
        <p>Ingresa la contraseña</p>
        <Input onChange={onChange} value={contrasena} />
        <hr></hr>
        <p>Ingresa tu nombre</p>
        <Input onChange={onChange} value={nombre}/>
        <p>Ingresa la foto de perfil</p>
        <Input onChange={onChange} value={foto_perfil}/>
        </>
    )
}