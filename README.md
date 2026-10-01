# React III · Efectos y datos remotos

Ejemplos de la clase de Programación Web (UFPS) sobre `useEffect`, dependencias, limpieza y consumo de APIs desde React.

Proyecto creado con la CLI oficial de Vite (`npm create vite@latest`, plantilla `react`) y Tailwind CSS 4 con su plugin para Vite.

## Cómo ejecutarlo

```bash
npm install
npm run dev
```

Abrir la dirección que muestra la terminal (normalmente http://localhost:5173) y tener DevTools abierto en las pestañas **Console** y **Network**: casi todos los ejemplos escriben ahí lo que está pasando.

## Qué hay en cada página

Cada pestaña de la aplicación es un archivo en `src/paginas/`. Las tarjetas con borde rojo (✖) muestran la versión con el error y las de borde verde (✔), la corregida.

| Pestaña | Archivo | Ejemplos |
|---|---|---|
| Qué es un efecto | `QueEsUnEfecto.jsx` | Guardar en `localStorage` desde cada manejador vs. con `useEffect`; cambiar `document.title`; un efecto que sobra para un valor calculado. |
| Dependencias | `Dependencias.jsx` | Sin array, `[]` y `[a]`; el bucle infinito (con freno en 50); un objeto nuevo en cada renderizado como dependencia. |
| Limpieza | `Limpieza.jsx` | Reloj con `setInterval` sin limpieza y con limpieza; `addEventListener` / `removeEventListener`. |
| Datos remotos | `DatosRemotos.jsx` | `fetch` en el cuerpo del componente (con freno en 10); `fetch` en un efecto con cargando, error y datos; el 404 que no lanza excepción. |
| Condición de carrera | `CondicionDeCarrera.jsx` | Buscador sin cancelar vs. con `AbortController`. Cada búsqueda tarda un tiempo al azar para que las respuestas lleguen en desorden. |

`App.jsx` también usa dos efectos reales: uno mantiene la URL (`#pagina`) sincronizada con la pestaña elegida y otro escucha el botón atrás del navegador.

## Sobre el linter

`npm run lint` (oxlint) marca advertencias en los ejemplos con ✖. Es a propósito: el linter detecta solo varios de los errores que se ven en clase, y vale la pena leer qué dice de cada uno.

## API usada

[The Rick and Morty API](https://rickandmortyapi.com/documentation), pública y sin clave.
