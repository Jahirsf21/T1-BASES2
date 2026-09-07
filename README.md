# Tarea 1 – API

**Institución:** Tecnológico de Costa Rica, Centro Académico de Limón
**Curso:** Bases de Datos II
**Grupo:** 60
**Profesor:** Ing. Cristian Paz Campos Agüero
**Semestre:** II Semestre 2026

## Estudiantes
| Nombre                   | Carnet      |
|--------------------------|-------------|
| Deislher Sanchez Funez   | 2023032794  |

## Introducción

Esta tarea implementa una aplicación con frontend, API y SQL Server (en una distribución linux) para consultar la base de datos AdventureWorks.

## Requisitos

- [Node.js](https://nodejs.org/es/download)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) con WSL
- [SQL Server Management Studio (SSMS)](https://learn.microsoft.com/es-es/ssms/install/install)
- pnpm

Para instalar pnpm después de instalar Node.js:

```powershell
npm install --global pnpm
```

## SQL Server 2025 con Docker y AdventureWorks

### 1. Instalar WSL

```powershell
wsl --install
```

Después, abra la terminal de WSL y actualice los paquetes:

```bash
sudo apt update && sudo apt upgrade -y
```

### 2. Descargar y ejecutar SQL Server

En PowerShell o CMD, descargue la imagen:

```powershell
docker pull mcr.microsoft.com/mssql/server:2025-latest
```

Luego cree el contenedor. Reemplace `TUCONTRASEÑA` por una contraseña segura, la contraseña debe tener al menos ocho caracteres y contener caracteres de tres de los siguientes cuatro conjuntos: letras mayúsculas, letras minúsculas, dígitos en base 10 y símbolos. Las contraseñas pueden tener hasta 128 caracteres. para `sa`.

```powershell
docker run -e "ACCEPT_EULA=Y" -e "MSSQL_SA_PASSWORD=TUCONTRASEÑA" -p 1433:1433 --name T1-BASES2 --hostname T1-BASES2 -d mcr.microsoft.com/mssql/server:2025-latest
```

Consulte la [guía oficial de Microsoft](https://learn.microsoft.com/es-es/sql/linux/install-upgrade/quickstart-install-docker?view=sql-server-ver17&tabs=cli&pivots=cs1-bash) si necesita ayuda con Docker o SQL Server.

### 3. Conectar mediante SSMS

| Campo | Valor |
|---|---|
| Server Name | `localhost,1433` |
| Autenticación | SQL Server Authentication |
| Usuario | `sa` |
| Contraseña | La definida al crear el contenedor |
| Trust server certificate | Activado |

### 4. Restaurar AdventureWorks2025

1. Descargue el respaldo OLTP `AdventureWorks2025.bak`.
2. Copie el respaldo al contenedor (La ruta puede variar segun donde los hayas descargado):

   ```powershell
   docker exec -it T1-BASES2 mkdir -p /var/opt/mssql/backup
   docker cp "$env:USERPROFILE\OneDrive\Escritorio\AdventureWorks2025.bak" T1-BASES2:/var/opt/mssql/backup/AdventureWorks2025.bak
   ```

3. En SSMS, haga clic derecho en **Databases** y seleccione **Restore Database...**.
4. En **Source**, seleccione **Device** y agregue `/var/opt/mssql/backup/AdventureWorks2025.bak`.
5. Verifique que el respaldo esté marcado en **Backup sets to restore** y ejecute la restauración.
6. Actualice **Databases** para confirmar que aparece `AdventureWorks2025`.

## Dependencias

El backend usa `mssql`, `dotenv` y `express` para conectarse a SQL Server y exponer la API. También incluye `cors` para permitir las solicitudes del frontend.

El frontend usa Shadcn para los componentes, Tailwind CSS para los estilos y Lucide React para los iconos.

Las dependencias se instalan con `pnpm install` en cada proyecto.

## Configuración de variables de entorno

### Backend

Cree el archivo `proyectos/backend/src/.env.local` con este contenido. Complete `DB_USER` y `DB_PASSWORD` con las credenciales configuradas en SQL Server.

```env
DB_NAME=AdventureWorks2025
DB_USER=
DB_HOST=localhost
DB_PORT=1433
DB_PASSWORD=
API_PORT=3002
APP_PORT=3000
```

### Frontend

Cree el archivo `proyectos/frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3002
```

## Ejecutar los scripts SQL

1. Conéctese desde SSMS a la base de datos `AdventureWorks2025`.
2. Cree una **Nueva consulta**.
3. Copie y ejecute todo el contenido de [Script sql/store-procedures.sql](Script%20sql/store-procedures.sql).

## Levantar el proyecto

### Backend

En una terminal:

```powershell
cd proyectos/backend
pnpm install
cd src
node server.js
```

La API quedará disponible en `http://localhost:3002`.

### Frontend

En otra terminal:

```powershell
cd proyectos/frontend
pnpm install
pnpm run dev
```

Abra la dirección que muestre Next.js, normalmente `http://localhost:3000`.

### Estado de la tarea: Completa

### [Enlace del video](https://youtu.be/an2oe07fXH8)
