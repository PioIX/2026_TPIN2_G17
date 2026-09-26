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
  let foto = req.body.foto_perfil || "foto_default.png";
  try {
    console.log(req.body)
    if (!req.body.nombre || !req.body.mail || !req.body.contrasena) {
      return res.send({ res: "Todos los campos son obligatorios" });
    }
    let usuarioExistente = await realizarQuery(`SELECT mail FROM Usuarios WHERE mail='${req.body.mail}' `);
    console.log(req.body)
    if (usuarioExistente.length > 0) {
      res.send({ res: "Ya existe este usuario" });
    }
    
    else {
      realizarQuery(`
      INSERT INTO Usuarios (nombre, mail, contrasena, foto) VALUES
      ("${req.body.nombre}","${req.body.mail}","${req.body.contrasena}","${req.body.foto}")`)
      res.send({ res: "Usuario agregado" })
    }

  } catch (error) {
    console.error("Error:", error);
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
    let usuario = await realizarQuery(`SELECT mail, nombre, foto_perfil FROM Usuarios WHERE mail='${req.body.mail}' AND contrasena='${req.body.contrasena}'`);
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


app.get('/chats', async function (req, res) {
  try {
    if (!req.session.user) {
      return res.status(401).send({ res: "Usuario no registrado" });
    }
    let chats = await realizarQuery(`SELECT * FROM Chats  INNER JOIN Chat_usuario ON Chats.id_chat = Chat_usuario.id_chat WHERE Chat_usuario.mail = '${req.session.user}'`);

    res.send(chats);

  } catch (error) {
    console.error(error);
    res.status(500).send({
      res: "Error del servidor"
    });
  }
});

app.post('/chatIndividual', async function (req, res) {
  try {
    let usuarioExistente = await realizarQuery(`
      SELECT mail FROM Usuarios
      WHERE mail='${req.body.mail}'
    `);

    if (usuarioExistente.length === 0) {
      return res.send({ res: "No existe este usuario" });
    }

    let chat = await realizarQuery(`
      INSERT INTO Chats (titulo, es_grupo, fecha_creacion, foto_chat)
      VALUES ("Chat", false, CURDATE(), "")
    `);

    let id_chat = chat.insertId;

    await realizarQuery(`
      INSERT INTO Chat_usuario (mail, id_chat)
      VALUES
      ('${req.session.user}', ${id_chat}),
      ('${req.body.mail}', ${id_chat})
    `);

    res.send({ res: "Chat creado", id_chat: id_chat });

  } catch (error) {
    console.error(error);
    res.status(500).send({
      res: "Error del servidor"
    });
  }
});


app.post('/grupal', async function (req, res) {
  try {
    for (let i = 0; i < req.body.mails.length; i++) {
      let usuarioExistente = await realizarQuery(`
        SELECT mail FROM Usuarios WHERE mail='${req.body.mails[i]}'`);

      if (usuarioExistente.length === 0) {
        return res.send({
          res: "No existe el usuario " + req.body.mails[i]
        });
      }
    }

    let chat = await realizarQuery(`
      INSERT INTO Chats (titulo, es_grupo, fecha_creacion, foto_chat)
      VALUES (
        "${req.body.titulo}",
        true,
        CURDATE(),
        "${req.body.foto_chat}"
      )
    `);

    let id_chat = chat.insertId;

    await realizarQuery(`
      INSERT INTO Chat_usuario (mail, id_chat)
      VALUES ('${req.session.user}', ${id_chat})
    `);

    for (let i = 0; i < req.body.mails.length; i++) {
      await realizarQuery(`
        INSERT INTO Chat_usuario (mail, id_chat)
        VALUES ('${req.body.mails[i]}', ${id_chat})
      `);
    }

    res.send({
      res: "Grupo creado",
      id_chat: id_chat
    });

  } catch (error) {
    console.error(error);
    res.status(500).send({
      res: "Error del servidor"
    });
  }
});

app.get('/mensajes/:id_chat', async function (req, res) {
  try {
    let mensajes = await realizarQuery(`
      SELECT * FROM Mensajes WHERE id_chat = ${req.params.id_chat} ORDER BY fecha_envio ASC
    `);

    res.send(mensajes);

  } catch (error) {
    console.error(error);
    res.status(500).send({
      res: "Error del servidor"
    });
  }
});

app.get('/usuario', function (req, res) {

    res.send({
        mail: req.session.user
    });

});