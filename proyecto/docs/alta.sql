CREATE TABLE IF NOT EXISTS Usuarios(
	mail VARCHAR(100),
    nombre VARCHAR(100),
    contrasena VARCHAR(100),
    foto_perfil VARCHAR(100),
    PRIMARY KEY(mail)
);

CREATE TABLE IF NOT EXISTS Chats(
	id_chat INT AUTO_INCREMENT UNIQUE,
    titulo VARCHAR(100),
    es_grupo BOOL,
    fecha_creacion DATE,
    foto_chat VARCHAR(100),
    PRIMARY KEY(id_chat)
);

CREATE TABLE IF NOT EXISTS Chatusuario(
	mail VARCHAR(100),
    id_chat INT UNIQUE,
    FOREIGN KEY (mail) REFERENCES Usuarios(mail),
    FOREIGN KEY (id_chat) REFERENCES Chats(id_chat)
);


CREATE TABLE IF NOT EXISTS Mensajes(
    id_mensaje INT AUTO_INCREMENT UNIQUE,
    contenido VARCHAR(100),
    fecha_envio DATE,
    id_chat INT,
    mail VARCHAR(100),
    PRIMARY KEY(id_mensaje),
    FOREIGN KEY (mail) REFERENCES Usuarios(mail),
    FOREIGN KEY (id_chat) REFERENCES Chats(id_chat)
);


INSERT INTO Usuarios(mail, nombre, contrasena, foto_perfil)
VALUES	("a@pioix.edu.ar", "Admin", "123",""),
		("p@pioix.edu.ar", "Profes", "123","");
        
INSERT INTO Chats(titulo, es_grupo, fecha_creacion, foto_chat)
VALUES 	("Grupo de estudios", TRUE, "2026-03-01",""),
		("Papá", FALSE,"2021-05-07",""),
		("Mamá", FALSE,"2021-05-08","");
        
INSERT INTO Mensajes(contenido,fecha_envio)
 VALUES	("Hola como estas??", "2025-06-17"),
		("Todo bien!", "2025-06-17");