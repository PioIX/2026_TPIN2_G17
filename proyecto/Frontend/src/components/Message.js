export default function Message({ contenido, mail, miMail }) {

    const enviado = mail === miMail;

    return (
        <div>
            <p>
                {enviado ? "Yo: " : mail + ": "}
                {contenido}
            </p>
        </div>
    );
}