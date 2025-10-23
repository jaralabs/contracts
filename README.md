# 💾 Contracts Management System

> Sistema moderno de **gestión de contratos** construido con **Angular 17**, **Nx Monorepo**, **Module Federation**, **TailwindCSS** y autenticación mediante **AWS Cognito**.

<a href="https://nx.dev" target="_blank" rel="noreferrer">
  <img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="120" alt="Nx Logo" />
</a>

---

## 🚀 Instalación

### 1️⃣ Clonar el repositorio

```bash
git clone https://github.com/jaralabs/contracts.git
cd contracts
```

### 2️⃣ Instalar dependencias

```bash
npm install
```

### 3️⃣ Configurar variables de entorno

```bash
cp .env.example .env
```

Editar el archivo `.env` con tus credenciales de AWS Cognito:

```env
AWS_USER_POOL_ID= us-east-1_cURobggRv
AWS_USER_POOL_CLIENT_ID= 70km7nv8tdu1upubtm8le7evep
AWS_IDENTITY_POOL_ID= us-east-1:7b1efcc9-3475-451b-899e-b5ebb9853bce
```

Para loguearte en el sitema usa estas credenciales, si usas el env anterior

```login
email: test@example.com
password: Nicolas1.
```

---

## ▶️ Servidores de desarrollo

Ejecutar en **tres terminales diferentes**:

```bash
# Terminal 1 - Mock API (Puerto 3000)
npm run server

# Terminal 2 - Aplicación Host (Puerto 4200)
npx nx serve host

# Terminal 3 - Módulo ERP (Puerto 4201)
npx nx serve erp
```

**URLs disponibles:**

- <http://localhost:4200> → Aplicación principal (Host)
- <http://localhost:4201> → Módulo ERP
- <http://localhost:3000> → API simulada (JSON Server)

---

## 🥪 Pruebas

### 🔹 E2E (Playwright)

```bash
npx playwright test
npx playwright test --ui
npx playwright show-report
```

### 🔹 Unitarias (Jest)

```bash
npx nx test host
npx nx test erp
npx nx test shared
npx nx test design-system
```

---

## 👷️ Compilación para producción

```bash
npx nx build host --configuration=production
npx nx build erp --configuration=production
```

El resultado se genera en `dist/apps/host` y puede ser desplegado en AWS S3, Netlify, Vercel u otro hosting estático.

---

## 📁 Estructura del proyecto

```
contracts/
├── apps/
│   ├── host/             # Aplicación principal (shell con autenticación)
│   └── erp/              # Microfrontend de gestión de contratos
├── libs/
│   ├── design-system/    # Componentes UI compartidos
│   └── shared/           # Servicios, modelos y utilidades comunes
├── e2e/                  # Pruebas E2E con Playwright
└── db.json               # API simulada (JSON Server)
```

---

## 🧬 Stack tecnológico

- **Angular 17** – Standalone components, signals y zoneless rendering
- **Nx Workspace** – Monorepo modular con tareas inteligentes
- **Module Federation** – Arquitectura de microfrontends dinámica
- **AWS Cognito** – Autenticación segura
- **NgRx** – Manejo de estado global
- **TailwindCSS** – Framework utility-first para diseño responsivo
- **Lucide Icons** – Librería de íconos moderna
- **Playwright / Jest** – Pruebas E2E y unitarias

---

## 🔒 Autenticación

El sistema usa **AWS Cognito** para la gestión de usuarios y autenticación con email/contraseña.

**Funciones principales:**

- Inicio y cierre de sesión
- Recuperación y cambio de contraseña
- Guards de protección de rutas
- Servicio centralizado de autenticación
- Manejo de estado con NgRx

---

## 📊 API simulada

**Servidor JSON Server** en `http://localhost:3000`

| Método | Endpoint         | Descripción                        |
| ------ | ---------------- | ---------------------------------- |
| GET    | `/contratos`     | Lista todos los contratos          |
| GET    | `/contratos/:id` | Obtiene un contrato específico     |
| POST   | `/contratos`     | Crea un nuevo contrato             |
| PUT    | `/contratos/:id` | Actualiza un contrato completo     |
| PATCH  | `/contratos/:id` | Actualiza parcialmente un contrato |
| DELETE | `/contratos/:id` | Elimina un contrato                |

---

## 🔧 Comandos Nx útiles

```bash
npx nx graph                      # Visualiza dependencias del workspace
npx nx run-many -t test           # Ejecuta todas las pruebas
npx nx show project host --web    # Muestra configuración de proyecto
npx nx format:write               # Formatea el código
```

---

## 🧬 Guías de desarrollo

### Estilo de código

- Usar componentes **standalone** y **signals**
- Mantener una sola responsabilidad por componente
- Emplear clases de **TailwindCSS** en lugar de SCSS
- Nombres descriptivos y consistentes

### Convención de commits

Seguir el estándar [Conventional Commits](https://www.conventionalcommits.org):

| Tipo        | Propósito                      |
| ----------- | ------------------------------ |
| `feat:`     | Nueva funcionalidad            |
| `fix:`      | Corrección de errores          |
| `refactor:` | Mejora o reestructuración      |
| `test:`     | Adición o ajuste de pruebas    |
| `docs:`     | Actualización de documentación |
| `style:`    | Cambios de formato o estilo    |
| `chore:`    | Mantenimiento o dependencias   |

**Ejemplo:**

```bash
git commit -m "feat: add contract filtering functionality"
```

---

## 🔏 Scripts disponibles

| Comando               | Descripción                    |
| --------------------- | ------------------------------ |
| `npm run dev`         | Ejecuta api, host, erp         |
| `npm run api`         | Inicia el mock API             |
| `npx nx serve host`   | Inicia la aplicación principal |
| `npx nx serve erp`    | Inicia el microfrontend ERP    |
| `npx nx test`         | Ejecuta pruebas unitarias      |
| `npx playwright test` | Ejecuta pruebas E2E            |
| `npx nx build host`   | Compila aplicación host        |
| `npx nx lint host`    | Ejecuta ESLint                 |

## 📄 Licencia

**MIT** — © 2025 [@jaralabs](https://github.com/jaralabs)

---

## 👥 Autor

**Andrew Jaramillo**
Full Stack Engineer
[@jaralabs](https://github.com/jaralabs)

---

## 🙏 Agradecimientos

- Construido con [Nx](https://nx.dev)
- Iconos por [Lucide](https://lucide.dev)
- Estilos con [Tailwind CSS](https://tailwindcss.com)
- Autenticación mediante [AWS Cognito](https://aws.amazon.com/cognito)
