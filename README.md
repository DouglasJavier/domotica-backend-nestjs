# Description

This repository contains the **backend of the home security system**.

The application consists of several modules to manage alarms, sensors, cameras, and the interaction with **ESP-32** devices. The main modules are:

- **Alarm**: Logs events in the Activation/Deactivation History module and communicates with **ESP-32** devices to receive information from active sensors.
- **Security Incidents**: Only logs events if an alarm is active. It receives reports from the **ESP-32**, requests three photographs via HTTP GET requests from the device that reported the incident, and stores them in the database.
- **Task**: Manages scheduled tasks (CRON JOBS), primarily linked to the **Presence Simulator**. It sends POST requests to **ESP-32** devices with configured actuators, based on the simulator's settings.
- **Devices**: Allows CRUD operations on devices, configuring the input/output pins of the **ESP-32**, and retransmits video from the **ESP-32 CAM** cameras.
- **Contacts, Simulator, Locations, and Users**: These modules allow managing relevant information through CRUD operations, with access controlled by user permissions.

Each of these modules is designed to integrate with the system's security infrastructure, enabling the control and monitoring of sensors and devices.

For more details, see the `docs` folder.

## Related Repositories

The other parts of the project can be found in the following repositories:

- **Frontend**: [domotica-frontend-react-vite](https://github.com/DouglasJavier/domotica-frontend-react-vite)
- **ESP32-CAM**: [camaraDomotica](https://github.com/DouglasJavier/camaraDomotica)

## General Project Description
The project is based on the use of open-source hardware and software, utilizing devices such as the ESP-32 CAM, which allows flexibility in adding or removing sensors and actuators. These include PIR HC-SR501 sensors, CO M-Q7 sensors, along with relay module actuators. The system management is carried out through client-server applications developed in React, Vite, and NestJS, supported by a PostgreSQL database and notifications sent via Telegram. For security, JWT tokens were implemented for client-server communication, along with password protection for the ESP-32 devices.
The system achieves most of the expected functionalities for a home security system, though it has limitations such as the control of electrical, water, or gas networks in the residence, as well as the absence of intercom systems and smart locks.


# Descripción

Este repositorio contiene el **backend del sistema domótico de seguridad**.

La aplicación se compone de varios módulos para gestionar las alarmas, sensores, cámaras y la interacción con dispositivos **ESP-32**. Los principales módulos son:

- **Alarma**: Registra eventos en el módulo de Historial de Activación/Desactivación y se comunica con las **ESP-32** para recibir información de los sensores activos.
- **Incidentes de Seguridad**: Solo registra eventos si alguna alarma está activada. Recibe reportes de las **ESP-32**, solicita tres fotografías a través de consultas HTTP GET al dispositivo que reportó el incidente, y las almacena en la base de datos.
- **Task**: Maneja tareas programadas (CRON JOBS), principalmente vinculadas al **Simulador de Presencia**. Envía solicitudes POST a las **ESP-32** con actuadores configurados, según la configuración del simulador.
- **Dispositivos**: Permite realizar operaciones CRUD sobre los dispositivos, configurando los pines de entrada/salida de las **ESP-32**, y retransmite video desde las cámaras **ESP-32 CAM**.
- **Contactos, Simulador, Ubicaciones y Usuario**: Estos módulos permiten gestionar la información relevante a través de operaciones CRUD, y su acceso está controlado por los permisos de usuario.

Cada uno de estos módulos está diseñado para integrarse con la infraestructura de seguridad del sistema, facilitando el control y monitoreo de sensores y dispositivos.

Para obtener más detalles, consulta la carpeta `docs`.

## Repositorios relacionados

Las demás partes del proyecto se encuentran en los siguientes repositorios:

- **Frontend**: [domotica-frontend-react-vite](https://github.com/DouglasJavier/domotica-frontend-react-vite)
- **ESP32-CAM**: [camaraDomotica](https://github.com/DouglasJavier/camaraDomotica)

## Descripcion general del proyecto
El proyecto se basó en la utilización de hardware y software de código abierto, haciendo uso de dispositivos como ESP-32 CAM, que permite la flexibilidad de añadir o quitar sensores y actuadores. Entre ellos se encuentran los sensores PIR HC-SR501 y sensores de CO M-Q7, junto con actuadores como módulos relé. Para la gestión del sistema, se emplearon aplicaciones cliente-servidor desarrolladas en React, Vite y NestJS, respaldadas por una base de datos PostgreSQL y envío de notificaciones a través de Telegram. En términos de seguridad, se implementaron tokens JWT tanto para la comunicación cliente-servidor y password para las ESP-32.
El sistema logra la mayoría de las funcionalidades esperadas para un sistema domótico de seguridad, aunque tiene limitaciones como el control de las redes eléctricas, de agua o gas de la residencia, así como la ausencia de portero automático y cerraduras inteligentes.
