SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS Mensajes;
DROP TABLE IF EXISTS Chat_usuario;
DROP TABLE IF EXISTS Chatusuario;
DROP TABLE IF EXISTS Chats;
DROP TABLE IF EXISTS Usuarios;

SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE Usuarios (
    mail VARCHAR(100),
    nombre VARCHAR(100),
    contrasena VARCHAR(100),
    foto_perfil VARCHAR(500),
    PRIMARY KEY (mail)
);

CREATE TABLE Chats (
    id_chat INT AUTO_INCREMENT,
    titulo VARCHAR(100),
    es_grupo BOOL,
    fecha_creacion DATE,
    foto_chat VARCHAR(500),
    PRIMARY KEY (id_chat)
);

CREATE TABLE Chat_usuario (
    mail VARCHAR(100),
    id_chat INT,
    PRIMARY KEY (mail, id_chat),
    FOREIGN KEY (mail) REFERENCES Usuarios(mail),
    FOREIGN KEY (id_chat) REFERENCES Chats(id_chat)
);

CREATE TABLE Mensajes (
    id_mensaje INT AUTO_INCREMENT,
    contenido VARCHAR(500),
    fecha_envio DATE,
    id_chat INT,
    mail VARCHAR(100),
    PRIMARY KEY (id_mensaje),
    FOREIGN KEY (mail) REFERENCES Usuarios(mail),
    FOREIGN KEY (id_chat) REFERENCES Chats(id_chat)
);

INSERT INTO Usuarios (mail, nombre, contrasena, foto_perfil) VALUES 
    ('a@pioix.edu.ar', 'Admin', '123', 'admin.jpg'),
    ('p@pioix.edu.ar', 'Profes', '123', '');

INSERT INTO Chats (titulo, es_grupo, fecha_creacion, foto_chat) VALUES 
    ('Grupo de estudios', TRUE, '2026-03-01', ''),
    ('Chat individual', FALSE, '2026-03-02', '');

INSERT INTO Chat_usuario (mail, id_chat) VALUES 
    ('a@pioix.edu.ar', 1),
    ('p@pioix.edu.ar', 1),
    ('a@pioix.edu.ar', 2),
    ('p@pioix.edu.ar', 2);

INSERT INTO Mensajes (contenido, fecha_envio, id_chat, mail) VALUES 
    ('Hola, como estan?', '2026-03-01', 1, 'a@pioix.edu.ar'),
    ('Todo bien!', '2026-03-01', 1, 'p@pioix.edu.ar'),
    ('Hola profe', '2026-03-02', 2, 'a@pioix.edu.ar');