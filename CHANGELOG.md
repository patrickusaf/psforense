# Registro de cambios de psforense.es

Formato: versionado semántico (mayor.menor.parche).

## [1.3.5] · 2026-09-21
### Cambiado
- Demostración de Probatio (`/demo/`) actualizada a la versión 0.9.3: Ajustes rediseñado con secciones, listas y desplegables, y espacios corregidos entre los bloques de cada pantalla.

## [1.3.4] · 2026-09-21
### Corregido
- En la demostración de Probatio (`/demo/`), el menú desplegado en el móvil ahora se desplaza cuando no cabe en pantalla.

## [1.3.3] · 2026-09-21
### Cambiado
- La demostración de Probatio en `/demo/` se actualiza a la versión 0.9.1: nuevo apartado de Ajustes para activar o silenciar las notificaciones por Telegram y correo.

## [1.3.2] · 2026-09-20
### Cambiado
- La demostración de Probatio en `/demo/` se actualiza a la versión 0.9.0: panel con avisos y gráficos, varias personas con roles, chat y comentarios de caso.

## [1.3.1] · 2026-09-20
### Cambiado
- La demostración de Probatio en `/demo/` se actualiza a la versión 0.8.0 (nueva sección de evaluación psicológica).
### Corregido
- La demostración mostraba, en el registro de accesos de Ajustes, una dirección IP de red local. Ahora se sustituye por una de documentación.

## [1.3.0] · 2026-09-20
### Añadido
- **Capturas de Probatio** en `/software/` (panel, expediente, leads, gestoría, factura y vista móvil), con datos ficticios, dentro de la sección «Así se ve».
### Corregido
- En `/software/`, el bloque «Pruébala con tus propios casos» mostraba un marcador de plantilla sin sustituir en lugar de los botones de contacto (correo, WhatsApp y teléfono).

## [1.2.0] · 2026-09-20
### Añadido
- **Probatio:** página `/software/` con la descripción y condiciones de la herramienta, apartado en Servicios y bloque en la portada.
- **Demostración navegable** de Probatio en `/demo/`, con datos totalmente ficticios y sin conexión a ningún servidor.
- Enlace «Software» en el menú de todas las páginas (sustituye a «Cómo trabajo»).
- Los enlaces de WhatsApp llevan la marca «(Ref. web)» para identificar el origen de las consultas en el CRM.
- README con la relación entre los tres repositorios (web, `probatio` privado y `probatio-demo` público), versionado y CHANGELOG.
### Cambiado
- Sitemap actualizado con las páginas nuevas.

## [1.1.0] · 2026-09-19
### Añadido
- Formulario de contacto con envío propio (Cloudflare Worker): el mensaje llega a contacto@ y la persona recibe una confirmación automática.
### Cambiado
- Política de privacidad y cláusula del formulario: se incluye a Cloudflare como encargado del tratamiento y la retención de dos horas del resumen cifrado de la IP contra abusos.

## [1.0.0] · 2026-09-17
- Primera publicación: inicio, servicios, sobre mí, contacto, aviso legal, privacidad y cookies, con la identidad de marca v1.1.
