"use client";

import { useEffect } from "react";
import Link from "next/link";
import Button from "@/components/Button";
import styles from "../registro/registro.module.css";

export default function Home() {
  useEffect(() => {
    document.title = "Pio Chat - Inicio";
  }, []);

  return (
    <div className={styles.contenedor}>
      <div className={styles.tarjeta}>
        <h1>Bienvenido</h1>
        <p>Conéctate y chatea en tiempo real</p>

        <Link href="/login">
          <Button text="Iniciar sesión" />
        </Link>
        <Link href="/registro">
          <Button text="Registrarse" />
        </Link>
      </div>
    </div>
  );
}