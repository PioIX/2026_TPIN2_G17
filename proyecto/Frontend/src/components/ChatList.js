"use client"
import ChatItem from "./ChatItem";
import styles from "./ChatList.module.css"

export default function ChatList({ chats }) {
    if (chats.length === 0) {
        return <p className={styles.vacio}>Todavía no tenés chats. Creá uno nuevo.</p>;
    }

    return (
        <ul className={styles.lista}>
            {chats.map((chat) => (
                <ChatItem key={chat.id_chat} {...chat} />
            ))}
        </ul>
    );
}
