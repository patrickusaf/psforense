/* PS Forense · Patrick Svensson · main.js
   Sin cookies, sin analítica y sin servicios de terceros. */
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

  // Formulario de contacto: prepara un correo en el programa del usuario.
  // Los datos no se envían a ningún servidor.
  var form = document.getElementById("form-contacto");
  if (!form) return;
  var destino = form.getAttribute("data-destino");
  var estado = document.getElementById("form-estado");

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
  });
})();
