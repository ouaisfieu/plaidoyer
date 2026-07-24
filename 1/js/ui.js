/* ==================================================================
   COMPOSANTS D'INTERFACE — fabriques de balisage et petits utilitaires
   ================================================================== */
import { lire, dossier } from './store.js';

export const esc = s => String(s ?? '').replace(/[&<>"']/g, c =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

export const $ = (s, r = document) => r.querySelector(s);
export const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
export const plein = v => String(v ?? '').trim().length > 0;

/* ---------- icônes (trait 1.6, 24×24) ---------- */
const I = {
  accueil: '<path d="M3 10.5 12 3l9 7.5V21H3z"/>',
  outils: '<path d="M4 6h16M4 12h16M4 18h10"/>',
  dossier: '<path d="M4 5h6l2 2h8v12H4z"/>',
  recherche: '<circle cx="11" cy="11" r="6.5"/><path d="m20 20-4.2-4.2"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  fleche: '<path d="M5 12h14m-6-6 6 6-6 6"/>',
  chevron: '<path d="m6 9 6 6 6-6"/>',
  croix: '<path d="M6 6l12 12M18 6 6 18"/>',
  haut: '<path d="m6 14 6-6 6 6"/>',
  bas: '<path d="m6 10 6 6 6-6"/>',
  soleil: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5M17.5 17.5 19 19M19 5l-1.5 1.5M6.5 17.5 5 19"/>',
  lune: '<path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a6.8 6.8 0 0 0 10.5 10.5z"/>',
  copie: '<rect x="9" y="9" width="11" height="11" rx="1.5"/><path d="M5 15V5h10"/>',
  telecharger: '<path d="M12 4v11m0 0-4-4m4 4 4-4M4 19h16"/>',
  imprimer: '<path d="M7 9V4h10v5M7 18H5v-6h14v6h-2M8 15h8v5H8z"/>',
  reglages: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3m0 14v3M2 12h3m14 0h3M4.5 4.5 6.6 6.6m10.8 10.8 2.1 2.1m0-15L17.4 6.6M6.6 17.4l-2.1 2.1"/>',
  check: '<path d="m5 13 4.5 4.5L19 7"/>'
};
export const ico = (nom, taille = 18) =>
  `<svg viewBox="0 0 24 24" width="${taille}" height="${taille}" fill="none" stroke="currentColor"
    stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${I[nom] || ''}</svg>`;

/* ---------- champs liés à l'état ---------- */
const lireChemin = c => c.startsWith('__meta.') ? dossier()[c.slice(7)] : lire(c);

export function champ(chemin, label, opts = {}) {
  const { aide = '', ph = '', lignes = 3, type = 'text', graph = '' } = opts;
  const v = esc(lireChemin(chemin));
  const tete = `<span class="intitule">${esc(label)}${aide ? `<span class="aide">${esc(aide)}</span>` : ''}</span>`;
  const g = graph ? ` data-graph="${graph}"` : '';
  if (lignes === 0) {
    return `<label class="champ">${tete}<input type="${type}" data-lien="${chemin}"${g} value="${v}" placeholder="${esc(ph)}"></label>`;
  }
  return `<label class="champ">${tete}<textarea data-lien="${chemin}"${g} rows="${lignes}" placeholder="${esc(ph)}">${v}</textarea></label>`;
}

export function selecteurChamp(chemin, label, options, opts = {}) {
  const v = lire(chemin);
  return `<label class="champ"><span class="intitule">${esc(label)}</span>
    <select data-lien="${chemin}"${opts.graph ? ` data-graph="${opts.graph}"` : ''}${opts.rendu ? ' data-rendu="1"' : ''}>
      ${opts.vide ? `<option value="">${esc(opts.vide)}</option>` : ''}
      ${options.map(o => {
        const val = typeof o === 'string' ? o : o.cle;
        const nom = typeof o === 'string' ? o : o.nom;
        return `<option value="${esc(val)}"${v === val ? ' selected' : ''}>${esc(nom)}</option>`;
      }).join('')}
    </select></label>`;
}

/* ---------- liste éditable, avec réordonnancement ---------- */
export function liste(chemin, opts = {}) {
  const { label = '', ph = 'Ajouter…', vide = 'Rien pour l’instant.', ordonnable = true } = opts;
  const items = lire(chemin) || [];
  return `<div class="liste-bloc">
    ${label ? `<span class="surtitre" style="display:block;margin-bottom:7px">${esc(label)}</span>` : ''}
    ${items.length ? `<ul class="liste">${items.map((t, i) => `
      <li><span class="texte">${esc(t)}</span>
        <span class="outils-ligne">
          ${ordonnable && i > 0 ? `<button class="bouton discret petit" data-agir="monter" data-chemin="${chemin}" data-i="${i}" aria-label="Monter">${ico('haut', 13)}</button>` : ''}
          ${ordonnable && i < items.length - 1 ? `<button class="bouton discret petit" data-agir="descendre" data-chemin="${chemin}" data-i="${i}" aria-label="Descendre">${ico('bas', 13)}</button>` : ''}
          <button class="bouton discret petit" data-agir="retirer" data-chemin="${chemin}" data-i="${i}" aria-label="Supprimer">${ico('croix', 13)}</button>
        </span></li>`).join('')}</ul>`
      : `<div class="vide">${esc(vide)}</div>`}
    <div class="ajout">
      <input type="text" data-ajout="${chemin}" placeholder="${esc(ph)}" aria-label="${esc(ph)}">
      <button class="bouton" data-agir="ajouter" data-chemin="${chemin}">${ico('plus', 14)}</button>
    </div></div>`;
}

/* ---------- cases à cocher stockées en tableau d'index ---------- */
export function coches(chemin, items, opts = {}) {
  const cochees = lire(chemin) || [];
  const cle = chemin.replace(/\./g, '-');
  return `<ul class="liste" style="border:0">${items.map((t, i) => {
    const ok = cochees.includes(i);
    const lib = typeof t === 'string' ? t : `<b>${esc(t.nom)}</b> — ${esc(t.txt)}`;
    return `<li style="border:0;padding:2px 0"><label class="coche ${ok ? 'faite' : ''}">
      <input type="checkbox" data-agir="cocher" data-chemin="${chemin}" data-i="${i}" ${ok ? 'checked' : ''}>
      <span>${typeof t === 'string' ? esc(t) : lib}</span></label></li>`;
  }).join('')}</ul>${opts.compteur !== false
    ? `<p class="note">${cochees.length} / ${items.length} coché${cochees.length > 1 ? 's' : ''}</p>` : ''}`;
}

/* ---------- boutons ---------- */
export const bouton = (label, agir, opts = {}) =>
  `<button class="bouton ${opts.classe || ''}" data-agir="${agir}"${
    Object.entries(opts.data || {}).map(([k, v]) => ` data-${k}="${esc(v)}"`).join('')
  }${opts.titre ? ` title="${esc(opts.titre)}"` : ''}>${opts.ico ? ico(opts.ico, 14) : ''}${esc(label)}</button>`;

export const videMsg = (titre, txt) => `<div class="vide"><b>${esc(titre)}</b>${esc(txt)}</div>`;

/* ---------- notifications ---------- */
let elToast, minuteurToast;
export function toast(texte, action) {
  if (!elToast) {
    elToast = document.createElement('div');
    elToast.className = 'toast';
    elToast.setAttribute('role', 'status');
    document.body.appendChild(elToast);
  }
  elToast.innerHTML = `<span>${esc(texte)}</span>` +
    (action ? `<button type="button" data-toast-action>${esc(action.label)}</button>` : '');
  if (action) {
    elToast.querySelector('[data-toast-action]').onclick = () => { action.faire(); cacherToast(); };
  }
  elToast.classList.add('on');
  clearTimeout(minuteurToast);
  minuteurToast = setTimeout(cacherToast, action ? 6000 : 2600);
}
function cacherToast() { elToast?.classList.remove('on'); }

/* ---------- boîte de dialogue ---------- */
export function dialogue({ titre, corps, valider = 'Valider', annuler = 'Annuler', surValidation }) {
  const d = document.createElement('dialog');
  d.className = 'tiroir';
  d.innerHTML = `<form method="dialog">
    <h3>${esc(titre)}</h3>
    <div class="corps-dialogue">${corps}</div>
    <div class="rangee fin" style="justify-content:flex-end">
      <button class="bouton" value="annuler" type="submit">${esc(annuler)}</button>
      <button class="bouton fort" value="ok" type="submit">${esc(valider)}</button>
    </div></form>`;
  document.body.appendChild(d);
  d.addEventListener('close', () => {
    if (d.returnValue === 'ok' && surValidation) surValidation(d);
    d.remove();
  });
  d.showModal();
  const premier = d.querySelector('input,textarea,select');
  if (premier) { premier.focus(); premier.select?.(); }
  return d;
}

/* ---------- divers ---------- */
export const dateCourte = ts => new Date(ts).toLocaleDateString('fr-BE', { day: '2-digit', month: 'short', year: 'numeric' });
export const surligner = (texte, requete) => {
  if (!requete) return esc(texte);
  const i = texte.toLowerCase().indexOf(requete.toLowerCase());
  if (i < 0) return esc(texte);
  return esc(texte.slice(0, i)) + '<mark>' + esc(texte.slice(i, i + requete.length)) + '</mark>' + esc(texte.slice(i + requete.length));
};
