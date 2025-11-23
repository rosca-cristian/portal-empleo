# Guía de Despliegue - Portal Empleo

Esta guía proporciona instrucciones detalladas para desplegar la aplicación Portal Empleo en diferentes plataformas.

## Requisitos Previos

- Node.js 18 o superior instalado
- Cuenta en la plataforma de hosting elegida
- Acceso al repositorio de GitHub: https://github.com/rosca-cristian/portal-empleo.git
- API desplegada y funcionando en: https://api-empleo.onrender.com/api/v1

## Preparación del Proyecto

### 1. Variables de Entorno

Configurar las siguientes variables de entorno en tu plataforma de despliegue:

```env
VITE_API_URL=https://api-empleo.onrender.com/api/v1
```

**Nota importante**: En Vite, las variables de entorno deben tener el prefijo `VITE_` para ser expuestas al código del cliente.

### 2. Verificar Exclusión de Tests

Los archivos de test están configurados para ser excluidos del build de producción en `tsconfig.app.json`:

```json
{
  "exclude": ["src/**/*.test.ts", "src/**/*.test.tsx"]
}
```

Esto asegura que los archivos `*.test.ts` y `*.test.tsx` no sean incluidos en el bundle de producción.

## Opciones de Despliegue

### Opción 1: Vercel (Recomendado)

Vercel es ideal para aplicaciones React/Vite con despliegue automático desde GitHub.

#### Pasos:

1. **Crear cuenta en Vercel**
   - Visita https://vercel.com
   - Crea una cuenta o inicia sesión

2. **Importar proyecto desde GitHub**
   ```
   New Project → Import Git Repository
   → https://github.com/rosca-cristian/portal-empleo.git
   ```

3. **Configurar el proyecto**
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. **Configurar variables de entorno**
   ```
   Settings → Environment Variables

   VITE_API_URL = https://api-empleo.onrender.com/api/v1
   ```

5. **Desplegar**
   - Click en "Deploy"
   - El despliegue toma aproximadamente 2-3 minutos

#### Despliegues Automáticos:
- Cada push a `main` despliega automáticamente
- Los PRs generan preview deployments

#### Dominios Personalizados:
```
Settings → Domains → Add Domain
```

### Opción 2: Netlify

Netlify es otra excelente opción para aplicaciones estáticas con CI/CD integrado.

#### Pasos:

1. **Crear cuenta en Netlify**
   - Visita https://netlify.com
   - Crea una cuenta o inicia sesión

2. **Importar desde GitHub**
   ```
   Add new site → Import an existing project
   → GitHub → rosca-cristian/portal-empleo
   ```

3. **Configurar build**
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Base directory**: (dejar vacío)

4. **Variables de entorno**
   ```
   Site settings → Build & deploy → Environment

   VITE_API_URL = https://api-empleo.onrender.com/api/v1
   ```

5. **Configurar redirects para SPA**

   Crear archivo `public/_redirects`:
   ```
   /*    /index.html   200
   ```

6. **Desplegar**
   - Click en "Deploy site"

### Opción 3: GitHub Pages

Para despliegue gratuito usando GitHub Pages.

#### Pasos:

1. **Instalar dependencia**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Actualizar `package.json`**
   ```json
   {
     "homepage": "https://rosca-cristian.github.io/portal-empleo",
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     }
   }
   ```

3. **Configurar Vite para GitHub Pages**

   Actualizar `vite.config.ts`:
   ```typescript
   import { defineConfig } from 'vite'
   import react from '@vitejs/plugin-react'

   export default defineConfig({
     plugins: [react()],
     base: '/portal-empleo/'
   })
   ```

4. **Variables de entorno**

   Crear archivo `.env.production`:
   ```env
   VITE_API_URL=https://api-empleo.onrender.com/api/v1
   ```

5. **Desplegar**
   ```bash
   npm run deploy
   ```

6. **Habilitar GitHub Pages**
   ```
   Repositorio → Settings → Pages
   Source: gh-pages branch
   ```

### Opción 4: Render

Render es una plataforma moderna con tier gratuito para aplicaciones estáticas.

#### Pasos:

1. **Crear cuenta en Render**
   - Visita https://render.com
   - Crea una cuenta

2. **Crear Static Site**
   ```
   New → Static Site
   → Connect GitHub repository
   ```

3. **Configurar**
   - **Name**: portal-empleo
   - **Branch**: main
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`

4. **Variables de entorno**
   ```
   Environment → Add Environment Variable

   Key: VITE_API_URL
   Value: https://api-empleo.onrender.com/api/v1
   ```

5. **Configurar rewrite rules**

   Crear archivo `render.yaml` en la raíz:
   ```yaml
   services:
     - type: web
       name: portal-empleo
       env: static
       buildCommand: npm run build
       staticPublishPath: dist
       routes:
         - type: rewrite
           source: /*
           destination: /index.html
   ```

## Build Manual Local

Para generar un build de producción localmente:

```bash
# Instalar dependencias
npm install

# Generar build
npm run build

# Los archivos se generan en ./dist
```

### Verificar el Build

```bash
# Previsualizar el build localmente
npm run preview
```

La aplicación estará disponible en `http://localhost:4173`

## Estructura del Build de Producción

Después del build, la carpeta `dist/` contiene:

```
dist/
├── index.html              # HTML principal
├── assets/
│   ├── index-[hash].js     # JavaScript bundle
│   ├── index-[hash].css    # CSS bundle
│   └── [otros assets]      # Imágenes, fuentes, etc.
└── vite.svg
```

## Configuración de Dominios Personalizados

### Vercel
```bash
vercel domains add tudominio.com
```

### Netlify
```
Site settings → Domain management → Add custom domain
```

### Configurar DNS
```
Type: CNAME
Name: www (o @)
Value: [proporcionado por la plataforma]
```

## Monitoreo y Logs

### Vercel
- Dashboard → [tu-proyecto] → Deployments
- Ver logs en tiempo real durante el despliegue

### Netlify
- Site dashboard → Deploys
- Click en un deploy para ver logs detallados

### Render
- Dashboard → [tu-servicio] → Logs

## Optimizaciones de Producción

### 1. Compresión
Todas las plataformas mencionadas proporcionan compresión Gzip/Brotli automáticamente.

### 2. CDN
Vercel, Netlify y Render incluyen CDN global sin configuración adicional.

### 3. Caché
Las plataformas configuran automáticamente los headers de caché para assets estáticos.

### 4. HTTPS
HTTPS está habilitado por defecto en todas las plataformas.

## Rollback

### Vercel
```
Dashboard → Deployments → [deployment anterior] → Promote to Production
```

### Netlify
```
Deploys → [seleccionar deploy] → Publish deploy
```

### Render
Los deploys son inmutables. Para rollback, hacer revert del commit en Git.

## Troubleshooting

### Build Falla

**Error**: `Module not found`
```bash
# Limpiar node_modules y reinstalar
rm -rf node_modules package-lock.json
npm install
npm run build
```

**Error**: `Out of memory`
```bash
# Aumentar memoria de Node.js
NODE_OPTIONS="--max-old-space-size=4096" npm run build
```

### Rutas 404 en Producción

**Problema**: Las rutas de React Router devuelven 404.

**Solución**: Configurar rewrites/redirects según la plataforma:

**Vercel** - Crear `vercel.json`:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

**Netlify** - Crear `public/_redirects`:
```
/*    /index.html   200
```

### Variables de Entorno No Se Cargan

**Verificar**:
1. El prefijo `VITE_` está presente
2. Las variables están configuradas en la plataforma
3. Rebuild después de agregar variables
4. No usar `.env` en producción (usar UI de la plataforma)

### API No Responde

**Verificar**:
1. La API está activa: https://api-empleo.onrender.com/api/v1
2. CORS está configurado en el backend
3. La variable `VITE_API_URL` es correcta
4. Verificar en Network tab del navegador

## Seguridad

### Recomendaciones:

1. **No commitear archivos `.env`** (ya está en `.gitignore`)
2. **Usar HTTPS** (automático en todas las plataformas)
3. **Configurar CSP headers** (opcional, según plataforma)
4. **Actualizar dependencias regularmente**:
   ```bash
   npm audit
   npm audit fix
   ```

## CI/CD Automático

El proyecto está configurado para despliegue automático cuando se hace push a GitHub:

```bash
git add .
git commit -m "Deploy: [descripción]"
git push origin main
```

La plataforma detectará el push y desplegará automáticamente.

## Costos

### Tier Gratuito:
- **Vercel**: 100GB bandwidth/mes, despliegues ilimitados
- **Netlify**: 100GB bandwidth/mes, 300 build minutes/mes
- **GitHub Pages**: Ilimitado para repos públicos
- **Render**: 100GB bandwidth/mes, builds ilimitados

### Planes Pagos:
Consultar las plataformas para opciones de escalamiento.

## Contacto y Soporte

- **Repositorio**: https://github.com/rosca-cristian/portal-empleo
- **API**: https://api-empleo.onrender.com/api/v1

## Checklist de Despliegue

- [ ] Variables de entorno configuradas
- [ ] Build local exitoso (`npm run build`)
- [ ] Tests excluidos del build
- [ ] Repositorio actualizado en GitHub
- [ ] Plataforma de hosting seleccionada
- [ ] Proyecto importado desde GitHub
- [ ] Configuración de build correcta
- [ ] Rewrites/redirects configurados para SPA
- [ ] Primer despliegue exitoso
- [ ] Verificar todas las rutas funcionan
- [ ] Verificar conexión con API
- [ ] Configurar dominio personalizado (opcional)
- [ ] Habilitar despliegues automáticos
- [ ] Documentar URL de producción

## URLs de Producción

Después del despliegue, documentar aquí las URLs:

- **Producción**: [URL por definir]
- **Staging**: [URL por definir]
- **API**: https://api-empleo.onrender.com/api/v1
