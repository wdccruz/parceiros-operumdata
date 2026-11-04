// Tags oficiais (Google Analytics 4 e Meta Pixel) com consentimento prévio (LGPD).
// Nada de terceiros é carregado antes do "Aceitar". A escolha fica no navegador
// e pode ser revista pelo link "Cookies" que o script adiciona ao rodapé.

const GA4 = /^G-[A-Z0-9]{4,20}$/;
const PIXEL = /^\d{6,20}$/;

const TEXT = {
  pt: {
    msg: "Usamos cookies do Google Analytics e da Meta para medir visitas e melhorar a divulgação, somente com a sua autorização.",
    accept: "Aceitar",
    decline: "Recusar",
    privacy: "Privacidade",
    prefs: "Cookies",
    label: "Aviso de cookies",
  },
  en: {
    msg: "We use Google Analytics and Meta cookies to measure visits and improve our outreach, only with your consent.",
    accept: "Accept",
    decline: "Decline",
    privacy: "Privacy",
    prefs: "Cookies",
    label: "Cookie notice",
  },
};

export function validateTracking({ ga4, metaPixel }) {
  const errors = [];
  if (ga4 && !GA4.test(ga4)) errors.push(`GA4 inválido (esperado G-XXXXXXXXXX): ${ga4}`);
  if (metaPixel && !PIXEL.test(String(metaPixel))) errors.push(`Meta Pixel inválido (só números): ${metaPixel}`);
  return errors;
}

export function trackingActive({ ga4, metaPixel }) {
  return Boolean(ga4 || metaPixel);
}

// HTML para colocar logo antes de </body>.
// footerSelector: onde entra o link "Cookies" para rever a escolha.
export function trackingSnippet({ ga4, metaPixel, lang = "pt", privacyHref = "", footerSelector = "footer" }) {
  if (!trackingActive({ ga4, metaPixel })) return "";
  const errors = validateTracking({ ga4, metaPixel });
  if (errors.length) throw new Error(errors.join("; "));
  const t = TEXT[lang] || TEXT.pt;
  const cfg = JSON.stringify({ ga: ga4 || null, px: metaPixel ? String(metaPixel) : null, sel: footerSelector, prefs: t.prefs });
  return `<div class="od-consent" id="od-consent" role="dialog" aria-live="polite" aria-label="${t.label}" hidden>
  <p>${t.msg}${privacyHref ? ` <a href="${privacyHref}">${t.privacy}</a>` : ""}</p>
  <div class="od-consent__actions"><button type="button" data-consent="no">${t.decline}</button><button type="button" data-consent="yes" class="is-primary">${t.accept}</button></div>
</div>
<style>
.od-consent{position:fixed;left:16px;bottom:16px;z-index:1000;max-width:420px;padding:16px 18px;background:#111114;color:#f7f4ef;border:1px solid rgba(247,244,239,.18);box-shadow:0 12px 40px rgba(0,0,0,.5);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
.od-consent[hidden]{display:none}
.od-consent p{margin:0 0 12px;color:#d9d5ce}
.od-consent a{color:#ff7442}
.od-consent__actions{display:flex;gap:8px;justify-content:flex-end}
.od-consent button{font:inherit;font-weight:600;padding:8px 16px;cursor:pointer;background:transparent;color:#f7f4ef;border:1px solid rgba(247,244,239,.35)}
.od-consent button.is-primary{background:#ff5a1f;border-color:#ff5a1f;color:#050506}
.od-consent button:focus-visible{outline:2px solid #ff7442;outline-offset:2px}
.od-consent-link{background:none;border:0;padding:0;font:inherit;color:inherit;text-decoration:underline;cursor:pointer;opacity:.8}
@media (max-width:600px){.od-consent{left:8px;right:8px;bottom:8px;max-width:none}}
</style>
<script>
(function(){
  var C=${cfg},K="od-consent-v1",d=document,box=d.getElementById("od-consent");
  function get(){try{return localStorage.getItem(K)}catch(e){return null}}
  function set(v){try{localStorage.setItem(K,v)}catch(e){}}
  function load(){
    if(C.ga){
      window.dataLayer=window.dataLayer||[];window.gtag=function(){dataLayer.push(arguments)};
      gtag("js",new Date());gtag("config",C.ga);
      var s=d.createElement("script");s.async=true;s.src="https://www.googletagmanager.com/gtag/js?id="+C.ga;d.head.appendChild(s);
    }
    if(C.px){
      !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version="2.0";n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,d,"script","https://connect.facebook.net/en_US/fbevents.js");
      fbq("init",C.px);fbq("track","PageView");
    }
  }
  box.addEventListener("click",function(e){
    var b=e.target.closest("[data-consent]");if(!b)return;
    var v=b.getAttribute("data-consent"),before=get();set(v);box.hidden=true;
    if(v==="yes"&&before!=="yes")load();
    if(v==="no"&&before==="yes")location.reload();
  });
  var f=d.querySelector(C.sel);
  if(f){var l=d.createElement("button");l.type="button";l.className="od-consent-link";l.textContent=C.prefs;l.addEventListener("click",function(){box.hidden=false;box.querySelector("button").focus()});f.appendChild(l)}
  var v=get();if(v==="yes")load();else if(v!=="no")box.hidden=false;
})();
</script>`;
}
