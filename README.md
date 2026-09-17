# ps-forense.es

Web profesional de **Patrick Svensson, Psicología Forense** (versión 1.1 de la marca).

Sitio estático en HTML, CSS y JavaScript, sin dependencias ni proceso de compilación. No usa cookies, analítica ni recursos de terceros: tipografías, imágenes y código se sirven desde el propio dominio.

## Estructura

```
index.html                Inicio
servicios/index.html      Servicios
sobre-mi/index.html       Sobre mí
contacto/index.html       Contacto (el formulario abre el programa de correo; no envía datos a ningún servidor)
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

## Antes de publicar

Los textos pendientes aparecen marcados en rojo con corchetes dentro de la web.

1. **Aviso legal y privacidad:** completa tu **NIF** y tu **domicilio profesional** (`aviso-legal/index.html` y `privacidad/index.html`). La LSSI-CE obliga a publicarlos.
2. **Privacidad:** indica el **proveedor de tu correo** (por ejemplo, Google Workspace o el de tu registrador).
3. **Formación:** si todavía estás cursando el máster, cambia en `sobre-mi/index.html` la línea `Máster en Psicología Forense` por `Máster en Psicología Forense (en curso)`.
4. **Dominio:** el archivo `CNAME` contiene `ps-forense.es`, el dominio de tu correo. Si el dominio que vas a usar es otro, cámbialo ahí y en `sitemap.xml`, `robots.txt` y las etiquetas `canonical` y `og:` de cada página (buscar y reemplazar `https://ps-forense.es`).
5. Pide a un profesional que revise los textos legales antes de publicar.

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

1. Crea el repositorio en GitHub (por ejemplo `ps-forense-web`).
2. Sube el **contenido** de esta carpeta a la raíz de la rama `main` (incluidos `CNAME` y `.nojekyll`, que son archivos ocultos: en Mac, pulsa `Cmd + Mayús + .` para verlos en el Finder).
   ```
   git init
   git add .
   git commit -m "Web PS Forense v1.1"
   git branch -M main
   git remote add origin https://github.com/TU_USUARIO/ps-forense-web.git
   git push -u origin main
   ```
3. En el repositorio: **Settings > Pages > Build and deployment > Source: Deploy from a branch**, rama `main`, carpeta `/ (root)`. Guarda.
4. En **Custom domain** debe aparecer `ps-forense.es` (lo toma del archivo `CNAME`). Si no, escríbelo y guarda.
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
| CNAME | www    | TU_USUARIO.github.io |

- Borra los registros A o AAAA que el registrador tenga por defecto para `@`.
- **No toques los registros MX ni los TXT del correo**: son los que hacen funcionar contacto@ps-forense.es.
- No uses registros comodín (`*`).

Comprobación desde el Terminal:

```
dig ps-forense.es +noall +answer -t A
dig www.ps-forense.es +noall +answer
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
