"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Message from "@/components/Message";
import Input from "@/components/Input";
import Button from "@/components/Button";
import useSocket from "@/hooks/useSocket";

export default function Chat() {

    const searchParams = useSearchParams();
    const id_chat = searchParams.get("id_chat");
    const [mensajes, setMensajes] = useState([]);
    const [texto, setTexto] = useState("");
    const { socket, isConnected } = useSocket();
    
     useEffect(() => {

        if (!socket || !id_chat) return;

        socket.emit("joinRoom", {
            room: id_chat
        });

        socket.on("newMessage", function(data) {

            if (data.room == id_chat) {

                setMensajes(function(mensajesActuales) {
                    return [...mensajesActuales, data.message];
                });

            }

        });

        return () => {
            socket.off("newMessage");
        };

    }, [socket, id_chat]);
    
    useEffect(() => {

        fetch("http://localhost:4000/usuario", {
            method: "GET",
        })
        .then(response => response.json())
        .then(data => {
            setMiMail(data.mail);
        });

    }, []);

    useEffect(() => {

        if (!id_chat) return;

        fetch(`http://localhost:4000/mensajes/${id_chat}`, {
            method: "GET",
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            setMensajes(data);
        });

    }, [id_chat]);

    return (
        <div>
            <h1>Chat</h1>

               {mensajes.map((mensaje) => (
                <Message
                    key={mensaje.id_mensaje}
                    contenido={mensaje.contenido}
                    mail={mensaje.mail}
                     miMail={miMail}
                />
            ))}
              <Input
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
            />

          
        </div>
    );
}