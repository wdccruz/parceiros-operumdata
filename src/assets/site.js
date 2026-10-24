// Melhoria progressiva. A página é legível sem este script.
// - revelação ao rolar e pausa de animações fora da tela
// - estado do cabeçalho e item atual do menu
// - validação acessível do formulário
// - envio SOMENTE quando um endpoint real estiver configurado; o resultado
//   mostrado ao usuário reflete a resposta real do servidor.
(function () {
  "use strict";
  window.__operum = true;
  var d = document;

  var header = d.querySelector(".site-header");
  function onScroll() {
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 12);
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  var reveals = d.querySelectorAll(".reveal");
  var anims = d.querySelectorAll("[data-anim]");
  if ("IntersectionObserver" in window) {
    var ro = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("is-in"); ro.unobserve(e.target); }
      });
    }, { rootMargin: "0px 0px -6% 0px", threshold: 0.05 });
    reveals.forEach(function (el) { ro.observe(el); });

    var po = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { e.target.classList.toggle("is-playing", e.isIntersecting); });
    });
    anims.forEach(function (el) { po.observe(el); });

    var links = {};
    d.querySelectorAll('.desktop-nav a[href^="#"]').forEach(function (a) { links[a.getAttribute("href").slice(1)] = a; });
    var no = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting || !links[e.target.id]) return;
        Object.keys(links).forEach(function (k) { links[k].removeAttribute("aria-current"); });
        links[e.target.id].setAttribute("aria-current", "location");
      });
    }, { rootMargin: "-40% 0px -55% 0px" });
    Object.keys(links).forEach(function (id) { var s = d.getElementById(id); if (s) no.observe(s); });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-in"); });
    anims.forEach(function (el) { el.classList.add("is-playing"); });
  }

  // Menu móvel
  d.querySelectorAll(".mobile-nav a").forEach(function (a) {
    a.addEventListener("click", function () { var m = a.closest("details"); if (m) m.open = false; });
  });
  d.addEventListener("keydown", function (ev) {
    if (ev.key !== "Escape") return;
    var m = d.querySelector(".mobile-nav[open]");
    if (!m) return;
    m.open = false;
    var s = m.querySelector("summary");
    if (s) s.focus();
  });

  // ------------------------------------------------------------------ Formulário
  var form = d.getElementById("lead-form");
  if (!form) return;
  var endpoint = form.getAttribute("data-endpoint") || "";

  function digits(v) { return (v || "").replace(/\D/g, ""); }

  // Máscara leve para WhatsApp: (11) 91234-5678
  var whats = form.querySelector("#f-whats");
  if (whats) {
    whats.addEventListener("input", function () {
      var n = digits(whats.value).slice(0, 11);
      var out = n;
      if (n.length > 2) out = "(" + n.slice(0, 2) + ") " + n.slice(2);
      if (n.length > 7) out = "(" + n.slice(0, 2) + ") " + n.slice(2, n.length - 4) + "-" + n.slice(n.length - 4);
      whats.value = out;
    });
  }

  var messages = {
    nome: "Informe o nome do responsável.",
    empresa: "Informe o nome da empresa.",
    cidade: "Informe a cidade.",
    uf: "Selecione o estado.",
    ramo: "Selecione o ramo de atividade.",
    profissionais: "Selecione a quantidade aproximada de profissionais.",
    whatsapp: "Informe um WhatsApp com DDD, por exemplo (11) 91234-5678.",
    consentimento: "Para receber o contato, é preciso marcar esta autorização.",
  };

  function validate(el) {
    var name = el.name;
    if (!messages[name]) return true;
    var ok;
    if (el.type === "checkbox") ok = el.checked;
    else if (name === "whatsapp") { var n = digits(el.value); ok = n.length === 10 || n.length === 11; }
    else ok = el.value.trim().length >= (Number(el.getAttribute("minlength")) || 1);
    var err = d.getElementById(el.getAttribute("aria-describedby").split(" ").pop());
    el.setAttribute("aria-invalid", ok ? "false" : "true");
    if (err) err.textContent = ok ? "" : messages[name];
    return ok;
  }

  var fields = form.querySelectorAll("input, select, textarea");
  fields.forEach(function (el) {
    el.addEventListener("blur", function () { if (el.value || el.type === "checkbox") validate(el); });
    el.addEventListener("change", function () { if (el.getAttribute("aria-invalid") === "true") validate(el); });
  });

  var result = d.getElementById("form-result");
  function show(kind, text) {
    result.hidden = false;
    result.className = "form-result " + (kind === "ok" ? "is-ok" : "is-error");
    result.textContent = text;
  }

  form.addEventListener("submit", function (ev) {
    ev.preventDefault();
    // Sem destino configurado: nada é enviado, nada é simulado.
    if (!endpoint) return;

    var first = null;
    fields.forEach(function (el) { if (!validate(el) && !first) first = el; });
    if (first) { first.focus(); return; }

    var btn = form.querySelector('button[type="submit"]');
    var data = {};
    new FormData(form).forEach(function (v, k) { data[k] = v; });
    data.whatsapp = digits(data.whatsapp);
    btn.disabled = true;
    btn.textContent = "Enviando…";

    fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(data),
    })
      .then(function (res) {
        if (!res.ok) throw new Error(String(res.status));
        show("ok", "Recebemos seu interesse. Se houver possível compatibilidade, a OperumData entrará em contato pelo WhatsApp informado. Isso não significa aprovação ou contratação.");
        form.reset();
      })
      .catch(function () {
        show("error", "Não foi possível enviar agora. Nenhum cadastro foi registrado. Tente novamente em alguns minutos.");
      })
      .then(function () { btn.disabled = false; btn.textContent = "Enviar interesse"; });
  });
})();
