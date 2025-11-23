# Portal Empleo

Portal Empleo es una plataforma moderna de gestión de empleos que conecta empresas con candidatos. La aplicación permite a las empresas publicar ofertas de trabajo, gestionar aplicaciones y programar entrevistas, mientras que los candidatos pueden buscar empleos, aplicar a posiciones y gestionar sus CVs.

## Características

### Para Candidatos
- Búsqueda y exploración de ofertas de trabajo
- Aplicación a ofertas con CV personalizado
- Gestión de múltiples CVs en formato PDF
- Vista previa de CVs antes de aplicar
- Seguimiento del estado de aplicaciones
- Programación y gestión de entrevistas
- Perfil de candidato personalizable

### Para Empresas
- Dashboard de gestión de ofertas
- Publicación y edición de ofertas de trabajo
- Revisión de aplicaciones recibidas
- Vista de perfiles de candidatos
- Programación de entrevistas
- Sistema de estados para aplicaciones

## Tecnologías

- **Frontend**: React 19.2 + TypeScript
- **Enrutamiento**: React Router DOM v7
- **Gestión de Estado**: Zustand
- **Estilos**: CSS Modules
- **Validación de Formularios**: React Hook Form + Zod
- **HTTP Client**: Axios
- **Build Tool**: Vite
- **Manejo de Fechas**: date-fns

## Requisitos Previos

- Node.js (versión 18 o superior)
- npm o yarn

## Instalación

1. Clonar el repositorio:
```bash
git clone https://github.com/rosca-cristian/portal-empleo.git
cd portal-empleo
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno:

Crear un archivo `.env` en la raíz del proyecto:
```env
VITE_API_URL=https://api-empleo.onrender.com/api/v1
```

## Scripts Disponibles

### Desarrollo
```bash
npm run dev
```
Inicia el servidor de desarrollo en `http://localhost:5173`

### Build de Producción
```bash
npm run build
```
Genera los archivos optimizados para producción en la carpeta `dist/`

**Nota**: Los archivos de test (`*.test.ts`, `*.test.tsx`) están automáticamente excluidos del build de producción.

### Linting
```bash
npm run lint
```
Ejecuta ESLint para verificar la calidad del código

### Preview
```bash
npm run preview
```
Previsualiza la build de producción localmente

## Estructura del Proyecto

```
portal-empleo/
├── src/
│   ├── components/          # Componentes reutilizables
│   │   ├── auth/           # Componentes de autenticación
│   │   ├── candidate/      # Componentes específicos para candidatos
│   │   ├── jobs/           # Componentes de ofertas de trabajo
│   │   ├── layout/         # Componentes de layout (Navigation, Sidebar, etc.)
│   │   └── shared/         # Componentes compartidos
│   ├── pages/              # Páginas de la aplicación
│   │   ├── Landing.tsx     # Página de inicio
│   │   ├── Login.tsx       # Inicio de sesión
│   │   ├── Signup.tsx      # Registro
│   │   ├── Browse.tsx      # Explorar ofertas
│   │   ├── Dashboard.tsx   # Dashboard de empresa
│   │   ├── Profile.tsx     # Perfil de usuario
│   │   ├── CVs.tsx         # Gestión de CVs
│   │   └── ...
│   ├── services/           # Servicios y API
│   │   ├── api.ts          # Configuración de Axios
│   │   └── ...
│   ├── store/              # Store de Zustand
│   │   └── authStore.ts    # Estado de autenticación
│   ├── types/              # Definiciones de TypeScript
│   ├── App.tsx             # Componente principal
│   └── main.tsx            # Punto de entrada
├── public/                 # Archivos estáticos
├── .gitignore
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## Rutas de la Aplicación

### Rutas Públicas
- `/` - Página de inicio
- `/browse` - Explorar ofertas de trabajo
- `/login` - Iniciar sesión
- `/signup` - Registro de usuario
- `/jobs/:id` - Detalle de oferta de trabajo

### Rutas Protegidas (requieren autenticación)
- `/profile` - Perfil de usuario
- `/cvs` - Gestión de CVs
- `/applications` - Mis aplicaciones
- `/interviews` - Mis entrevistas
- `/dashboard` - Dashboard de empresa
- `/jobs/new` - Publicar nueva oferta
- `/jobs/:id/edit` - Editar oferta
- `/jobs/:jobId/applications` - Aplicaciones de una oferta
- `/profile/:id` - Ver perfil de candidato

## API

La aplicación se conecta a la API REST desplegada en:
```
https://api-empleo.onrender.com/api/v1
```

### Autenticación
La aplicación utiliza JWT (JSON Web Tokens) para la autenticación. El token se almacena en `localStorage` y se incluye automáticamente en todas las peticiones mediante un interceptor de Axios.

## Características Técnicas

### Gestión de Estado
- **Zustand** para el estado global de autenticación
- Estado local con hooks de React para componentes

### Validación
- **React Hook Form** para gestión de formularios
- **Zod** para validación de esquemas

### Estilos
- CSS Modules para estilos con scope local
- Diseño inspirado en IDEs modernos (VSCode-like)
- Interfaz responsive

### Seguridad
- Rutas protegidas con `PrivateRoute`
- Manejo automático de tokens expirados (redirect a login en 401)
- Validación de formularios en cliente y servidor

## Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto es privado y está en desarrollo.

## Contacto

Repositorio: [https://github.com/rosca-cristian/portal-empleo](https://github.com/rosca-cristian/portal-empleo)
