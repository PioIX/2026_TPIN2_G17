
import ListaChats from "./ListaChats";
export default function ChatItem({id_chat, titulo, es_grupo, fecha_creacion, foto_chat}){

    return(
        <> 
            <ListaChats 
                titulo={titulo}
                es_grupo={es_grupo}
                fecha_creacion={fecha_creacion}
                foto_chat={foto_chat}
                id_chat={id_chat}
            />
            
        </>
    )
}