# psforense.es

Web profesional de **Patrick Svensson, Psicología Forense** (marca v1.1) y escaparate de **Probatio**, su herramienta de gestión para peritos psicólogos.  

Sitio estático en HTML, CSS y JavaScript, sin dependencias ni proceso de compilación. No usa cookies ni analítica: tipografías, imágenes y código se sirven desde el propio dominio. La única conexión con un servicio externo es el envío del formulario de contacto (ver más abajo).

Versión actual: ver [VERSION](VERSION) · historial en [CHANGELOG.md](CHANGELOG.md).

## Los tres repositorios

| Repositorio | Visibilidad | Qué contiene |
|---|---|---|
| **[psforense](https://github.com/patrickusaf/psforense)** (este) | Público | La web psforense.es, incluida la demostración de Probatio en `demo/` |
| **probatio** | Privado | El código de la herramienta (CRM, facturación y gestión documental) |
| **[probatio-demo](https://github.com/patrickusaf/probatio-demo)** | Público | La misma demostración, sin datos reales, publicada también con GitHub Pages |

La carpeta `demo/` **no se edita a mano**: la genera `scripts/generar-demo.js` del repositorio privado `probatio`. Para actualizarla, regenera la demo y sincroniza esta carpeta con el repositorio `probatio-demo`:

```
rsync -a --delete --exclude=.git --exclude=README.md --exclude=.gitignore ../probatio-demo/ demo/
```

## Estructura

```
index.html                Inicio
servicios/index.html      Servicios (incluye el apartado de software)
software/index.html       Probatio: qué es, capturas, qué incluye y condiciones
demo/                     Demostración navegable de Probatio, con datos ficticios (generada)
sobre-mi/index.html       Sobre mí
contacto/index.html       Contacto: formulario con envío por correo (Cloudflare Worker) o mensaje por WhatsApp
aviso-legal/index.html    Aviso legal (LSSI-CE)
privacidad/index.html     Política de privacidad (RGPD)
cookies/index.html        Política de cookies
404.html                  Página de error
assets/css/styles.css     Estilos
assets/js/main.js         Menú móvil y formulario
assets/img/               Fotografías e imagen para redes (og-image.png)
assets/img/probatio/      Capturas de Probatio (datos ficticios), tomadas de la demostración
assets/fonts/             Tipografías (licencia SIL OFL incluida)
VERSION, CHANGELOG.md     Versionado de la web
CNAME                     Dominio personalizado para GitHub Pages
.nojekyll                 Evita que GitHub Pages procese el sitio con Jekyll
robots.txt, sitemap.xml   Buscadores
favicon.svg y PNG, site.webmanifest   Iconos
```

## Formulario de contacto y WhatsApp

- El formulario (`data-endpoint` en `contacto/index.html`) envía el mensaje a un **Cloudflare Worker** propio (proyecto `psforense-formulario`), que lo reenvía por correo a contacto@ y manda una confirmación automática. No guarda el mensaje. Si `data-endpoint` está vacío, el formulario abre el programa de correo.
- Los enlaces de WhatsApp llevan la marca **«(Ref. web)»** en el mensaje precargado. Así, cuando alguien escribe, el CRM (Probatio) detecta el origen y crea el lead en dos toques. **No quites la marca** de los enlaces; el QR de la tarjeta usa «(Ref. tarjeta)».

## Antes de publicar

Los textos pendientes aparecen marcados en rojo con corchetes dentro de la web.

1. **Aviso legal y privacidad:** completa tu **NIF** y tu **domicilio profesional** (`aviso-legal/index.html` y `privacidad/index.html`). La LSSI-CE obliga a publicarlos.
2. **Formación:** si todavía estás cursando el máster, cambia en `sobre-mi/index.html` la línea `Máster en Psicología Forense` por `Máster en Psicología Forense (en curso)`.
3. Pide a un profesional que revise los textos legales antes de publicar.

## Ver la web en tu ordenador

Desde esta carpeta, en el Terminal:

```
python3 -m http.server 8000
```

y abre http://localhost:8000. (Abrir los archivos con doble clic no funciona bien porque las páginas son carpetas.)

## Publicar en GitHub Pages

### Plan de GitHub

- **GitHub Free:** GitHub Pages solo publica desde repositorios **públicos**. El código de la web sería visible, aunque no contiene datos privados.
- **GitHub Pro** (o Team/Enterprise): permite publicar desde un repositorio **privado**. La web sigue siendo pública; solo el código queda oculto.

### Pasos

1. Repositorio: https://github.com/patrickusaf/psforense (público).
2. Sube el **contenido** de esta carpeta a la raíz de la rama `main` (incluidos `CNAME` y `.nojekyll`, que son archivos ocultos: en Mac, pulsa `Cmd + Mayús + .` para verlos en el Finder).
   ```
   git init
   git add .
   git commit -m "Web PS Forense v1.1"
   git branch -M main
   git remote add origin https://github.com/patrickusaf/psforense.git
   git push -u origin main
   ```
3. En el repositorio: **Settings > Pages > Build and deployment > Source: Deploy from a branch**, rama `main`, carpeta `/ (root)`. Guarda.
4. En **Custom domain** debe aparecer `psforense.es` (lo toma del archivo `CNAME`). Si no, escríbelo y guarda.
5. Recomendado: verifica el dominio en **Settings (de tu cuenta) > Pages > Add a domain**. GitHub te dará un registro TXT para añadir en tu DNS. Protege el dominio frente a usos no autorizados.
6. Configura el DNS en tu registrador (tabla de abajo) y espera a que se propague (de minutos a 24 horas).
7. Cuando GitHub lo permita, activa **Enforce HTTPS** en Settings > Pages.

### Registros DNS

| Tipo  | Nombre | Valor |
|-------|--------|-------|
| A     | @      | 185.199.108.153 |
| A     | @      | 185.199.109.153 |
| A     | @      | 185.199.110.153 |
| A     | @      | 185.199.111.153 |
| AAAA  | @      | 2606:50c0:8000::153 |
| AAAA  | @      | 2606:50c0:8001::153 |
| AAAA  | @      | 2606:50c0:8002::153 |
| AAAA  | @      | 2606:50c0:8003::153 |
| CNAME | www    | patrickusaf.github.io |

- Borra los registros A o AAAA que el registrador tenga por defecto para `@`.
- **No toques los registros MX, TXT, SRV ni los CNAME del correo** (mail, imap, pop, smtp, webmail, autoconfig, autodiscover): son los que hacen funcionar contacto@psforense.es.
- En DonDominio, borra el registro **ANAME** de `psforense.es` y el **CNAME comodín** `*.psforense.es`, que apuntan al hosting de DonDominio.
- No uses registros comodín (`*`).

Comprobación desde el Terminal:

```
dig psforense.es +noall +answer -t A
dig www.psforense.es +noall +answer
```

## Publicar en un hosting tradicional

Sube el contenido de esta carpeta a la carpeta pública del hosting (normalmente `public_html`) por FTP o desde el gestor de archivos. En servidores Apache, para usar la página de error personalizada, crea un archivo `.htaccess` con:

```
ErrorDocument 404 /404.html
```

Los archivos `CNAME` y `.nojekyll` solo sirven para GitHub Pages y se pueden omitir.

## Editar contenidos

- Los textos están directamente en cada `index.html`.
- Colores y tipografía: variables al principio de `assets/css/styles.css`.
- Datos de contacto: aparecen en la cabecera, el pie y la página de contacto de cada archivo. Usa buscar y reemplazar en todo el proyecto (respeta la marca «(Ref. web)» de los enlaces de WhatsApp).
- Tras cambiar una página, actualiza la fecha `lastmod` en `sitemap.xml`.

## Versionado

Versionado semántico `MAYOR.MENOR.PARCHE`: **parche** = correcciones de texto o errores; **menor** = páginas o secciones nuevas; **mayor** = rediseño o cambio de marca. Al publicar una versión: actualiza `VERSION` y `CHANGELOG.md`, haz el commit y crea la etiqueta:

```
git commit -am "1.2.1: descripción"
git tag -a v1.2.1 -m "Versión 1.2.1"
git push --follow-tags
```

## Tipografías

La web usa Instrument Sans e IBM Plex Serif, muy próximas a las tipografías de la marca. Para usar las oficiales (Familjen Grotesk y Source Serif 4), descárgalas de fonts.google.com, conviértelas a WOFF2, guárdalas en `assets/fonts/` y descomenta el bloque "Tipografías oficiales" en `assets/css/styles.css`. 
