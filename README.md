# TP2 - Chat en Tiempo Real

Este proyecto consiste en una plataforma de mensajería y chat en tiempo real. La aplicación permite que varios usuarios se registren, inicien sesión, armen chats individuales o grupales y se comuniquen de forma instantánea. Todos los mensajes se guardan en la base de datos, por lo que el historial de cada conversación se conserva.

El sistema está estructurado con una arquitectura cliente-servidor:

* **Backend:** Construido sobre Node.js y Express, utilizando Socket.io para manejar la comunicación bidireccional en tiempo real y MySQL como base de datos para la persistencia de usuarios, chats y mensajes.
* **Frontend:** Desarrollado con Next.js y React, diseñado para soportar múltiples instancias simultáneas en diferentes puertos, permitiendo así probar y simular la interacción en tiempo real entre distintos usuarios de manera independiente.

Entre sus funciones principales se encuentran el registro de usuarios con foto de perfil opcional, el listado de chats con la foto y el nombre de cada contacto o grupo, la creación de chats individuales a partir del mail de otro usuario y la creación de grupos con varios integrantes.

## Credenciales de prueba

Para ingresar al sistema y realizar pruebas de mensajería entre distintos usuarios, se pueden utilizar las siguientes cuentas cargadas previamente en la base de datos:

* **Usuario 1 (Admin)**
  * Mail: `a@pioix.edu.ar`
  * Contraseña: `123`

* **Usuario 2 (Profes)**
  * Mail: `p@pioix.edu.ar`
  * Contraseña: `123`

## Integrantes

* Hilario Reddel
* Tomas Miranda
* Lucas Fabiani
* Facundo Poet

