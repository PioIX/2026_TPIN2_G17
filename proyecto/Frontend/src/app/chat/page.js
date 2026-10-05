"use client";

import { Suspense, useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import Message from "@/components/Message";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { useSocket } from "@/hooks/useSocket";
import styles from "./Chat.module.css";

function ChatContenido() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const id_chat = searchParams.get("id_chat");

    const [mensajes, setMensajes] = useState([]);
    const [texto, setTexto] = useState("");
    const [miMail, setMiMail] = useState("");
    const { socket, isConnected } = useSocket({ withCredentials: true });
    const finMensajes = useRef(null);


    useEffect(() => {
        fetch("http://localhost:4000/usuario", { credentials: "include" })
            .then((response) => response.json())
            .then((data) => {
                if (!data.mail) router.push("/login");
                else setMiMail(data.mail);
            });
    }, []);

    useEffect(() => {
        if (!id_chat) return;

        fetch(`http://localhost:4000/mensajes/${id_chat}`, { credentials: "include" })
            .then((response) => response.json())
            .then((data) => {
                if (Array.isArray(data)) setMensajes(data);
            });
    }, [id_chat]);

    
    useEffect(() => {
        if (!socket || !id_chat) return;

        socket.emit("joinRoom", { room: id_chat });

        function recibirMensaje(data) {
            if (data.room == id_chat) {
                setMensajes((actuales) => [...actuales, data.message]);
            }
        }

        socket.on("newMessage", recibirMensaje);

        return () => {
            socket.off("newMessage", recibirMensaje);
        };
    }, [socket, id_chat]);

    // Scroll al último mensaje
    useEffect(() => {
        finMensajes.current?.scrollIntoView({ behavior: "smooth" });
    }, [mensajes]);

    function enviarMensaje(e) {
        e.preventDefault();
        if (!socket || texto.trim() === "") return;

        socket.emit("sendMessage", { message: texto });
        setTexto("");
    }

    return (
        <div className={styles.contenedor}>
            <Link href="/chats" className={styles.volver}>← Volver a mis chats</Link>

            <div className={styles.mensajes}>
                {mensajes.map((mensaje) => (
                    <Message
                        key={mensaje.id_mensaje}
                        contenido={mensaje.contenido}
                        mail={mensaje.mail}
                        nombre={mensaje.nombre}
                        miMail={miMail}
                    />
                ))}
                <div ref={finMensajes} />
            </div>

            <form className={styles.formulario} onSubmit={enviarMensaje}>
                <Input
                    placeholder="Escribí un mensaje"
                    value={texto}
                    onChange={(e) => setTexto(e.target.value)}
                />
                <Button text="Enviar" type="submit" />
            </form>
        </div>
    );
}

export default function Chat() {
    return (
        <Suspense fallback={<p>Cargando chat...</p>}>
            <ChatContenido />
        </Suspense>
    );
}
