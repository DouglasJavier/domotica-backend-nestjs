# Installation Guide

**Node.js**: Ensure that version **20** of Node.js is installed.

**Database**: Create the necessary database with the required schemas for `usuarios` and `proyecto`.

**Environment Configuration**: Make sure you are in the project directory and set up the environment variables in the `.env` file:
```bash
cp .env.sample .env
   ```

**Install Dependencies**: To install all project dependencies, run the following command:
   ```bash
   npm install
   ```
To start the project in development mode, use:
   ```bash
   npm run start:dev
   ```
For production mode, run the following commands (ensure PM2 is installed):

    npm run build
    pm2 start dist/src/main.js


# Guía de Instalación

**Node.js**: Asegúrate de tener instalada la versión **20** de Node.js.

**Base de Datos**: Crea la base de datos necesaria con los esquemas correspondientes para `usuarios` y `proyecto`.

**Configuración del Entorno**: Asegúrate de estar en el directorio del proyecto y configura las variables de entorno en el archivo `.env`.
```bash
cp .env.sample .env
   ```

**Instalación de Dependencias**: Para instalar todas las dependencias del proyecto, ejecuta el siguiente comando:
   ```bash
   npm install
   ```
Para iniciar el proyecto en modo de desarrollo, utilize:
   ```bash
   npm run start:dev
   ```
Para el modo de producción, ejecuta los siguientes comandos (asegúrate de tener PM2 instalado):

    npm run build
    pm2 start dist/src/main.js