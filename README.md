# psforense.es

Web profesional de **Patrick Svensson, Psicología Forense** (versión 1.1 de la marca).

Sitio estático en HTML, CSS y JavaScript, sin dependencias ni proceso de compilación. No usa cookies ni analítica: tipografías, imágenes y código se sirven desde el propio dominio. La única conexión externa es el envío del formulario de contacto (ver «Formulario de contacto»).

## Estructura

```
index.html                Inicio
servicios/index.html      Servicios
sobre-mi/index.html       Sobre mí
contacto/index.html       Contacto (formulario: con `data-endpoint` envía el mensaje al Worker; sin él abre el programa de correo)
aviso-legal/index.html    Aviso legal (LSSI-CE)
privacidad/index.html     Política de privacidad (RGPD)
cookies/index.html        Política de cookies
404.html                  Página de error
assets/css/styles.css     Estilos
assets/js/main.js         Menú móvil y formulario
assets/img/               Fotografías e imagen para redes (og-image.png)
assets/fonts/             Tipografías (licencia SIL OFL incluida)
CNAME                     Dominio personalizado para GitHub Pages
.nojekyll                 Evita que GitHub Pages procese el sitio con Jekyll
robots.txt, sitemap.xml   Buscadores
favicon.svg y PNG, site.webmanifest   Iconos
```

## Formulario de contacto

El formulario envía el mensaje a `contacto@psforense.es` y una confirmación automática al remitente desde `avisos@psforense.es`. Como esta web es estática,
el envío lo hace un pequeño Cloudflare Worker (proyecto `psforense-formulario`, con sus instrucciones de despliegue). Cuando lo tengas desplegado:

1. Copia la URL del Worker (`https://psforense-formulario.<tu-subdominio>.workers.dev/enviar`).
2. Pégala en `contacto/index.html`, en el atributo `data-endpoint=""` del formulario.
3. Publica la web. Mientras `data-endpoint` esté vacío, el formulario funciona como antes (abre el programa de correo).

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
- Datos de contacto: aparecen en la cabecera, el pie y la página de contacto de cada archivo. Usa buscar y reemplazar en todo el proyecto.
- Tras cambiar una página, actualiza la fecha `lastmod` en `sitemap.xml`.

## Tipografías

La web usa Instrument Sans e IBM Plex Serif, muy próximas a las tipografías de la marca. Para usar las oficiales (Familjen Grotesk y Source Serif 4), descárgalas de fonts.google.com, conviértelas a WOFF2, guárdalas en `assets/fonts/` y descomenta el bloque "Tipografías oficiales" en `assets/css/styles.css`.
