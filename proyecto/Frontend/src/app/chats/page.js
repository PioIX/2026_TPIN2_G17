"use client";

import { useState, useEffect } from "react";
import ChatList from "@/components/ChatList";
import Popup from "reactjs-popup";
import Button from "@/components/Button";

export default function Chats() {

    const [chats, setChats] = useState([]);
    const [mail, setMail] = useState("");
    const [mails, setMails] = useState([]);
    const [titulo, setTitulo] = useState("");
    const [foto_chat, setFoto_chat] = useState("");

    useEffect(() => {

        fetch("http://localhost:4000/chats", {
            method: "GET",
            credentials: "include"
        })
        .then(response => response.json())
        .then(data => {

            console.log(data);

            if (data.res === "Usuario no registrado") {
                alert(data.res);
            } else {
                setChats(data);
            }

        });

    }, []);

    function crearChat(){ fetch("http://localhost:4000/chatIndividual", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({
                mail: mail
        })
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);

            if (data.res === "Chat creado") {
                alert("Chat creado");
        } 
        else {
        alert(data.res);
    }

})}

    function crearGrupo(){  
        fetch("http://localhost:4000/grupal", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
        },
            credentials: "include",
            body: JSON.stringify({
                    mails: mails,
                    titulo: titulo,
                foto_chat: foto_chat
    })
})  .then(response => response.json())
    .then(data => {
        console.log(data);

        if (data.res === "Grupo creado") {
            alert("Grupo creado");
        }else {
            alert(data.res);
    }

});}

    return (
        <div>
            <ChatList chats={chats} />
             <Popup
                trigger={<Button>Nuevo chat</Button>}
                modal
            >   {close => (
                    <div>

                        <h2>Nuevo chat</h2>

                        <input
                            type="email"
                            placeholder="Mail del usuario"
                            value={mail}
                            onChange={(e) => setMail(e.target.value)}
                        />

                        <button onClick={() => {
                            crearChat();
                            close();
                        }}>
                            Crear chat
                        </button>

                        <button onClick={close}>
                            Cancelar
                        </button>

                    </div>
                )}
            </Popup>

            <Popup
                trigger={<Button>Nuevo grupo</Button>}
                modal
            >
                {close => (
                    <div>

                        <h2>Nuevo grupo</h2>

                        <input
                            type="text"
                            placeholder="Nombre del grupo"
                            value={titulo}
                            onChange={(e) => setTitulo(e.target.value)}
                        />

                        <input
                            type="text"
                            placeholder="Mails separados por coma"
                            value={mails}
                            onChange={(e) => setMails(e.target.value)}
                        />

                        <input
                            type="text"
                            placeholder="Foto del grupo"
                            value={foto_chat}
                            onChange={(e) => setFoto_chat(e.target.value)}
                        />

                        <button onClick={() => {
                            crearGrupo();
                            close();
                        }}>
                            Crear grupo
                        </button>

                        <button onClick={close}>
                            Cancelar
                        </button>

                    </div>
                )}
            </Popup>
        </div>
    );
}