# Ionic 7 + Angular + SQLite Starter Template 🚀

Este proyecto es una plantilla profesional para desarrollar aplicaciones híbridas utilizando **Ionic 7**, **Angular 16** y el plugin **@capacitor-community/sqlite**. Está diseñado para ser una base sólida que permite gestionar una base de datos local SQLite de forma persistente en múltiples plataformas (Android, iOS y Web).

---

## 📋 Tabla de Contenidos

1. [Características](#-características)
2. [Arquitectura del Proyecto](#-arquitectura-del-proyecto)
3. [Requisitos Previos](#-requisitos-previos)
4. [Instalación](#-instalación)
5. [Guía de Desarrollo (Paso a Paso)](#-guía-de-desarrollo-paso-a-paso)
6. [Persistencia en la Web (WASM)](#-persistencia-en-la-web-wasm)
7. [Despliegue en Android/iOS](#-despliegue-en-androidios)
8. [Scripts Útiles](#-scripts-útiles)

---

## ✨ Características

- **Multiplataforma**: Funciona en Navegador (WASM), Android, iOS y Electron.
- **SQLite Local**: Persistencia de datos robusta sin necesidad de internet.
- **Inicialización Automática**: La base de datos se configura al arrancar la app.
- **Estructura Modular**: Separación clara entre la lógica de UI y el acceso a datos.

---

## 🏗 Arquitectura del Proyecto

El proyecto utiliza una jerarquía de servicios para gestionar la base de datos de forma segura:

### 1. `SQLiteService` (`src/app/services/sqlite.service.ts`)
Es el encargado de la conexión de bajo nivel. Detecta la plataforma, inicializa el plugin de Capacitor y gestiona la apertura de conexiones. También maneja el almacenamiento persistente en la web usando **WASM**.

### 2. `TaskService` (`src/app/services/task.service.ts`)
Contiene la lógica de negocio de la aplicación (en este caso, una lista de tareas).
- Define el esquema de la tabla:
  ```sql
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    completed INTEGER DEFAULT 0
  );
  ```
- Expone métodos CRUD: `addTask()`, `loadTasks()`, `updateTask()`, `deleteTask()`.

### 3. `AppModule` (`src/app/app.module.ts`)
Utiliza un `APP_INITIALIZER` para llamar a `taskService.initializeFull()` antes de que la aplicación termine de cargar. Esto garantiza que la base de datos esté lista antes de que el usuario vea la pantalla principal.

---

## 🛠 Requisitos Previos

Antes de empezar, asegúrate de tener instalado:

- [Node.js](https://nodejs.org/) (versión 16 o superior recomendada).
- [Ionic CLI](https://ionicframework.com/docs/intro/cli): `npm install -g @ionic/cli`.
- Para móvil: Android Studio (con SDKs actualizados) o Xcode (macOS).

---

## 🚀 Instalación

1. **Clonar el repositorio**:
   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd <NOMBRE_DEL_DIRECTORIO>
   ```

2. **Instalar dependencias**:
   ```bash
   npm install
   ```

3. **Configurar SQLite para Web**:
   El proyecto usa un archivo `.wasm` para que SQLite funcione en el navegador. Este se copia automáticamente al ejecutar los comandos de inicio.

---

## 💻 Guía de Desarrollo (Paso a Paso)

### ¿Cómo añadir una nueva funcionalidad?

Si quieres añadir una nueva tabla o funcionalidad:
1. Crea un nuevo **Modelo** en `src/app/models/`.
2. Crea un **Servicio** para esa entidad en `src/app/services/`.
3. En el método de inicialización de tu servicio, añade el `CREATE TABLE` necesario.
4. Llama a ese servicio desde el componente que necesites.

---

## 🌐 Persistencia en la Web (WASM)

A diferencia de las apps nativas donde SQLite escribe archivos directamente, en la web SQLite se ejecuta en memoria. Para no perder los datos al refrescar:
- Se utiliza `sqliteConnection.initWebStore()`.
- El servicio `TaskService` llama automáticamente a `saveToStore()` después de cada cambio (`INSERT`, `UPDATE`, `DELETE`).
- Esto guarda el estado de la base de datos en el **IndexedDB** del navegador.

---

## 📱 Despliegue en Android/iOS

1. **Generar el build de producción**:
   ```bash
   npm run build:native
   ```

2. **Sincronizar con Capacitor**:
   ```bash
   npx cap sync
   ```

3. **Abrir en el IDE nativo**:
   ```bash
   # Para Android
   npx cap open android
   # Para iOS
   npx cap open ios
   ```

---

## 📜 Scripts Útiles

| Comando | Acción |
| :--- | :--- |
| `npm run start` | Arranca la aplicación en el navegador con soporte SQLite Web. |
| `npm run build:web` | Compila la aplicación para despliegue web (PWA). |
| `npm run build:native` | Prepara la aplicación eliminando archivos web innecesarios para nativo. |
| `npm run lint` | Revisa el estilo de código del proyecto. |

---

> [!TIP]
> Si recibes un error en la web diciendo que `sql-wasm.wasm` no se encuentra, asegúrate de haber ejecutado `npm run start` o `npm install` recientemente, ya que esto dispara la copia de los drivers necesarios a `src/assets`.

