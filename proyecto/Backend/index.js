const express = require("express");
const cors = require("cors");
const session = require("express-session");
const { Server } = require("socket.io");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
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
    origin: ["http://localhost:3000", "http://localhost:3001"],
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

  socket.on("joinRoom", (data) => {
    if (req.session.room != undefined && req.session.room.length > 0) {
      socket.leave(req.session.room);
    }
    req.session.room = data.room;
    socket.join(req.session.room);

    io.to(req.session.room).emit("chat-messages", {
      user: req.session.user,
      room: req.session.room,
    });
  });

  socket.on("pingAll", (data) => {
    console.log("PING ALL:", data);
    io.emit("pingAll", { event: "Ping to all", message: data });
  });

  socket.on("sendMessage", (data) => {
    io.to(req.session.room).emit("newMessage", {
      room: req.session.room,
      message: data.message,
    });
  });

  socket.on("eventoPersonalizado", () => {
    contador++;
    socket.emit("respuestaPersonalizada", { contador });
  });

  socket.on("disconnect", () => {
    console.log("Disconnect");
  });
});

app.post('/register', async function (req, res) {
  try {
    console.log(req.body)
    let usuarioExistente = await realizarQuery(`SELECT mail FROM Usuarios WHERE mail='${req.body.mail}' `);
    console.log(req.body)
    if (usuarioExistente.length > 0) {
      res.send({ res: "Ya existe este usuario" });
    }
    else {
      realizarQuery(`
      INSERT INTO Usuarios (nombre, mail, contrasena, foto_perfil) VALUES
      ("${req.body.nombre}","${req.body.mail}","${req.body.contrasena}","${req.body.foto_perfil}")`)
      res.send({ res: "Usuario agregado" })
    }

  } catch (error) {
    console.error("Error al borrar:", error);
    res.status(500).send({
      res: "Error del servidor"
    });
  }
})

app.post('/login', async function (req, res) {
  try {
    if (!req.body.mail || !req.body.contrasena) {
      return res.send({ res: "No pueden haber campos vacíos" });
    }
    let usuario = await realizarQuery(`SELECT * FROM Usuarios WHERE mail='${req.body.mail}' AND contrasena='${req.body.contrasena}'`);
    if (usuario.length > 0) {
      res.send({ res: "Login correcto", usuario: usuario[0] });
    } else {
      res.status(401).send({ res: "Mail o contraseña incorrectos" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ res: "Error del servidor" });
  }
});


app.get('/listadoChats', function (req, res) {
    try {
        // 1. Buscamos los chats del usuario logueado
        const [chats] = await db.query(
            `SELECT Chats.id_chat, Chats.titulo, Chats.es_grupo, Chats.foto_chat 
             FROM Chat_usuario 
             JOIN Chats ON Chat_usuario.id_chat = Chats.id_chat 
             WHERE Chat_usuario.mail = ?`,
            [mail]
        );
  })
}

