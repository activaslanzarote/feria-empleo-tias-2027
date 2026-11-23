# Web de la IV Feria de Empleo de Tías 2027

Diseño de Cova (Activas). Los textos y las fotos se cambian desde un panel: **Pages CMS**.

## Cómo editar la web

1. Entra en **https://app.pagescms.org** y pulsa **Sign in with GitHub** (cuenta *activaslanzarote*).
2. Elige el repositorio **feria-empleo-tias-2027**.
3. A la izquierda verás las secciones: Datos generales, Portada, Programa, Ponencias, Talleres, Hoy contratamos, Espacios, Galería…
4. Cambia lo que quieras y pulsa **Save** (Guardar). En un minuto o dos el cambio aparece en www.feriaempleotias.com.

### Trucos
- **Negrita:** escribe el texto entre dos asteriscos: `**así**`.
- **Fotos:** en cualquier campo de foto, pulsa sobre él y sube la imagen desde tu ordenador. Antes, pásala por squoosh.app para que pese menos de 400 KB.
- **Añadir o quitar** talleres, ponencias, fotos de la galería, patrocinadores, pasos…: en cada lista hay un botón **Add** (añadir) y, en cada elemento, un menú para borrarlo o moverlo.
- **Ocultar una sección** sin borrarla: desmarca **Mostrar esta sección en la web**. También desaparece del menú.
- **Programa por perfil:** en cada franja, el campo «Se resalta para…» decide qué se ilumina al pulsar Jóvenes, Mujeres +45, Empresas o FP. Las rutas de la caja de color se escriben en «Rutas por perfil».

### Si algo no se ve
- Espera dos minutos y recarga la web (o ábrela en una ventana de incógnito).
- En vercel.com → proyecto → **Deployments** puedes ver si la última publicación terminó bien (punto verde).

## Qué hay en esta carpeta (no hace falta tocarlo)
| Archivo | Para qué |
|---|---|
| `contenido/` | Los textos de cada sección (lo que edita el panel) |
| `img/` | Fotos, logos y vídeo |
| `plantilla/` | Estilos y funcionamiento del diseño |
| `build.js` | Junta textos y diseño y crea la web |
| `.pages.yml` | Configuración del panel |
| `vercel.json` | Le dice a Vercel cómo publicar |
