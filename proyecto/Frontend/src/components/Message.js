"use client"
import styles from "./Message.module.css"

// Mismo componente para mensajes enviados y recibidos: cambia solo el estilo
export default function Message({ contenido, mail, nombre, miMail }) {
    const enviado = mail === miMail;

    return (
        <div className={enviado ? styles.fila_enviado : styles.fila_recibido}>
            <div className={enviado ? styles.enviado : styles.recibido}>
                {!enviado && <p className={styles.autor}>{nombre || mail}</p>}
                <p>{contenido}</p>
            </div>
        </div>
    );
}
