

export default function ListaChats({titulo, es_grupo, fecha_creacion, foto_chat}){

    return(
        <> 
            <li> 
            <a href={`/chat?id_chat=${id_chat}`}>
                <p>{titulo}</p>
                <p>{es_grupo}</p>
                <p>{fecha_creacion}</p>
                {foto_chat ? <img src={foto_chat} alt="Foto" /> : <img src={"/foto_default.jpg"} alt="Foto por defecto" />}
                </a>
            </li>
        </>
    )
}