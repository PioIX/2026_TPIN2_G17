"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {

    const [mail, setMail] = useState("");
    const [contrasena, setContrasena] = useState("");

    const router = useRouter();

    function iniciarSesion() {

        fetch("http://localhost:4000/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({
                mail: mail,
                contrasena: contrasena
            })
        })
        .then(response => response.json())
        .then(data => {

            console.log(data);

            if (data.res === "Login correcto") {
                router.push("/bienvenida");
            } else {
                alert(data.res);
            }

        });
    }

    return (
        <div>
            <h1>Iniciar sesión</h1>

            <input
                type="email"
                placeholder="Mail"
                value={mail}
                onChange={(e) => setMail(e.target.value)}
            />

            <input
                type="password"
                placeholder="Contraseña"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
            />

            <button onClick={iniciarSesion}>
                Iniciar sesión
            </button>
        </div>
    );
}