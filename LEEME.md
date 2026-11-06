# Web · IV Feria de Empleo de Tías 2027

Web sencilla: un archivo de textos (`index.html`), uno de estilos (`estilos.css`) y dos carpetas de imágenes. No necesita instalar nada ni "compilar": Vercel la publica tal cual.

## Qué hay en la carpeta

| Archivo | Para qué sirve |
|---|---|
| `index.html` | Todos los textos de la web |
| `estilos.css` | Colores, tipografías y diseño (en principio, no hace falta tocarlo) |
| `fotos/portada.jpg` | Foto grande de la portada (vertical, unos 1200×1500 px) |
| `fotos/chill-out.jpg` | Foto de la zona de café (horizontal, unos 1600×1100 px) |
| `fotos/compartir-redes.jpg` | Imagen que sale al compartir el enlace en WhatsApp o redes (1200×630 px) |
| `logos/ayuntamiento-tias.png` | Logo del Ayuntamiento |
| `logos/activas.png` | Logo de Activas |
| `logos/favicon.png` | Icono de la pestaña del navegador |

## 1 · Subirla a GitHub (una sola vez)

1. Entra en github.com, pulsa **New repository** y ponle de nombre `feria-empleo-tias-2027`.
2. En el repositorio vacío, pulsa **uploading an existing file**.
3. Descomprime el zip en tu ordenador y arrastra **el contenido de la carpeta** (no la carpeta entera): `index.html`, `estilos.css`, `fotos`, `logos` y este `LEEME.md`.
4. Pulsa **Commit changes**.

## 2 · Publicarla en Vercel (una sola vez)

1. En vercel.com, pulsa **Add New → Project** y elige el repositorio `feria-empleo-tias-2027`.
2. En *Framework Preset* deja **Other**. No toques nada más y pulsa **Deploy**.
3. Para usar el dominio: en el proyecto **antiguo** (el de AI Studio), ve a *Settings → Domains* y quita `feriaempleotias.com` y `www.feriaempleotias.com`. Después, en el proyecto **nuevo**, ve a *Settings → Domains* y añádelos. Como el dominio ya apunta a Vercel, el cambio es inmediato o tarda unos minutos.

## 3 · Cambiar un texto

1. En GitHub, abre `index.html` y pulsa el **lápiz** (Edit).
2. Busca la frase con **Ctrl+F**, cámbiala y pulsa **Commit changes**.
3. Vercel publica la nueva versión sola, en un minuto más o menos.

Reglas para no romper nada:
- Cambia solo el texto que se ve. **No borres nada de lo que va entre `<` y `>`.**
- `<strong>texto</strong>` pone el texto en negrita.
- Lo que va entre corchetes, como `[NOMBRE DE LA PONENTE]` o `[FECHA DE APERTURA]`, son huecos pendientes de rellenar.

## 4 · Cambiar una foto o un logo

1. Prepara la foto con **el mismo nombre** que la que quieres sustituir (por ejemplo, `portada.jpg`).
2. En GitHub, entra en la carpeta `fotos` (o `logos`), pulsa **Add file → Upload files**, arrastra la foto y pulsa **Commit changes**. La nueva sustituye a la anterior.
3. Consejo: pásala antes por squoosh.app o tinypng.com para que pese menos de 400 KB y la web cargue rápido.

## 5 · Poner el enlace del formulario de inscripción

Al final de `index.html` está esta línea:

```
const ENLACE_INSCRIPCION = "";
```

Pega el enlace de tu formulario (por ejemplo, de Google Forms) entre las comillas y haz el commit. Todos los botones "Reserva tu plaza" de la web pasarán a llevar a ese formulario.

## 6 · Añadir logos de empresas o colaboradores

Busca en `index.html` los comentarios que empiezan por `LOGOS DE EMPRESAS` y `Cuando tengas los logos`. Ahí se explica la línea que hay que añadir por cada logo.

## Pendiente antes de difundir

- [ ] Fotos reales de 2026 (`portada.jpg`, `chill-out.jpg`, `compartir-redes.jpg`)
- [ ] Logo del Ayuntamiento
- [ ] Nombre de la ponente de cierre
- [ ] Fecha de apertura de inscripciones y enlace del formulario
- [ ] Páginas de aviso legal, privacidad y cookies (pedir los textos o el visto bueno al Ayuntamiento)
