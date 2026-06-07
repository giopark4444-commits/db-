# VU·SONO — Medidor de decibeles retro

Sonómetro web con estética de medidor VU analógico de los años 60. Una sola
página, sin dependencias ni conexión: todo corre en el navegador usando la
Web Audio API y el micrófono del dispositivo.

## Cómo usarlo

Abre `index.html` en un navegador (Chrome, Safari, Firefox) y pulsa
**Encender**. El navegador pedirá permiso para usar el micrófono.

> El acceso al micrófono requiere un contexto seguro: `https://` o
> `localhost`. Si lo abres como `file://` y no funciona, sírvelo localmente:
>
> ```bash
> python3 -m http.server 8000
> # luego visita http://localhost:8000
> ```

## Características

- **Aguja VU analógica** con balística realista (ataque rápido, caída lenta)
  y carátula con zonas verde/amarillo/naranja/roja.
- **Lector digital LCD** con nivel actual, pico, promedio y mínimo.
- **Escalera de LEDs** con retención de pico (peak-hold).
- **Osciloscopio / historial** estilo tubo de fósforo verde que traza el nivel
  de los últimos 30 segundos.
- **Dosímetro de exposición** (criterio NIOSH): acumula la dosis de ruido y el
  tiempo por encima de 85 dB, y avisa al alcanzar el límite diario seguro.
- **PWA instalable**: se puede añadir a la pantalla de inicio (iPhone/Android)
  y abrir a pantalla completa como una app; funciona **offline** gracias a un
  service worker que cachea la app.
- **Estéticas intercambiables** que evocan distintos saltos de diseño, no solo
  retro: **Analógico** (VU clásico de madera y latón), **Neón** (synthwave
  oscuro con glow), **Casete** (plástico ochentero/noventero), **Cromo**
  (cristal y metal pulido tipo Aqua/Web 2.0), **Plano** (flat/material) y
  **Mínimo** (limpio y minimalista). La preferencia se guarda en `localStorage`.
- **Ponderación A / Z** — dB(A) aproxima la sensibilidad del oído humano;
  dB(Z) es respuesta plana.
- **Modo de calibración** con tres vías:
  1. Valor de un sonómetro de referencia real.
  2. Deslizador manual de offset.
  3. Calibración rápida con sonidos conocidos (silencio, conversación,
     tráfico…). La calibración se guarda en `localStorage`.

## Precisión

Un micrófono de consumo no está calibrado de fábrica, así que la lectura es
**aproximada**. Para resultados fiables, calíbralo contra un sonómetro real (o
una app de referencia) en el mismo lugar. Valores de referencia típicos:
biblioteca ~30 dB, conversación ~60 dB, tráfico intenso ~85 dB.

## Instalar como app (PWA)

- **iPhone (Safari):** abre la URL `https://…` → botón **Compartir** → **Añadir a
  pantalla de inicio**.
- **Android (Chrome):** menú **⋮** → **Instalar app** / **Añadir a pantalla de
  inicio**.
- **Escritorio (Chrome/Edge):** icono de instalar en la barra de direcciones.

Una vez instalada se abre a pantalla completa y funciona sin conexión.

## Atajos

- **Barra espaciadora**: encender / apagar
- **Esc**: cerrar el panel de calibración

## Licencia

MIT.
