/*
 * Feria de Empleo de Tías · generador de la web.
 * Lee los textos de /contenido (los que se editan en el panel de Pages CMS)
 * y crea la página final en /dist. Vercel lo ejecuta solo en cada cambio.
 * No hace falta tocar este archivo para cambiar textos o fotos.
 */
'use strict';
const fs = require('fs');
const path = require('path');

const RAIZ = __dirname;
const SALIDA = path.join(RAIZ, 'dist');

function leer(nombre) {
  const archivo = path.join(RAIZ, 'contenido', nombre + '.json');
  try {
    return JSON.parse(fs.readFileSync(archivo, 'utf8'));
  } catch (e) {
    console.error('No se pudo leer ' + archivo + ': ' + e.message);
    process.exit(1);
  }
}

/* ---------- Ayudas ---------- */
const esc = (s) => String(s == null ? '' : s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// **texto** → negrita (o degradado en titulares), ==texto== → subrayado, salto de línea → <br>
function fmt(s, negrita = 'b') {
  return esc(s)
    .replace(/\*\*(.+?)\*\*/g, `<${negrita}>$1</${negrita}>`)
    .replace(/==(.+?)==/g, '<mark class="mark">$1</mark>')
    .replace(/\r?\n/g, '<br>');
}
const lista = (x) => (Array.isArray(x) ? x : []).filter((v) => v !== null && v !== undefined && v !== '');
const ENCUADRE = { centro: '', arriba: 'center 30%', abajo: 'center 75%', izquierda: '12% center', derecha: '88% center' };
const encuadre = (e) => (ENCUADRE[e] ? ` style="object-position:${ENCUADRE[e]}"` : '');
const ico = (id, extra = '') => `<svg class="ico"${extra}><use href="#i-${esc(id || 'star')}"/></svg>`;
const visible = (sec) => sec && sec.mostrar !== false;
const ruta = (src) => esc(src || '');
const titular = (t, d, cls = 'h2') => `<h2 class="${cls}">${esc(t)}${d ? ' <em>' + esc(d) + '</em>' : ''}</h2>`;

/* ---------- Contenido ---------- */
const g = leer('general');
const S = {
  portada: leer('portada'), crece: leer('crece'), concepto: leer('concepto'), programa: leer('programa'),
  ponencias: leer('ponencias'), talleres: leer('talleres'), contratamos: leer('contratamos'),
  espacios: leer('espacios'), galeria: leer('galeria'), cierre: leer('cierre'), patrocinadores: leer('patrocinadores'),
};
const IDS = { crece: 'crece', concepto: 'concepto', programa: 'programa', ponencias: 'ponencias', talleres: 'talleres', contratamos: 'hoy-contratamos', espacios: 'espacios', galeria: 'galeria' };
const menu = Object.keys(IDS).filter((k) => visible(S[k]) && S[k].menu).map((k) => ({ id: IDS[k], corto: S[k].menu, largo: S[k].menu_largo || S[k].menu }));

/* ---------- Secciones ---------- */
function portada(p) {
  return `
<section class="hero" id="inicio">
  <img class="hero-img" src="${ruta(p.imagen)}" alt="${esc(p.imagen_alt)}" fetchpriority="high">
  ${p.mostrar_organiza !== false && p.organiza_logo ? `<div class="hero-org-row"><div class="wrap">
    <div class="org-card" aria-label="Organiza: ${esc(S.patrocinadores.organiza_nombre)}"><small>Organiza</small><img src="${ruta(p.organiza_logo)}" alt="${esc(S.patrocinadores.organiza_nombre)}"></div>
  </div></div>` : ''}
  <div class="wrap">
    ${p.antetitulo ? `<div class="hero-kicker"><i></i>${esc(p.antetitulo)}<i></i></div>` : ''}
    <h1>${esc(p.titulo)}${p.titulo_destacado ? ' <em>' + esc(p.titulo_destacado) + '</em>' : ''}</h1>
    <p class="lema">${esc(p.lema_1)}${p.lema_2 ? '<span>' + esc(p.lema_2) + '</span>' : ''}</p>
    <div class="hero-meta">
      ${p.fecha ? `<span class="chip">${ico('cal')}${esc(p.fecha)}</span>` : ''}
      ${p.horario ? `<span class="chip">${ico('clock')}${esc(p.horario)}</span>` : ''}
      ${p.lugar ? `<span class="chip">${ico('pin')}${esc(p.lugar)}</span>` : ''}
    </div>
    <div class="hero-actions">
      ${p.boton_1_texto ? `<a class="btn btn-primary" href="${esc(p.boton_1_enlace || '#crece')}">${esc(p.boton_1_texto)} ${ico('down')}</a>` : ''}
      ${p.boton_2_texto ? `<a class="btn btn-ghost" href="${esc(p.boton_2_enlace || '#programa')}">${esc(p.boton_2_texto)}</a>` : ''}
    </div>
    <div class="hero-foot">
      <span>${fmt(p.pie)}</span>
      ${p.credito ? `<span>${esc(p.credito)}</span>` : ''}
    </div>
  </div>
</section>`;
}

function franja() {
  const items = lista(g.franja);
  if (!items.length) return '';
  const spans = items.map((t) => `<span>${esc(t)}</span>`).join('');
  return `<div class="ticker" aria-hidden="true"><div class="ticker-track">${spans}${spans}</div></div>`;
}

function crece(c) {
  if (!visible(c)) return '';
  const cifras = lista(c.cifras);
  return `
<section class="sec" id="crece">
  <div class="wrap">
    <div class="head rv">
      ${c.etiqueta ? `<span class="eyebrow">${esc(c.etiqueta)}</span>` : ''}
      ${titular(c.titulo, c.titulo_destacado)}
      ${c.entradilla ? `<p class="lead">${fmt(c.entradilla)}</p>` : ''}
    </div>
    <div class="grow">
      <div class="grow-photos rv">
        ${c.foto_1 ? `<div class="photo p1"><img src="${ruta(c.foto_1)}" alt="${esc(c.foto_1_pie)}" loading="lazy"${encuadre(c.foto_1_encuadre)}>${c.foto_1_pie ? `<span class="tag">${esc(c.foto_1_pie)}</span>` : ''}</div>` : ''}
        ${c.foto_2 ? `<div class="photo p2"><img src="${ruta(c.foto_2)}" alt="${esc(c.foto_2_pie)}" loading="lazy">${c.foto_2_pie ? `<span class="tag">${esc(c.foto_2_pie)}</span>` : ''}</div>` : ''}
        ${c.cita_titulo || c.cita_texto ? `<div class="grow-quote"><b>${esc(c.cita_titulo)}</b><p>${fmt(c.cita_texto)}</p></div>` : ''}
      </div>
      <div class="rv">
        <div class="stats">
          ${c.cifra_principal ? `<div class="stat big"><span class="n">${esc(c.cifra_principal)}</span><p>${fmt(c.cifra_principal_texto)}<span class="dots7" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><i></i></span></p></div>` : ''}
          ${cifras.map((x, i) => {
            const ancho = cifras.length % 2 === 1 && i === cifras.length - 1 ? ' style="grid-column:1/-1"' : '';
            return `<div class="stat${x.naranja ? ' or' : ''}"${ancho}><div class="n-row"><span class="n">${esc(x.numero)}</span>${x.unidad ? `<span class="unit">${esc(x.unidad)}</span>` : ''}</div><p>${fmt(x.texto)}</p></div>`;
          }).join('\n          ')}
        </div>
        ${c.nota ? `<p class="fine">${fmt(c.nota)}</p>` : ''}
      </div>
    </div>
  </div>
</section>`;
}

function concepto(c) {
  if (!visible(c)) return '';
  return `
<section class="sec band-paper" id="concepto">
  <div class="wrap">
    <div class="concept">
      <div class="rv">
        ${c.etiqueta ? `<span class="eyebrow">${esc(c.etiqueta)}</span>` : ''}
        <p class="manifesto" style="margin-top:20px">${fmt(c.manifiesto, 'em')}</p>
        ${c.entradilla ? `<p class="lead" style="margin-top:22px">${fmt(c.entradilla)}</p>` : ''}
        ${lista(c.palabras).length ? `<div class="trio-words">${lista(c.palabras).map((w) => `<span>${esc(w)}</span>`).join('')}</div>` : ''}
      </div>
      <div class="collage rv">
        ${c.foto_1 ? `<div class="photo c1"><img src="${ruta(c.foto_1)}" alt="${esc(c.foto_1_alt)}" loading="lazy"></div>` : ''}
        ${c.foto_2 ? `<div class="photo c2"><img src="${ruta(c.foto_2)}" alt="${esc(c.foto_2_alt)}" loading="lazy"></div>` : ''}
        ${c.pegatina ? `<div class="sticker">${fmt(c.pegatina)}</div>` : ''}
      </div>
    </div>
    <div class="aud">
      ${lista(c.publicos).map((a) => `<article class="rv${a.destacado ? ' hl' : ''}"><div class="ic">${ico(a.icono)}</div><h3>${esc(a.titulo)}</h3><p>${fmt(a.texto)}</p></article>`).join('\n      ')}
    </div>
  </div>
</section>`;
}

function minutos(h) {
  const m = String(h || '').match(/(\d{1,2})[:.](\d{2})\D+(\d{1,2})[:.](\d{2})/);
  if (!m) return null;
  return { ini: +m[1] * 60 + +m[2], fin: +m[3] * 60 + +m[4] };
}
const hhmm = (t) => String(Math.floor(t / 60)).padStart(2, '0') + ':' + String(t % 60).padStart(2, '0');
const COLOR = { escenario: 'var(--purple)', talleres: 'var(--orange)', encuentro: 'var(--lime)', cierre: 'var(--deep)', otro: 'var(--plum)' };

function programa(p) {
  if (!visible(p)) return '';
  const franjas = lista(p.franjas);
  const rutas = lista(p.rutas);
  const tiempos = franjas.map((f) => minutos(f.hora));
  const validos = tiempos.filter(Boolean);
  let barra = '';
  if (validos.length) {
    const ini = Math.min(...validos.map((t) => t.ini));
    const fin = Math.max(...validos.map((t) => t.fin));
    const marcas = [];
    for (let t = ini; t <= fin; t += 60) marcas.push(hhmm(t));
    if (marcas[marcas.length - 1] !== hhmm(fin)) marcas.push(hhmm(fin));
    barra = `
    <div class="rv" aria-hidden="true">
      <div class="dayline">${franjas.map((f, i) => `<i style="flex:${tiempos[i] ? tiempos[i].fin - tiempos[i].ini : 30};background:${COLOR[f.tipo] || COLOR.otro}"></i>`).join('')}</div>
      <div class="dayline-l">${marcas.map((m) => `<span>${m}</span>`).join('')}</div>
    </div>`;
  }
  const dp = (arr) => esc(lista(arr).join(' '));
  return `
<section class="sec" id="programa">
  <div class="wrap">
    <div class="head rv">
      ${p.etiqueta ? `<span class="eyebrow">${esc(p.etiqueta)}</span>` : ''}
      ${titular(p.titulo, p.titulo_destacado)}
      ${p.entradilla ? `<p class="lead">${fmt(p.entradilla)}</p>` : ''}
    </div>
    ${rutas.length ? `<div class="prog-top rv">
      <div class="filter">
        <span class="filter-label" id="chips-label">${esc(p.filtro_texto || 'Diseña tu mañana:')}</span>
        <div class="chips" role="group" aria-labelledby="chips-label">
          <button type="button" data-p="all" aria-pressed="true">Toda la feria</button>
          ${rutas.map((r) => `<button type="button" data-p="${esc(r.perfil)}" aria-pressed="false">${esc(r.boton || r.perfil)}</button>`).join('\n          ')}
        </div>
      </div>
    </div>` : ''}${barra}
    <div class="prog">
      <div class="slots">
        ${franjas.map((f) => {
          const cls = f.tipo === 'escenario' ? ' stage' : f.tipo === 'cierre' ? ' close' : '';
          const salas = lista(f.salas);
          const interior = salas.length
            ? `<div class="rooms">${salas.map((s) => `<div class="room" data-p="${dp(s.perfiles)}"><b>${esc(s.sala)}</b><span>${esc(s.titulo)}</span></div>`).join('')}</div>`
            : (f.texto ? `<p class="d">${fmt(f.texto)}</p>` : '');
          return `<div class="slot${cls}"${salas.length ? ' data-salas="1"' : ` data-p="${dp(f.perfiles)}"`}><span class="t">${esc(f.hora)}</span><div>${f.lugar ? `<p class="where">${esc(f.lugar)}</p>` : ''}<h3>${esc(f.titulo)}</h3>${salas.length && f.texto ? `<p class="d">${fmt(f.texto)}</p>` : ''}${interior}</div></div>`;
        }).join('\n        ')}
      </div>
      <aside class="side">
        <div class="route" id="route" hidden aria-live="polite">
          <h3 id="route-title">Tu ruta</h3>
          <ol id="route-list"></ol>
        </div>
        ${lista(p.toda_manana).length ? `<div class="allday">
          <h3>${esc(p.toda_manana_titulo || 'Toda la mañana')}</h3>
          <ul>
            ${lista(p.toda_manana).map((a) => `<li data-p="${dp(a.perfiles)}">${ico(a.icono)}<div><b>${esc(a.titulo)}</b><span>${fmt(a.texto)}</span></div></li>`).join('\n            ')}
          </ul>
        </div>` : ''}
      </aside>
    </div>
  </div>
</section>`;
}

function ponencias(p) {
  if (!visible(p)) return '';
  return `
<section class="sec band-paper" id="ponencias">
  <div class="wrap">
    <div class="head rv">
      ${p.etiqueta ? `<span class="eyebrow">${esc(p.etiqueta)}</span>` : ''}
      ${titular(p.titulo, p.titulo_destacado)}
      ${p.entradilla ? `<p class="lead">${fmt(p.entradilla)}</p>` : ''}
    </div>
    <div class="talks">
      ${lista(p.items).map((t) => `<article class="talk${t.estrella ? ' star' : ''} rv">
        ${t.foto ? `<div class="photo"><img src="${ruta(t.foto)}" alt="${esc(t.foto_pie || t.titulo)}" loading="lazy">${t.foto_pie ? `<span class="tag">${esc(t.foto_pie)}</span>` : ''}</div>` : ''}
        <div class="talk-body">
          <div class="when">${t.etiqueta ? `<span class="pill${t.estrella ? ' y' : ''}">${esc(t.etiqueta)}</span>` : ''}${esc(t.horario)}</div>
          <h3>${esc(t.titulo)}</h3>
          ${t.texto ? `<p>${fmt(t.texto)}</p>` : ''}
          ${t.nota ? `<p class="cap">${fmt(t.nota)}</p>` : ''}
          ${t.pendiente ? `<div class="pending">${ico('hourglass')}<span>${fmt(t.pendiente)}</span></div>` : ''}
        </div>
      </article>`).join('\n      ')}
    </div>
  </div>
</section>`;
}

function talleres(t) {
  if (!visible(t)) return '';
  return `
<section class="sec band-peach" id="talleres">
  <div class="wrap">
    <div class="head rv">
      ${t.etiqueta ? `<span class="eyebrow">${esc(t.etiqueta)}</span>` : ''}
      ${titular(t.titulo, t.titulo_destacado)}
      ${t.entradilla ? `<p class="lead">${fmt(t.entradilla)}</p>` : ''}
    </div>
    ${t.foto_1 || t.foto_2 ? `<div class="ws-photos rv">
      ${t.foto_1 ? `<div class="photo"><img src="${ruta(t.foto_1)}" alt="${esc(t.foto_1_pie)}" loading="lazy">${t.foto_1_pie ? `<span class="tag">${esc(t.foto_1_pie)}</span>` : ''}</div>` : ''}
      ${t.foto_2 ? `<div class="photo"><img src="${ruta(t.foto_2)}" alt="${esc(t.foto_2_pie)}" loading="lazy"${encuadre(t.foto_2_encuadre)}>${t.foto_2_pie ? `<span class="tag">${esc(t.foto_2_pie)}</span>` : ''}</div>` : ''}
    </div>` : ''}
    <div class="ws">
      ${lista(t.items).map((w, i) => {
        const pill = i % 2 === 1 ? 'pill o' : 'pill';
        return `<article class="w rv">
        ${w.insignia ? `<span class="top-badge">${esc(w.insignia)}</span>` : ''}
        <div class="w-top"><span class="k">${String(i + 1).padStart(2, '0')}</span><h3>${esc(w.titulo)}</h3></div>
        ${w.resumen ? `<p class="sum">${fmt(w.resumen)}</p>` : ''}
        ${w.te_llevas ? `<div class="get"><b>Te llevas</b><p>${fmt(w.te_llevas)}</p></div>` : ''}
        ${w.docente ? `<p class="sum"><b>Imparte:</b> ${esc(w.docente)}</p>` : ''}
        <div class="foot">${lista(w.publico).map((x) => `<span class="${pill}">${esc(x)}</span>`).join('')}${w.cuando ? `<span class="when">${esc(w.cuando)}</span>` : ''}</div>
      </article>`;
      }).join('\n      ')}
    </div>
    ${t.boton_texto ? `<p style="margin-top:28px"><a class="btn btn-primary" href="${esc(t.boton_enlace || '#')}"${/^https?:/.test(t.boton_enlace || '') ? ' target="_blank" rel="noopener"' : ''}>${esc(t.boton_texto)} ${ico('right')}</a></p>` : ''}
  </div>
</section>`;
}

function contratamos(h) {
  if (!visible(h)) return '';
  const pasos = (arr) => lista(arr).map((s) => `<div class="step"><span class="when">${esc(s.momento)}</span><h4>${esc(s.titulo)}</h4><p>${fmt(s.texto)}</p></div>`).join('\n        ');
  return `
<section class="sec band-deep hire" id="hoy-contratamos">
  <div class="wrap">
    <div class="hire-grid">
      <div class="rv" style="grid-column:1/-1">
        ${h.etiqueta ? `<span class="eyebrow">${esc(h.etiqueta)}</span>` : ''}
        <h2 class="hire-title" style="margin-top:18px">${esc(h.titulo_1)} <span>${esc(h.titulo_2)}</span></h2>
      </div>
      <div class="rv">
        ${lista(h.frases).length ? `<div class="hire-claims" style="margin-top:0">${lista(h.frases).map((f) => `<span>${esc(f)}</span>`).join('')}</div>` : ''}
        ${h.texto ? `<p class="lead" style="margin-top:24px">${fmt(h.texto)}</p>` : ''}
      </div>
      ${h.foto ? `<div class="hire-photo rv">
        <div class="photo"><img src="${ruta(h.foto)}" alt="${esc(h.foto_pie)}" loading="lazy" style="object-position:center 55%">${h.foto_pie ? `<span class="tag">${esc(h.foto_pie)}</span>` : ''}</div>
        <div class="badge-hoy" aria-hidden="true">HOY<br>CONTRA<br>TAMOS<small>DISTINTIVO</small></div>
      </div>` : ''}
    </div>
    <div class="hire-how rv">
      <div class="tabs" role="tablist" aria-label="Cómo funciona">
        <button role="tab" id="tab-emp" aria-selected="true" aria-controls="panel-emp">${esc(h.pestana_empresa)}</button>
        <button role="tab" id="tab-can" aria-selected="false" aria-controls="panel-can" tabindex="-1">${esc(h.pestana_candidato)}</button>
      </div>
      <div class="steps" role="tabpanel" id="panel-emp" aria-labelledby="tab-emp">
        ${pasos(h.pasos_empresa)}
      </div>
      <div class="steps" role="tabpanel" id="panel-can" aria-labelledby="tab-can" hidden>
        ${pasos(h.pasos_candidato)}
      </div>
      ${lista(h.medimos).length ? `<div class="hire-measure">
        <span class="eyebrow">${esc(h.medimos_titulo)}</span>
        <div class="measure-list">${lista(h.medimos).map((m) => `<span>${esc(m)}</span>`).join('')}</div>
      </div>` : ''}
      ${h.nota ? `<p class="hire-note">${fmt(h.nota)}</p>` : ''}
    </div>
  </div>
</section>`;
}

function espacios(e) {
  if (!visible(e)) return '';
  const EST = { morado: ' pu', naranja: ' or', foto: ' ph', blanco: '' };
  return `
<section class="sec" id="espacios">
  <div class="wrap">
    <div class="head rv">
      ${e.etiqueta ? `<span class="eyebrow">${esc(e.etiqueta)}</span>` : ''}
      ${titular(e.titulo, e.titulo_destacado)}
      ${e.entradilla ? `<p class="lead">${fmt(e.entradilla)}</p>` : ''}
    </div>
    <div class="bento">
      ${lista(e.items).map((s) => {
        const foto = s.estilo === 'foto' && s.imagen;
        const cls = 'sp' + (foto ? ' ph' : (EST[s.estilo] || '')) + (s.ancho === 'doble' ? ' w2' : '') + ' rv';
        const cuerpo = `<div class="ic">${ico(s.icono)}</div><h3>${esc(s.titulo)}</h3>${s.texto ? `<p>${fmt(s.texto)}</p>` : ''}${s.nota ? `<p class="mini">${fmt(s.nota)}</p>` : ''}`;
        return foto
          ? `<div class="${cls}"><img src="${ruta(s.imagen)}" alt="${esc(s.titulo)}" loading="lazy"${encuadre(s.encuadre)}><div class="in-ph">${cuerpo}</div></div>`
          : `<div class="${cls}">${cuerpo}</div>`;
      }).join('\n      ')}
    </div>
  </div>
</section>`;
}

function galeria(q) {
  if (!visible(q)) return '';
  const fotos = lista(q.fotos);
  return `
<section class="sec band-deep" id="galeria">
  <div class="wrap">
    <div class="head rv">
      ${q.etiqueta ? `<span class="eyebrow">${esc(q.etiqueta)}</span>` : ''}
      <h2 class="h2">${esc(q.titulo)}${q.titulo_destacado ? ' <em>' + esc(q.titulo_destacado) + '</em>.' : ''}${q.titulo_2 ? '<br>' + esc(q.titulo_2) : ''}</h2>
      ${q.entradilla ? `<p class="lead">${fmt(q.entradilla)}</p>` : ''}
    </div>
    <div class="gal rv"${q.video ? '' : ' style="grid-template-columns:minmax(0,1fr)"'}>
      ${q.video ? `<figure class="vid">
        <video id="video-2026" controls playsinline preload="metadata"${q.video_portada ? ` poster="${ruta(q.video_portada)}"` : ''}>
          <source src="${ruta(q.video)}" type="video/mp4">
        </video>
        ${q.video_pie ? `<figcaption>${esc(q.video_pie)}</figcaption>` : ''}
      </figure>` : ''}
      <div class="mos" id="mos">
        ${fotos.map((f, i) => `<button${i === 0 ? ' class="g1"' : i === 4 ? ' class="g6"' : ''} type="button" data-cap="${esc(f.pie)}"><img src="${ruta(f.imagen)}" alt="${esc(f.pie || 'Feria de Empleo de Tías 2026')}" loading="lazy"${encuadre(f.encuadre)}></button>`).join('\n        ')}
      </div>
    </div>
    <div class="gal-foot"><span>${fmt(q.pie_1)}</span><span>${fmt(q.pie_2)}</span></div>
  </div>
</section>`;
}

function cierre(c) {
  if (!visible(c)) return '';
  return `
<section class="closing" id="cierre">
  ${c.imagen ? `<img src="${ruta(c.imagen)}" alt="" loading="lazy">` : ''}
  <div class="wrap">
    ${c.etiqueta ? `<span class="eyebrow" style="color:var(--yellow)">${esc(c.etiqueta)}</span>` : ''}
    <h2>${esc(c.titulo_1)}${c.titulo_2 ? '<span>' + esc(c.titulo_2) + '</span>' : ''}</h2>
    ${c.texto ? `<p class="l">${fmt(c.texto)}</p>` : ''}
    <div class="hero-meta" style="justify-content:center">
      ${c.fecha ? `<span class="chip">${ico('cal')}${esc(c.fecha)}</span>` : ''}
      ${c.horario ? `<span class="chip">${ico('clock')}${esc(c.horario)}</span>` : ''}
      ${c.lugar ? `<span class="chip">${ico('pin')}${esc(c.lugar)}</span>` : ''}
    </div>
    ${c.boton_texto ? `<a class="btn btn-primary" href="${esc(c.boton_enlace || '#inicio')}" style="margin-top:6px">${esc(c.boton_texto)}</a>` : ''}
  </div>
</section>`;
}

function patrocinadores(p) {
  if (!visible(p)) return '';
  const logos = lista(p.logos);
  return `
<section class="sponsors" id="patrocinadores" aria-labelledby="sp-title">
  <div class="wrap">
    ${p.organiza_logo ? `<div class="sp-org">
      <span class="eyebrow">${esc(p.organiza_titulo || 'Organiza')}</span>
      <img src="${ruta(p.organiza_logo)}" alt="${esc(p.organiza_nombre)}">
    </div>` : ''}
    ${logos.length ? `<span class="eyebrow" id="sp-title">${esc(p.patrocinan_titulo || 'Patrocinan')}</span>
    <div class="sp-row">
      ${logos.map((l) => {
        const img = `<img src="${ruta(l.imagen)}"${l.ancho ? ' class="wide"' : ''} alt="${esc(l.nombre)}">`;
        return l.enlace ? `<a href="${esc(l.enlace)}" target="_blank" rel="noopener">${img}</a>` : img;
      }).join('\n      ')}
    </div>` : ''}
  </div>
</section>`;
}

/* ---------- Página ---------- */
const rutasJS = {};
lista(S.programa.rutas).forEach((r) => { rutasJS[r.perfil] = { t: r.titulo, l: lista(r.pasos).map((x) => fmt(x)) }; });

const html = `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>${esc(g.titulo_seo)}</title>
<meta name="description" content="${esc(g.descripcion_seo)}">
<meta property="og:type" content="website">
<meta property="og:locale" content="es_ES">
<meta property="og:title" content="${esc(g.titulo_seo)}">
<meta property="og:description" content="${esc(g.descripcion_seo)}">
${g.imagen_redes ? `<meta property="og:image" content="https://www.feriaempleotias.com${ruta(g.imagen_redes)}">\n<meta name="twitter:card" content="summary_large_image">` : ''}
<link rel="icon" href="${ruta(S.patrocinadores.organiza_logo || '/img/logo-ayuntamiento-tias.png')}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,500;0,600;0,700;0,800;0,900;1,800&family=Open+Sans:ital,wght@0,400;0,600;0,700;1,400&display=swap">
<link rel="stylesheet" href="/estilos.css">
</head>
<body>
<svg width="0" height="0" style="position:absolute" aria-hidden="true">
  <symbol id="i-cal" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></symbol>
  <symbol id="i-clock" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></symbol>
  <symbol id="i-pin" viewBox="0 0 24 24"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></symbol>
  <symbol id="i-down" viewBox="0 0 24 24"><path d="M12 5v14M19 12l-7 7-7-7"/></symbol>
  <symbol id="i-right" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></symbol>
  <symbol id="i-left" viewBox="0 0 24 24"><path d="M19 12H5M12 19l-7-7 7-7"/></symbol>
  <symbol id="i-x" viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></symbol>
  <symbol id="i-menu" viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16"/></symbol>
  <symbol id="i-cap" viewBox="0 0 24 24"><path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"/><path d="M22 10v6"/><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"/></symbol>
  <symbol id="i-star" viewBox="0 0 24 24"><path d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z"/></symbol>
  <symbol id="i-building" viewBox="0 0 24 24"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4M10 10h4M10 14h4M10 18h4"/></symbol>
  <symbol id="i-tool" viewBox="0 0 24 24"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></symbol>
  <symbol id="i-spark" viewBox="0 0 24 24"><path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z"/><path d="M5 3v4M3 5h4M19 17v4M17 19h4"/></symbol>
  <symbol id="i-bank" viewBox="0 0 24 24"><path d="M3 22h18"/><path d="M6 18v-7M10 18v-7M14 18v-7M18 18v-7"/><path d="M12 2l8 5H4z"/></symbol>
  <symbol id="i-store" viewBox="0 0 24 24"><path d="M3 9l1.5-5h15L21 9"/><path d="M4 9v11h16V9"/><path d="M9 20v-6h6v6"/></symbol>
  <symbol id="i-chat" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></symbol>
  <symbol id="i-coffee" viewBox="0 0 24 24"><path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><path d="M6 2v2M10 2v2M14 2v2"/></symbol>
  <symbol id="i-link" viewBox="0 0 24 24"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></symbol>
  <symbol id="i-doc" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h5"/></symbol>
  <symbol id="i-map" viewBox="0 0 24 24"><path d="M3 6l6-3 6 3 6-3v15l-6 3-6-3-6 3z"/><path d="M9 3v15M15 6v15"/></symbol>
  <symbol id="i-hourglass" viewBox="0 0 24 24"><path d="M6 2h12M6 22h12M7 2v4a5 5 0 0 0 10 0V2M7 22v-4a5 5 0 0 1 10 0v4"/></symbol>
</svg>

<header class="nav" id="nav">
  <div class="wrap">
    <a class="brand" href="#inicio"><b>${esc(g.marca_1)} <span>${esc(g.marca_2)}</span></b><small>${esc(g.marca_sub)}</small></a>
    <nav class="links" aria-label="Secciones">
      ${menu.map((m) => `<a href="#${m.id}">${esc(m.corto)}</a>`).join('\n      ')}
    </nav>
    ${g.boton_menu_texto ? `<a class="nav-cta" href="${esc(g.boton_menu_enlace || '#hoy-contratamos')}">${esc(g.boton_menu_texto)}</a>` : ''}
    <button class="menu-btn" id="menu-btn" aria-expanded="false" aria-controls="sheet"><svg class="ico" style="width:16px;height:16px"><use href="#i-menu"/></svg>Secciones</button>
  </div>
  <div class="progress" id="progress"></div>
</header>
<nav class="sheet" id="sheet" hidden aria-label="Secciones (móvil)">
  ${menu.map((m) => `<a href="#${m.id}">${esc(m.largo)}</a>`).join('\n  ')}
</nav>

<main>
${portada(S.portada)}
${franja()}
${crece(S.crece)}
${concepto(S.concepto)}
${programa(S.programa)}
${ponencias(S.ponencias)}
${talleres(S.talleres)}
${contratamos(S.contratamos)}
${espacios(S.espacios)}
${galeria(S.galeria)}
${cierre(S.cierre)}
${patrocinadores(S.patrocinadores)}
</main>

<footer>
  <div class="wrap">
    <span>${fmt(g.pie_1)}</span>
    <span>${fmt(g.pie_2)}</span>
    ${lista(g.enlaces_legales).length ? `<span class="legal">${lista(g.enlaces_legales).map((l) => `<a href="${esc(l.url)}">${esc(l.texto)}</a>`).join('')}</span>` : ''}
  </div>
</footer>

<div class="lb" id="lb" hidden role="dialog" aria-modal="true" aria-label="Foto ampliada">
  <button class="lb-btn lb-close" id="lb-close" aria-label="Cerrar"><svg class="ico"><use href="#i-x"/></svg></button>
  <img id="lb-img" src="" alt="">
  <div class="lb-bar">
    <button class="lb-btn" id="lb-prev" aria-label="Anterior"><svg class="ico"><use href="#i-left"/></svg></button>
    <span id="lb-cap"></span>
    <button class="lb-btn" id="lb-next" aria-label="Siguiente"><svg class="ico"><use href="#i-right"/></svg></button>
  </div>
</div>

<script>window.FERIA_RUTAS=${JSON.stringify(rutasJS).replace(/</g, '\\u003c')};</script>
<script src="/app.js"></script>
</body>
</html>
`;

/* ---------- Escribir ---------- */
fs.rmSync(SALIDA, { recursive: true, force: true });
fs.mkdirSync(SALIDA, { recursive: true });
fs.writeFileSync(path.join(SALIDA, 'index.html'), html);
fs.copyFileSync(path.join(RAIZ, 'plantilla', 'estilos.css'), path.join(SALIDA, 'estilos.css'));
fs.copyFileSync(path.join(RAIZ, 'plantilla', 'app.js'), path.join(SALIDA, 'app.js'));
fs.cpSync(path.join(RAIZ, 'img'), path.join(SALIDA, 'img'), { recursive: true });
console.log('Web generada en /dist');
