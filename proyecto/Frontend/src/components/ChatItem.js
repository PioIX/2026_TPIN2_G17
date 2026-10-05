"use client"
import Link from "next/link";
import styles from "./ChatItem.module.css"


function obtenerFoto(foto) {
    if (!foto) return "/foto_default.svg";
    if (foto.startsWith("http") || foto.startsWith("/")) return foto;
    return "/" + foto;
}

export default function ChatItem({ id_chat, titulo, es_grupo, fecha_creacion, foto_chat }) {
    return (
        <li className={styles.item}>
            <Link href={`/chat?id_chat=${id_chat}`} className={styles.link}>
                <img
                    className={styles.foto}
                    src={obtenerFoto(foto_chat)}
                    alt={`Foto de ${titulo}`}
                />
                <div className={styles.datos}>
                    <p className={styles.titulo}>{titulo}</p>
                    <p className={styles.detalle}>
                        {es_grupo ? "Grupo" : "Chat individual"}
                        {fecha_creacion ? " · " + String(fecha_creacion).slice(0, 10) : ""}
                    </p>
                </div>
            </Link>
        </li>
    );
}
