const express = require("express");
const cors = require("cors");
const session = require("express-session");
const { Server } = require("socket.io");
const { realizarQuery } = require("./modulos/mysql");

const app = express();
const PORT = process.env.PORT || 4000;
const ORIGENES = ["http://localhost:3000", "http://localhost:3001"];

app.use(cors({ origin: ORIGENES, credentials: true }));
app.use(express.json());

const sessionMiddleware = session({
  secret: "supersarasa",
  resave: false,
  saveUninitialized: false,
});
app.use(sessionMiddleware);

const server = app.listen(PORT, () => {
  console.log(`Servidor NodeJS corriendo en http://localhost:${PORT}/`);
});


const io = new Server(server, {
  cors: {
    origin: ORIGENES,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});

io.use((socket, next) => {
  sessionMiddleware(socket.request, {}, next);
});

let contador = 0;

io.on("connection", (socket) => {
  const req = socket.request;
  const mail = req.session.user; 
  let sala = null;               
  socket.on("joinRoom", async (data) => {
    try {
      if (!mail) return;
      const pertenece = await realizarQuery(
        "SELECT 1 FROM Chat_usuario WHERE mail = ? AND id_chat = ?",
        [mail, data.room]
      );
      if (pertenece.length === 0) return;

      if (sala) socket.leave(sala);
      sala = String(data.room);
      socket.join(sala);
    } catch (error) {
      console.error("Error en joinRoom:", error);
    }
  });

 
  socket.on("sendMessage", async (data) => {
    try {
      const contenido = (data.message || "").trim();
      if (!mail || !sala || !contenido) return;

      const resultado = await realizarQuery(
        "INSERT INTO Mensajes (contenido, fecha_envio, id_chat, mail) VALUES (?, NOW(), ?, ?)",
        [contenido, sala, mail]
      );
      const usuario = await realizarQuery(
        "SELECT nombre FROM Usuarios WHERE mail = ?",
        [mail]
      );

      io.to(sala).emit("newMessage", {
        room: sala,
        message: {
          id_mensaje: resultado.insertId,
          contenido: contenido,
          fecha_envio: new Date(),
          id_chat: Number(sala),
          mail: mail,
          nombre: usuario[0] ? usuario[0].nombre : mail,
        },
      });
    } catch (error) {
      console.error("Error al guardar mensaje:", error);
    }
  });

  socket.on("pingAll", (data) => {
    io.emit("pingAll", { event: "Ping to all", message: data });
  });

  socket.on("eventoPersonalizado", () => {
    contador++;
    socket.emit("respuestaPersonalizada", { contador });
  });

  socket.on("disconnect", () => {
    console.log("Disconnect");
  });
});


app.post("/register", async function (req, res) {
  try {
    const { nombre, mail, contrasena } = req.body;
    const foto_perfil = req.body.foto_perfil || "";

    if (!nombre || !mail || !contrasena) {
      return res.send({ res: "Todos los campos son obligatorios" });
    }

    const existente = await realizarQuery(
      "SELECT mail FROM Usuarios WHERE mail = ?",
      [mail]
    );
    if (existente.length > 0) {
      return res.send({ res: "Ya existe este usuario" });
    }

    await realizarQuery(
      "INSERT INTO Usuarios (mail, nombre, contrasena, foto_perfil) VALUES (?, ?, ?, ?)",
      [mail, nombre, contrasena, foto_perfil]
    );
    res.send({ res: "Usuario agregado" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ res: "Error del servidor" });
  }
});

app.post("/login", async function (req, res) {
  try {
    const { mail, contrasena } = req.body;
    if (!mail || !contrasena) {
      return res.send({ res: "No pueden haber campos vacíos" });
    }

    const usuario = await realizarQuery(
      "SELECT mail, nombre, foto_perfil FROM Usuarios WHERE mail = ? AND contrasena = ?",
      [mail, contrasena]
    );

    if (usuario.length > 0) {
      req.session.user = usuario[0].mail;
      res.send({ res: "Login correcto", usuario: usuario[0] });
    } else {
      res.status(401).send({ res: "Mail o contraseña incorrectos" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ res: "Error del servidor" });
  }
});

app.get("/usuario", function (req, res) {
  res.send({ mail: req.session.user || null });
});

app.post("/logout", function (req, res) {
  req.session.destroy(() => res.send({ res: "Sesión cerrada" }));
});


app.get("/chats", async function (req, res) {
  try {
    if (!req.session.user) {
      return res.status(401).send({ res: "Usuario no registrado" });
    }

    const chats = await realizarQuery(
      `SELECT c.id_chat, c.es_grupo, c.fecha_creacion,
              IF(c.es_grupo, c.titulo, u.nombre) AS titulo,
              IF(c.es_grupo, c.foto_chat, u.foto_perfil) AS foto_chat
       FROM Chats c
       INNER JOIN Chat_usuario cu ON cu.id_chat = c.id_chat AND cu.mail = ?
       LEFT JOIN Chat_usuario cu2 ON cu2.id_chat = c.id_chat AND cu2.mail <> ? AND c.es_grupo = 0
       LEFT JOIN Usuarios u ON u.mail = cu2.mail
       ORDER BY c.id_chat DESC`,
      [req.session.user, req.session.user]
    );

    res.send(chats);
  } catch (error) {
    console.error(error);
    res.status(500).send({ res: "Error del servidor" });
  }
});

app.post("/chatIndividual", async function (req, res) {
  try {
    if (!req.session.user) {
      return res.status(401).send({ res: "Usuario no registrado" });
    }
    const mailOtro = (req.body.mail || "").trim();

    if (!mailOtro) return res.send({ res: "Ingresá un mail" });
    if (mailOtro === req.session.user) {
      return res.send({ res: "No podés crear un chat con vos mismo" });
    }

    const usuario = await realizarQuery(
      "SELECT mail FROM Usuarios WHERE mail = ?",
      [mailOtro]
    );
    if (usuario.length === 0) {
      return res.send({ res: "No existe este usuario" });
    }

   
    const repetido = await realizarQuery(
      `SELECT c.id_chat FROM Chats c
       INNER JOIN Chat_usuario a ON a.id_chat = c.id_chat AND a.mail = ?
       INNER JOIN Chat_usuario b ON b.id_chat = c.id_chat AND b.mail = ?
       WHERE c.es_grupo = 0`,
      [req.session.user, mailOtro]
    );
    if (repetido.length > 0) {
      return res.send({ res: "Ya tenés un chat con este usuario" });
    }

  const chat = await realizarQuery(
    "INSERT INTO Chats (titulo, es_grupo, fecha_creacion, foto_chat) VALUES (?, 0, NOW(), '')",
    ["Chat individual"]
  );

   await realizarQuery(
  "INSERT INTO Chat_usuario (mail, id_chat) VALUES (?, ?)",
  [req.session.user, chat.insertId]
);

await realizarQuery(
  "INSERT INTO Chat_usuario (mail, id_chat) VALUES (?, ?)",
  [mailOtro, chat.insertId]
);

    res.send({ res: "Chat creado", id_chat: chat.insertId });
  } catch (error) {
    console.error("ERROR DETALLADO EN CHAT INDIVIDUAL:", error);
    res.status(500).send({ res: "Error del servidor", detalle: error.message });
  }
});

app.post("/grupal", async function (req, res) {
  try {
    if (!req.session.user) {
      return res.status(401).send({ res: "Usuario no registrado" });
    }

    const { titulo } = req.body;
    const foto_chat = req.body.foto_chat || "";


    let mails = req.body.mails || [];
    if (typeof mails === "string") mails = mails.split(",");
    mails = [...new Set(mails.map((m) => m.trim()).filter((m) => m !== ""))];
    mails = mails.filter((m) => m !== req.session.user);

    if (!titulo || mails.length === 0) {
      return res.send({ res: "Ingresá un nombre y al menos un mail" });
    }

    for (let i = 0; i < mails.length; i++) {
      const existe = await realizarQuery(
        "SELECT mail FROM Usuarios WHERE mail = ?",
        [mails[i]]
      );
      if (existe.length === 0) {
        return res.send({ res: "No existe el usuario " + mails[i] });
      }
    }

    const chat = await realizarQuery(
      "INSERT INTO Chats (titulo, es_grupo, fecha_creacion, foto_chat) VALUES (?, true, NOW(), ?)",
      [titulo, foto_chat]
    );

    const integrantes = [req.session.user, ...mails];
    for (let i = 0; i < integrantes.length; i++) {
      await realizarQuery(
        "INSERT INTO Chat_usuario (mail, id_chat) VALUES (?, ?)",
        [integrantes[i], chat.insertId]
      );
    }

    res.send({ res: "Grupo creado", id_chat: chat.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).send({ res: "Error del servidor" });
  }
});

app.get("/mensajes/:id_chat", async function (req, res) {
  try {
    if (!req.session.user) {
      return res.status(401).send({ res: "Usuario no registrado" });
    }

    const pertenece = await realizarQuery(
      "SELECT 1 FROM Chat_usuario WHERE mail = ? AND id_chat = ?",
      [req.session.user, req.params.id_chat]
    );
    if (pertenece.length === 0) {
      return res.status(403).send({ res: "No pertenecés a este chat" });
    }

    const mensajes = await realizarQuery(
      `SELECT m.id_mensaje, m.contenido, m.fecha_envio, m.id_chat, m.mail, u.nombre
       FROM Mensajes m
       INNER JOIN Usuarios u ON u.mail = m.mail
       WHERE m.id_chat = ?
       ORDER BY m.id_mensaje ASC`,
      [req.params.id_chat]
    );

    res.send(mensajes);
  } catch (error) {
    console.error(error);
    res.status(500).send({ res: "Error del servidor" });
  }
});
