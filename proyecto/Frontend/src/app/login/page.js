"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Input from "@/components/Input";
import Button from "@/components/Button";
import styles from "../registro/registro.module.css";

export default function LoginPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({ mail: "", contrasena: "" });
    const [mensajeError, setMensajeError] = useState("");

    useEffect(() => {
        document.title = "Pio Chat - Iniciar sesión";
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMensajeError("");

        try {
            const respuesta = await fetch("http://localhost:4000/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(formData),
            });
            const data = await respuesta.json();

            if (data.res === "Login correcto") {
                router.push("/chats");
            } else {
                setMensajeError(data.res);
            }
        } catch (error) {
            console.error("Error en login:", error);
            setMensajeError("No se pudo conectar con el servidor backend.");
        }
    };

    return (
        <div className={styles.contenedor}>
            <div className={styles.tarjeta}>
                <h1>Iniciar sesión</h1>

                {mensajeError && <p className={styles.error}>{mensajeError}</p>}

                <form onSubmit={handleSubmit}>
                    <Input
                        label="Mail"
                        type="email"
                        name="mail"
                        value={formData.mail}
                        onChange={handleChange}
                        placeholder="correo@ejemplo.com"
                    />
                    <Input
                        label="Contraseña"
                        type="password"
                        name="contrasena"
                        value={formData.contrasena}
                        onChange={handleChange}
                        placeholder="********"
                    />
                    <Button text="Iniciar sesión" type="submit" />
                </form>

                <p className={styles.cambioVista}>
                    ¿No tenés cuenta?{" "}
                    <span onClick={() => router.push("/registro")} className={styles.enlace}>
                        Registrate acá
                    </span>
                </p>
            </div>
        </div>
    );
}
