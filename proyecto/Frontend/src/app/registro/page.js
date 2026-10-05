"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Input from "@/components/Input";
import Button from "@/components/Button";
import styles from "./registro.module.css";

export default function RegistroPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        nombre: "",
        mail: "",
        contrasena: "",
        foto_perfil: "",
    });
    const [mensajeError, setMensajeError] = useState("");

    useEffect(() => {
        document.title = "Pio Chat - Registrarse";
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMensajeError("");

        try {
            const respuesta = await fetch("http://localhost:4000/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(formData),
            });
            const data = await respuesta.json();

            if (data.res === "Usuario agregado") {
                alert("¡Usuario registrado correctamente!");
                router.push("/login");
            } else {
                setMensajeError(data.res || "No se pudo registrar el usuario.");
            }
        } catch (error) {
            console.error("Error en registro:", error);
            setMensajeError("No se pudo conectar con el servidor backend.");
        }
    };

    return (
        <div className={styles.contenedor}>
            <div className={styles.tarjeta}>
                <h1>Registrarse</h1>

                {mensajeError && <p className={styles.error}>{mensajeError}</p>}

                <form onSubmit={handleSubmit}>
                    <Input
                        label="Nombre"
                        type="text"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        placeholder="Tu nombre"
                    />
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
                    <Input
                        label="Foto"
                        type="text"
                        name="foto_perfil"
                        value={formData.foto_perfil}
                        onChange={handleChange}
                        placeholder="URL o nombre de archivo (opcional)"
                    />
                    <Button text="Registrarse" type="submit" />
                </form>

                <p className={styles.cambioVista}>
                    ¿Ya tenés una cuenta?{" "}
                    <span onClick={() => router.push("/login")} className={styles.enlace}>
                        Iniciá sesión acá
                    </span>
                </p>
            </div>
        </div>
    );
}