# CinePass – Propuesta de Novia 🎬❤️

Página web premium para una propuesta romántica disfrazada de validación de beneficio de cine.

## Flujo de la experiencia

| # | Pantalla | Duración aprox. |
|---|----------|-----------------|
| 1 | Validación con barra de progreso y checklist | ~28 segundos |
| 2 | Sobre elegante que se abre | Manual |
| 3 | Frases con efecto máquina de escribir | ~40 segundos |
| 4 | La pregunta (botón "No" que escapa) | Manual |
| 5 | Celebración con confeti y corazones | ∞ |

## Estructura de archivos

```
/
├── index.html   → Estructura y pantallas
├── style.css    → Estilos premium (glassmorphism, animaciones)
├── script.js    → Lógica, progreso, typewriter, confeti, corazones
└── README.md    → Este archivo
```

## Cómo publicar en GitHub Pages

1. Crear un repositorio nuevo en GitHub (puede ser privado o público).
2. Subir los cuatro archivos (`index.html`, `style.css`, `script.js`, `README.md`).
3. Ir a **Settings → Pages**.
4. En *Source*, seleccionar **Deploy from a branch**.
5. Elegir rama `main` y carpeta `/root (/)`. Guardar.
6. En unos minutos la URL `https://tuusuario.github.io/tu-repositorio/` estará activa.
7. Generar un código QR con esa URL (cualquier generador gratuito sirve, por ejemplo [qr.io](https://qr.io)).

## Cómo usar sin publicar

Simplemente abrir `index.html` en cualquier navegador. No requiere servidor local ni dependencias.

## Personalización rápida

| Qué cambiar | Dónde |
|-------------|-------|
| Nombre en la pantalla 1 | `index.html` → `<p class="found-name gold">Paloma</p>` |
| Nombre en la carta final | `index.html` → `<em>Paloma…</em>` |
| Firma | `index.html` → `<strong class="gold">Elías ❤️</strong>` |
| Frases del typewriter | `script.js` → array `PHRASES` |
| Velocidad de escritura | `script.js` → constante `CHAR_SPEED` (ms por carácter) |
| Duración total progreso | `script.js` → función `initValidation`, parámetros `durationMs` |
| Colores | `style.css` → sección `:root` (tokens) |

## Tecnologías

- HTML5 semántico
- CSS3 (custom properties, glassmorphism, animaciones, responsive)
- JavaScript vanilla (ES2020, sin frameworks ni dependencias)

## Compatibilidad

Optimizado para **iOS Safari** (iPhone). Funciona en cualquier navegador moderno.

---

*Hecho con 💛 para Paloma, de parte de Elías.*
