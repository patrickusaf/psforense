/* PS Forense · Patrick Svensson · main.js
   Sin cookies ni analítica. Solo al pulsar «Enviar» en el formulario de contacto, el mensaje viaja a un servicio de envío
   propio (Cloudflare Worker) que lo manda por correo; no se guarda. Ver ../psforense-formulario. */
(function () {
  "use strict";

  // Menú móvil
  var boton = document.querySelector(".menu-boton");
  var menu = document.getElementById("menu");
  if (boton && menu) {
    var cerrar = function () {
      menu.classList.remove("abierto");
      boton.setAttribute("aria-expanded", "false");
      boton.querySelector(".texto").textContent = "Menú";
    };
    boton.addEventListener("click", function () {
      var abierto = menu.classList.toggle("abierto");
      boton.setAttribute("aria-expanded", abierto ? "true" : "false");
      boton.querySelector(".texto").textContent = abierto ? "Cerrar" : "Menú";
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && menu.classList.contains("abierto")) { cerrar(); boton.focus(); }
    });
    menu.addEventListener("click", function (e) {
      if (e.target.closest("a")) cerrar();
    });
    window.matchMedia("(min-width: 861px)").addEventListener("change", function (mq) {
      if (mq.matches) cerrar();
    });
  }

  // Año del pie
  document.querySelectorAll("[data-anio]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  // Formulario de contacto. Si data-endpoint está vacío, prepara un correo en el programa del usuario (sin enviar datos).
  // Con data-endpoint, envía el mensaje al servicio de envío y muestra el resultado.
  var form = document.getElementById("form-contacto");
  if (!form) return;
  var destino = form.getAttribute("data-destino");
  var endpoint = form.getAttribute("data-endpoint") || "";
  if (!endpoint) {
    var intro = document.getElementById("form-intro");
    if (intro) intro.textContent = "Al pulsar el botón se abrirá tu programa de correo con el mensaje listo para enviar. Esta web no guarda ni envía tus datos.";
    var btn0 = form.querySelector('button[type="submit"]'); if (btn0) btn0.textContent = "Preparar correo";
  }
  var estado = document.getElementById("form-estado");
  var boton = form.querySelector('button[type="submit"]');
  var cargada = Date.now();   // para detectar robots que rellenan el formulario al instante

  var reglas = {
    nombre: function (v) { return v.trim().length >= 2 || "Escribe tu nombre."; },
    email: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) || "Escribe un correo válido, por ejemplo nombre@dominio.es."; },
    perfil: function (v) { return v !== "" || "Indica quién hace la consulta."; },
    tipo: function (v) { return v !== "" || "Elige el tipo de caso."; },
    mensaje: function (v) { return v.trim().length >= 10 || "Cuéntame en una o dos frases qué necesitas."; },
    privacidad: function (_, el) { return el.checked || "Necesito que aceptes la política de privacidad para responderte."; }
  };

  function validar(nombre) {
    var el = form.elements[nombre];
    var res = reglas[nombre](el.value, el);
    var err = document.getElementById("error-" + nombre);
    if (res === true) {
      el.removeAttribute("aria-invalid");
      if (err) { err.textContent = ""; err.classList.remove("visible"); }
      return true;
    }
    el.setAttribute("aria-invalid", "true");
    if (err) { err.textContent = res; err.classList.add("visible"); }
    return false;
  }

  Object.keys(reglas).forEach(function (n) {
    var el = form.elements[n];
    el.addEventListener(el.type === "checkbox" || el.tagName === "SELECT" ? "change" : "blur", function () {
      if (el.hasAttribute("aria-invalid") || el.value) validar(n);
    });
  });

  function mostrarErroresServidor(errores) {
    var primero = null;
    Object.keys(errores).forEach(function (n) {
      var el = form.elements[n];
      var err = document.getElementById("error-" + n);
      if (!el) return;
      el.setAttribute("aria-invalid", "true");
      if (err) { err.textContent = errores[n]; err.classList.add("visible"); }
      if (!primero) primero = el;
    });
    if (primero) primero.focus();
  }

  function fallo(mensaje) {
    estado.className = "estado fallo";
    estado.textContent = mensaje || "No se ha podido enviar el mensaje. Escríbeme directamente a " + destino + " o por WhatsApp.";
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    estado.textContent = "";
    estado.className = "estado";
    var primero = null;
    Object.keys(reglas).forEach(function (n) {
      if (!validar(n) && !primero) primero = form.elements[n];
    });
    if (primero) { primero.focus(); return; }

    var f = form.elements;
    if (!endpoint) {
      var asunto = "Consulta web: " + f.tipo.value + " (" + f.perfil.value + ")";
      var cuerpo =
        "Nombre: " + f.nombre.value.trim() + "\n" +
        "Correo: " + f.email.value.trim() + "\n" +
        "Consulta como: " + f.perfil.value + "\n" +
        "Tipo de caso: " + f.tipo.value + "\n\n" +
        f.mensaje.value.trim() + "\n\n" +
        "He leído y acepto la política de privacidad de psforense.es.";
      window.location.href = "mailto:" + destino +
        "?subject=" + encodeURIComponent(asunto) +
        "&body=" + encodeURIComponent(cuerpo);
      estado.className = "estado ok";
      estado.textContent = "Tu programa de correo se ha abierto con el mensaje preparado. Revísalo y pulsa enviar. Si no se ha abierto, escribe directamente a " + destino + ".";
      return;
    }

    var textoBoton = boton.textContent;
    boton.disabled = true;
    boton.textContent = "Enviando…";
    estado.textContent = "Enviando tu mensaje…";
    var control = new AbortController();
    var espera = setTimeout(function () { control.abort(); }, 20000);

    fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: control.signal,
      body: JSON.stringify({
        nombre: f.nombre.value, email: f.email.value, perfil: f.perfil.value, tipo: f.tipo.value,
        mensaje: f.mensaje.value, privacidad: f.privacidad.checked, web: f.web ? f.web.value : "",
        t: Date.now() - cargada
      })
    })
      .then(function (r) {
        return r.json().catch(function () { return {}; }).then(function (j) { return { ok: r.ok, estado: r.status, j: j }; });
      })
      .then(function (x) {
        if (x.ok && x.j.ok) {
          estado.className = "estado ok";
          estado.textContent = "Mensaje enviado. " + (x.j.confirmacion === false
            ? "Te responderé lo antes posible."
            : "Te he enviado un correo de confirmación; si no lo ves, mira la carpeta de correo no deseado. Te responderé lo antes posible.");
          form.reset();
          cargada = Date.now();
        } else if (x.estado === 400 && x.j.errores) {
          estado.textContent = "";
          mostrarErroresServidor(x.j.errores);
        } else {
          fallo(x.j.error);
        }
      })
      .catch(function () { fallo(); })
      .then(function () {
        clearTimeout(espera);
        boton.disabled = false;
        boton.textContent = textoBoton;
      });
  });
})();
