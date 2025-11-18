# CMIC Chat Frontend (Draft)

Este proyecto es un **frontend de chat para el proyecto CMIC**, desarrollado como un borrador inicial para explorar la interfaz y flujo del sistema. Está construido con **Angular**, usando **ngModules**, junto con **PrimeNG** para componentes UI.

## Tecnologías utilizadas

* **Angular**: 18.2.21
* **Node**: 22.21.1
* **NPM**: 10.9.4
* **PrimeNG**: 18

## Repositorio

Puedes clonar el proyecto desde GitHub:

```bash
https://github.com/GLDevKike/cmic-chat-frontend-draft
```

## Cómo clonar el proyecto

1. Abre tu terminal.
2. Ejecuta:

```bash
git clone https://github.com/GLDevKike/cmic-chat-frontend-draft
```

3. Entra al directorio del proyecto:

```bash
cd cmic-chat-frontend-draft
```

## Instalación de dependencias

Ejecuta:

```bash
npm install
```

Esto instalará todas las dependencias necesarias para ejecutar el proyecto.

## Configuración de Environments

El proyecto utiliza archivos de configuración que **no están versionados en git** por seguridad.

### Setup Inicial

1. **Copia el archivo de ejemplo para desarrollo:**

```bash
cp src/environments/environment.example.ts src/environments/environment.ts
```

2. **Edita el archivo `src/environments/environment.ts`** con tu URL de API de desarrollo:

```typescript
export const ENVIRONMENT = {
  PRODUCTION: false,
  API_URL: 'https://tu-api-dev.run.app/',
} as const;
```

### Configuración para Producción

1. **Crea el archivo de producción:**

```bash
cp src/environments/environment.example.ts src/environments/environment.prod.ts
```

2. **Edita `src/environments/environment.prod.ts`:**

```typescript
export const ENVIRONMENT = {
  PRODUCTION: true,
  API_URL: 'https://tu-api-prod.run.app/',
} as const;
```

## Ejecutar el proyecto

### Modo Desarrollo

Para correr el servidor de desarrollo:

```bash
ng serve
```

El proyecto se ejecutará en:

```
http://localhost:4200
```

### Modo Producción (local)

Para probar el build de producción localmente:

```bash
ng serve --configuration=production
```

## Build

### Build de Desarrollo

```bash
ng build
```

### Build de Producción

```bash
ng build --configuration=production
```

Los archivos compilados se generarán en el directorio `dist/`.

## Estructura del Proyecto

```
src/
├── app/
│   ├── modules/
│   │   └── shared/
│   │       ├── interfaces/
│   │       ├── services/
│   │       └── components/
│   └── pages/
│       └── home/
├── assets/
│   ├── images/
│   └── gifs/
└── environments/
    ├── environment.example.ts  (versionado)
    ├── environment.ts          (ignorado - dev)
    └── environment.prod.ts     (ignorado - prod)
```

## Características

- ✅ Chat interactivo con historial persistente
- ✅ Integración con agente orquestador del CMIC
- ✅ Visualización de tableros Looker embebidos
- ✅ Validación de consultas (válidas, inválidas, incompletas)
- ✅ Sugerencias contextuales de preguntas
- ✅ Diseño responsive
- ✅ Animaciones y transiciones suaves

## Notas

Este es un borrador inicial, por lo que la estructura, componentes y estilos pueden cambiar conforme evolucione el proyecto.

---

**Importante:** Nunca commitees los archivos `environment.ts` o `environment.prod.ts` ya que contienen información sensible. Usa siempre el archivo `.example` como referencia.