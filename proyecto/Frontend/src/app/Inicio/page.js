"use client";

import Button from "@/components/Button";
import Registro from "@/components/Registro";
import Login from "@/components/Login"
import { useState, useEffect } from "react";
export default function Inicio() {
    const [eleccion, setEleccion] = useState(false)
    const [logueado, setLogueado] = useState(false)
    const [registrado, setRegistrado] = useState(false)

    const handleInicio = () => {
        setEleccion(true)
    }

    if (eleccion === false) {
        useEffect(() => {
            fetch('http://localhost:3001/register')
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    setRegistrado(true);

                });
        }, [registrado])

        return (
            <>
                <Registro
                    nombre={nombre}
                    contrasena={contrasena}
                    mail={mail}

                />
                <Button onClick={handleInicio} text={"Iniciar Sesion"} />
            </>
        )
    } else {
        useEffect(() => {
            fetch('http://localhost:3001/login')
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    setLogueado(true);
                });
        }, [logueado])
        return (

            <>
                <Login
                    mail={mail}
                    contrasena={contrasena}
                />
            </>
        )
    }
}

