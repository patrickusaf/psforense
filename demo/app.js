// Comportamientos de la interfaz. La política de seguridad (CSP) no permite manejadores en línea
// (onclick, onchange…), así que se activan con atributos data-*:
//   <select data-auto> / <input type=checkbox data-auto>   envía el formulario al cambiar (filtros)
//   <form data-confirm="…">     pide confirmación antes de enviar
//   <button data-print>         abre el diálogo de impresión
document.addEventListener("change", (e) => {
  const s = e.target;
  if (s.matches && s.matches("select[data-auto], input[type=checkbox][data-auto]") && s.form) s.form.submit();
});
document.addEventListener("submit", (e) => {
  const msg = e.target.getAttribute && e.target.getAttribute("data-confirm");
  if (msg && !window.confirm(msg)) e.preventDefault();
});
document.addEventListener("click", (e) => {
  if (e.target.closest && e.target.closest("[data-print]")) window.print();
});

// Menú principal: botón en móvil, grupos desplegables (uno abierto a la vez en escritorio; en móvil se abre el activo)
(function () {
  var boton = document.querySelector("[data-menu]"), nav = document.getElementById("menu-principal");
  if (!boton || !nav) return;
  var movil = function () { return window.matchMedia("(max-width: 860px)").matches; };
  var grupos = Array.prototype.slice.call(nav.querySelectorAll("details.grupo"));
  var cerrarGrupos = function (menos) { grupos.forEach(function (g) { if (g !== menos) g.open = false; }); };
  boton.addEventListener("click", function () {
    var abierto = nav.classList.toggle("abierto");
    boton.setAttribute("aria-expanded", abierto ? "true" : "false");
  });
  grupos.forEach(function (g) { if (movil() && g.classList.contains("on")) g.open = true; });
  // Un solo grupo abierto a la vez (si no, se acumulan varios con su marca activa y parece que el rojo "se queda fijo" en el que ya
  // no toca). Se decide al vuelo, sin esperar al evento "toggle" del <details> (con varios grupos su orden no es fiable).
  nav.addEventListener("click", function (e) {
    var resumen = e.target.closest("summary");
    var grupo = resumen && resumen.closest("details.grupo");
    if (!grupo) return;
    e.preventDefault();
    var abrir = !grupo.open;
    cerrarGrupos(null);
    grupo.open = abrir;
  });
  document.addEventListener("click", function (e) { if (!movil() && !e.target.closest("details.grupo")) cerrarGrupos(null); });
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    cerrarGrupos(null); nav.classList.remove("abierto"); boton.setAttribute("aria-expanded", "false");
  });
})();

// Interruptores (activar/desactivar): un botón role=switch que guarda su valor en un input oculto del mismo <span class="interruptor">.
document.addEventListener("click", (e) => {
  var boton = e.target.closest && e.target.closest("[data-interruptor]");
  if (!boton) return;
  var activo = boton.getAttribute("aria-checked") === "true", siguiente = !activo;
  boton.setAttribute("aria-checked", String(siguiente));
  var caja = boton.closest(".interruptor");
  var oculto = caja && caja.querySelector("input[type=hidden]");
  if (oculto) oculto.value = siguiente ? (boton.getAttribute("data-on") || "si") : (boton.getAttribute("data-off") || "no");
  var estado = caja && caja.querySelector(".interruptor-estado");
  if (estado) {
    estado.textContent = siguiente ? (boton.getAttribute("data-etiqueta-on") || "Activado") : (boton.getAttribute("data-etiqueta-off") || "Desactivado");
    estado.classList.toggle("des", !siguiente);
  }
});

// Pestañas (por ejemplo, en Ajustes): un solo panel visible a la vez, con la URL (#ancla) recordando cuál. Sin JS se ven todos seguidos.
(function () {
  var listas = Array.prototype.slice.call(document.querySelectorAll('[role="tablist"]'));
  listas.forEach(function (lista) {
    var pestañas = Array.prototype.slice.call(lista.querySelectorAll('[role="tab"]'));
    if (!pestañas.length) return;
    var activar = function (id, mover) {
      var activa = null;
      pestañas.forEach(function (t) {
        var on = t.getAttribute("data-tab") === id, panel = document.getElementById(t.getAttribute("data-tab"));
        t.setAttribute("aria-selected", on ? "true" : "false");
        t.tabIndex = on ? 0 : -1;
        if (panel) panel.hidden = !on;
        if (on) activa = t;
      });
      // Si la pestaña activa no cabe en la tira (por ejemplo, al llegar con #notificaciones en móvil), se desplaza hasta que se vea.
      if (activa) activa.scrollIntoView({ block: "nearest", inline: "nearest" });
      if (mover) { var el = document.getElementById(id); if (el) el.scrollIntoView({ block: "start", behavior: "smooth" }); }
    };
    var deseada = location.hash.slice(1);
    var inicial = pestañas.some(function (t) { return t.getAttribute("data-tab") === deseada; }) ? deseada : pestañas[0].getAttribute("data-tab");
    activar(inicial, false);
    pestañas.forEach(function (t) {
      t.addEventListener("click", function () {
        activar(t.getAttribute("data-tab"), false);
        history.replaceState(null, "", "#" + t.getAttribute("data-tab"));
      });
    });
    lista.addEventListener("keydown", function (e) {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      var i = pestañas.indexOf(document.activeElement);
      if (i === -1) return;
      e.preventDefault();
      var j = e.key === "ArrowRight" ? (i + 1) % pestañas.length : (i - 1 + pestañas.length) % pestañas.length;
      pestañas[j].focus(); activar(pestañas[j].getAttribute("data-tab"), false);
      history.replaceState(null, "", "#" + pestañas[j].getAttribute("data-tab"));
    });
  });
})();

// Comprobadores de formato al salir del campo (data-valida="nif|colegiado|email"): el mismo cálculo que en el servidor
// (validaciones.js), para avisar antes de enviar el formulario. El servidor es quien de verdad decide: esto es solo un aviso.
(function () {
  var TABLA = "TRWAGMYFPDXBNJZSQVHLCKE";
  function dni(s) { var m = /^(\d{8})([A-Z])$/.exec(s); return !!m && TABLA[Number(m[1]) % 23] === m[2]; }
  function nie(s) { var m = /^([XYZ])(\d{7})([A-Z])$/.exec(s); if (!m) return false; var p = { X: "0", Y: "1", Z: "2" }[m[1]]; return TABLA[Number(p + m[2]) % 23] === m[3]; }
  function cif(s) {
    var m = /^([ABCDEFGHJKLMNPQRSUVW])(\d{7})([0-9A-J])$/.exec(s);
    if (!m) return false;
    var num = m[2], pares = 0, impares = 0, i, d, doble;
    for (i = 0; i < num.length; i++) { d = Number(num[i]); if (i % 2 === 0) { doble = d * 2; impares += doble > 9 ? doble - 9 : doble; } else pares += d; }
    var dc = (10 - ((pares + impares) % 10)) % 10;
    return m[3] === String(dc) || m[3] === "JABCDEFGHI"[dc];
  }
  var EMAIL = /^[^\s@<>()",;:\\[\]]+@[^\s@<>()",;:\\[\]]+\.[^\s@<>()",;:\\[\]]{2,}$/;
  var validadores = {
    nif: function (v) { var s = v.trim().toUpperCase().replace(/[\s-]/g, ""); return !s || dni(s) || nie(s) || cif(s); },
    colegiado: function (v) { var s = v.trim(); return !s || /^[A-Za-zÀ-ÿ]{1,4}[- ]?\d{1,6}$/.test(s); },
    email: function (v) { var s = v.trim(); return !s || EMAIL.test(s); },
  };
  var mensajes = { nif: "No parece un NIF, NIE o CIF válido (revisa la letra)", colegiado: "No parece un número de colegiado (por ejemplo, AO-15009)", email: "No parece un correo válido" };
  document.addEventListener("blur", function (e) {
    var campo = e.target, tipo = campo.getAttribute && campo.getAttribute("data-valida");
    if (!tipo || !validadores[tipo]) return;
    var vale = validadores[tipo](campo.value || "");
    campo.classList.toggle("campo-mal", !vale);
    var sig = campo.nextElementSibling, aviso = sig && sig.classList && sig.classList.contains("campo-aviso") ? sig : null;
    if (!vale) {
      if (!aviso) { aviso = document.createElement("span"); aviso.className = "campo-aviso"; campo.insertAdjacentElement("afterend", aviso); }
      aviso.textContent = mensajes[tipo];
    } else if (aviso) aviso.remove();
  }, true);
})();

// Chat y comentarios: cada pocos segundos pide los mensajes nuevos del canal y los añade (el texto se inserta como texto, nunca como HTML).
(function () {
  var cajas = Array.prototype.slice.call(document.querySelectorAll("[data-chat]"));
  if (!cajas.length || !window.fetch) return;
  var nuevo = function (m) {
    var a = document.createElement("article");
    a.className = "msg" + (m.mio ? " mio" : "") + (m.eliminado ? " eliminado" : "");
    a.setAttribute("data-id", m.id);
    var h = document.createElement("header"), b = document.createElement("b"), t = document.createElement("span"), p = document.createElement("p");
    b.textContent = m.autor; t.className = "mini"; t.textContent = " " + m.hora; h.appendChild(b); h.appendChild(t);
    p.className = "texto"; p.textContent = m.eliminado ? "Mensaje eliminado" : m.texto;
    a.appendChild(h); a.appendChild(p);
    return a;
  };
  var abajo = function (el) { return el.scrollHeight - el.scrollTop - el.clientHeight < 80; };
  cajas.forEach(function (caja) {
    caja.scrollTop = caja.scrollHeight;
    var ocupado = false;
    setInterval(function () {
      if (ocupado || document.hidden) return;
      ocupado = true;
      var desde = parseInt(caja.getAttribute("data-ultimo"), 10) || 0;
      fetch("/chat/api?canal=" + encodeURIComponent(caja.getAttribute("data-canal")) + "&desde=" + desde, { credentials: "same-origin", headers: { Accept: "application/json" } })
        .then(function (r) { return r.ok ? r.json() : null; })
        .then(function (d) {
          if (!d || !d.mensajes || !d.mensajes.length) return;
          var seguir = abajo(caja), vacio = caja.querySelector(".chat-vacio");
          if (vacio) vacio.remove();
          d.mensajes.forEach(function (m) { if (!caja.querySelector('[data-id="' + m.id + '"]')) caja.appendChild(nuevo(m)); caja.setAttribute("data-ultimo", m.id); });
          if (seguir) caja.scrollTop = caja.scrollHeight;
        })
        .catch(function () {})
        .then(function () { ocupado = false; });
    }, 4000);
  });
  // Ctrl/⌘ + Intro envía el mensaje
  document.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey) && e.target.matches && e.target.matches(".chat-form textarea") && e.target.form) e.target.form.submit();
  });
})();
