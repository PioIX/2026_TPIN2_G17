"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import styles from "./Auth.module.css";

export default function Home() {
    const router = useRouter();

    useEffect(() => {
        document.title = "Pio Chat - Inicio";
    }, []);

    return (
        <div className={styles.contenedor}>
            <div className={styles.tarjeta}>
                <h1>Bienvenido</h1>
                <p>Conéctate y chatea en tiempo real</p>
                <Button onClick={() => router.push("/login")} text="Iniciar sesión" />
                <Button onClick={() => router.push("/registro")} text="Registrarse" />
            </div>
        </div>
    );
}
