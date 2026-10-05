"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import ChatList from "@/components/ChatList";
import Input from "@/components/Input";
import Button from "@/components/Button";
import styles from "./Chats.module.css";

export default function Chats() {
    const router = useRouter();

    const [chats, setChats] = useState([]);
    const [popup, setPopup] = useState(null); 
    const [error, setError] = useState("");

    const [mail, setMail] = useState("");
    const [titulo, setTitulo] = useState("");
    const [mails, setMails] = useState("");
    const [foto_chat, setFoto_chat] = useState("");

    useEffect(() => {
        document.title = "Pio Chat - Mis chats";
        cargarChats();
    }, []);

    function cargarChats() {
        fetch("http://localhost:4000/chats", {
            method: "GET",
            credentials: "include",
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.res === "Usuario no registrado") {
                    router.push("/login");
                } else {
                    setChats(data);
                }
            });
    }

    function abrirPopup(tipo) {
        setError("");
        setPopup(tipo);
    }

    function cerrarPopup() {
        setPopup(null);
        setError("");
    }

    function crearChat() {
        fetch("http://localhost:4000/chatIndividual", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ mail: mail }),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.res === "Chat creado") {
                    setMail("");
                    cerrarPopup();
                    cargarChats();
                } else {
                    setError(data.res);
                }
            });
    }

    function crearGrupo() {
        fetch("http://localhost:4000/grupal", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
                mails: mails.split(",").map((m) => m.trim()).filter((m) => m !== ""),
                titulo: titulo,
                foto_chat: foto_chat,
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.res === "Grupo creado") {
                    setTitulo("");
                    setMails("");
                    setFoto_chat("");
                    cerrarPopup();
                    cargarChats();
                } else {
                    setError(data.res);
                }
            });
    }

    function cerrarSesion() {
        fetch("http://localhost:4000/logout", {
            method: "POST",
            credentials: "include",
        }).then(() => router.push("/login"));
    }

    return (
        <div className={styles.contenedor}>
            <h1>Mis chats</h1>

            <div className={styles.acciones}>
                <Button text="Nuevo chat" onClick={() => abrirPopup("chat")} />
                <Button text="Nuevo grupo" onClick={() => abrirPopup("grupo")} />
                <Button text="Cerrar sesión" onClick={cerrarSesion} />
            </div>

            <ChatList chats={chats} />

            <Popup open={popup === "chat"} modal onClose={cerrarPopup}>
                <div className={styles.modal}>
                    <h2>Nuevo chat</h2>
                    {error && <p className={styles.error}>{error}</p>}
                    <Input
                        type="email"
                        placeholder="Mail del usuario"
                        value={mail}
                        onChange={(e) => setMail(e.target.value)}
                    />
                    <Button text="Crear chat" onClick={crearChat} />
                    <Button text="Cancelar" onClick={cerrarPopup} />
                </div>
            </Popup>

            <Popup open={popup === "grupo"} modal onClose={cerrarPopup}>
                <div className={styles.modal}>
                    <h2>Nuevo grupo</h2>
                    {error && <p className={styles.error}>{error}</p>}
                    <Input
                        placeholder="Nombre del grupo"
                        value={titulo}
                        onChange={(e) => setTitulo(e.target.value)}
                    />
                    <Input
                        placeholder="Mails separados por coma"
                        value={mails}
                        onChange={(e) => setMails(e.target.value)}
                    />
                    <Input
                        placeholder="Foto del grupo (opcional)"
                        value={foto_chat}
                        onChange={(e) => setFoto_chat(e.target.value)}
                    />
                    <Button text="Crear grupo" onClick={crearGrupo} />
                    <Button text="Cancelar" onClick={cerrarPopup} />
                </div>
            </Popup>
        </div>
    );
}
