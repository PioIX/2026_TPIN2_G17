
import ChatItem from "./ChatItem";

export default function ChatList({ chats }) {
    return (
        <ul>
            {chats.map((chat) => (
                <ChatItem
                    key={chat.id_chat}
                    {...chat}
                />
            ))}
        </ul>
    );
}