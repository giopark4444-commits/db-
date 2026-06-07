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
- **Temas de carátula** intercambiables (Marfil clásico, Negra ámbar, Azul
  nocturno); la preferencia se guarda en `localStorage`.
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

## Atajos

- **Barra espaciadora**: encender / apagar
- **Esc**: cerrar el panel de calibración

## Licencia

MIT.
