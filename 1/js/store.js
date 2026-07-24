/* ==================================================================
   MAGASIN — état, persistance locale, multi-dossiers, annulation
   ================================================================== */
import { OUTILS, PETALES } from './content.js';

const CLE = 'atelier-plaidoyer/v2';
const CLE_V1 = 'atelier-plaidoyer-v1';
const CLE_THEME = 'atelier-plaidoyer/theme';

/* Stockage tolérant : bascule en mémoire si localStorage est bloqué
   (mode privé, iframe sandboxée, file:// sur certains navigateurs). */
const memoire = new Map();
export const stockageOK = (() => {
  try { localStorage.setItem('__t', '1'); localStorage.removeItem('__t'); return true; }
  catch (e) { return false; }
})();
const disque = {
  lire: k => { try { return localStorage.getItem(k); } catch (e) { return memoire.get(k) ?? null; } },
  ecrire: (k, v) => { try { localStorage.setItem(k, v); } catch (e) { memoire.set(k, v); } }
};

export const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

/* ---------- structure d'un dossier vierge ---------- */
export function dossierVierge(nom = '') {
  return {
    id: uid(), nom, cause: '', collectif: '', echelle: '', cree: Date.now(), maj: Date.now(),
    d: {
      o1: { pourquoi: '', valeurs: '', changements: '', actions: '' },
      o2: { reponses: Array(7).fill(null), equipe: [] },
      o3: { petales: PETALES.map(p => ({ cat: p, moi: '', cible: '' })), notes: '' },
      o4: { acteurs: [] },
      o5: { valeurs: '', hypotheses: '', vision: '', missions: '', court: [], moyen: [], long: [], ordres: [] },
      o6: { forces: [], faiblesses: [], opportunites: [], menaces: [] },
      o7: { P: [], E: [], S: [], T: [], V: [], L: [] },
      o8: { probleme: '', causes: [], consequences: [], objectif: '', moyens: [], finalites: [] },
      o9: { probleme: '', pourquoi: ['', '', '', '', ''] },
      o10: { avec: [], contre: [], sans: [], note: '' },
      o11: { objectifs: [] },
      o12: { cibles: [], allies: [] },
      o13: { messages: [] },
      o14: { avant: [], pendant: [], apres: [], comptes: [] },
      o15: { journal: [], indicateurs: [], evaluation: {}, engagements: {} },
      o16: { echeances: [], pret: {} },
      o17: { axes: [], poids: {} },
      o18: { x: 50, y: 50, retenues: [], theorie: '', repli: '' },
      o19: { fiches: [] },
      o20: { membres: [], creation: [], vie: [] },
      o21: { medias: [], pitch: '', messages2: ['', ''], interview: [] },
      o22: { actions: [], petition: { titre: '', decideur: '', probleme: '', solution: '', urgence: '' }, criteres: [] }
    }
  };
}

function etatVierge() {
  const d = dossierVierge('');
  return { version: 2, actif: d.id, dossiers: [d] };
}

/* ---------- fusion tolérante (migration douce) ---------- */
function fusion(base, apport) {
  if (apport == null || typeof apport !== 'object') return base;
  for (const k of Object.keys(base)) {
    if (!(k in apport)) continue;
    const b = base[k], a = apport[k];
    if (Array.isArray(b)) base[k] = Array.isArray(a) ? a : b;
    else if (b && typeof b === 'object') base[k] = fusion(b, a);
    else if (a !== undefined) base[k] = a;
  }
  /* on garde les clés inconnues (évaluation libre, etc.) */
  for (const k of Object.keys(apport)) if (!(k in base)) base[k] = apport[k];
  return base;
}

export function normaliserDossier(brut) {
  const v = dossierVierge();
  const out = fusion(v, brut || {});
  out.id = brut?.id || v.id;
  if (!out.d.o3.petales.length) out.d.o3.petales = PETALES.map(p => ({ cat: p, moi: '', cible: '' }));
  return out;
}

/* ---------- état global ---------- */
export let etat = etatVierge();
const abonnes = new Set();
export const abonner = f => { abonnes.add(f); return () => abonnes.delete(f); };
const prevenir = quoi => abonnes.forEach(f => f(quoi));

export function charger() {
  const brut = disque.lire(CLE);
  if (brut) {
    try {
      const e = JSON.parse(brut);
      if (e && Array.isArray(e.dossiers) && e.dossiers.length) {
        etat = { version: 2, actif: e.actif, dossiers: e.dossiers.map(normaliserDossier) };
        if (!etat.dossiers.some(d => d.id === etat.actif)) etat.actif = etat.dossiers[0].id;
        return;
      }
    } catch (e) { console.warn('Données v2 illisibles.'); }
  }
  /* reprise d'un dossier de la version 1 */
  const v1 = disque.lire(CLE_V1);
  if (v1) {
    try {
      const a = JSON.parse(v1);
      const d = normaliserDossier({ nom: a?.meta?.titre || 'Dossier repris de la v1', cause: a?.meta?.cause || '', collectif: a?.meta?.collectif || '', d: a });
      etat = { version: 2, actif: d.id, dossiers: [d] };
      sauver(true);
      return;
    } catch (e) { /* on ignore */ }
  }
  etat = etatVierge();
}

export const dossier = () => etat.dossiers.find(x => x.id === etat.actif) || etat.dossiers[0];
export const data = () => dossier().d;

let minuteur = null;
export function sauver(immediat = false) {
  const d = dossier(); if (d) d.maj = Date.now();
  clearTimeout(minuteur);
  const faire = () => { disque.ecrire(CLE, JSON.stringify(etat)); prevenir('sauve'); };
  if (immediat) faire(); else minuteur = setTimeout(faire, 350);
  prevenir('modif');
}

/* ---------- accès par chemin : "o4.acteurs.2.nom" ---------- */
export function lire(chemin) {
  return chemin.split('.').reduce((o, k) => (o == null ? undefined : o[k]), data());
}
export function ecrire(chemin, val) {
  const bouts = chemin.split('.');
  const dernier = bouts.pop();
  const cible = bouts.reduce((o, k) => (o[k] ??= {}), data());
  cible[dernier] = val;
}

/* ---------- gestion des dossiers ---------- */
export function creerDossier(nom) {
  const d = dossierVierge(nom || 'Nouveau plaidoyer');
  etat.dossiers.push(d); etat.actif = d.id; sauver(true); prevenir('dossier');
  return d;
}
export function basculerDossier(id) {
  if (etat.dossiers.some(d => d.id === id)) { etat.actif = id; sauver(true); prevenir('dossier'); }
}
export function supprimerDossier(id) {
  etat.dossiers = etat.dossiers.filter(d => d.id !== id);
  if (!etat.dossiers.length) etat.dossiers.push(dossierVierge(''));
  if (!etat.dossiers.some(d => d.id === etat.actif)) etat.actif = etat.dossiers[0].id;
  sauver(true); prevenir('dossier');
}
export function dupliquerDossier(id) {
  const src = etat.dossiers.find(d => d.id === id); if (!src) return;
  const copie = normaliserDossier(JSON.parse(JSON.stringify(src)));
  copie.id = uid(); copie.nom = (src.nom || 'Sans titre') + ' (copie)'; copie.cree = Date.now();
  etat.dossiers.push(copie); etat.actif = copie.id; sauver(true); prevenir('dossier');
}

/* ---------- annulation d'une suppression ---------- */
let corbeille = null;
export function retirer(chemin, index) {
  const tableau = lire(chemin);
  if (!Array.isArray(tableau)) return null;
  const [element] = tableau.splice(index, 1);
  corbeille = { chemin, index, element, dossier: etat.actif };
  sauver(true);
  return element;
}
export function annulerRetrait() {
  if (!corbeille) return false;
  const { chemin, index, element, dossier: idD } = corbeille;
  if (etat.actif !== idD) basculerDossier(idD);
  const tableau = lire(chemin);
  if (Array.isArray(tableau)) tableau.splice(index, 0, element);
  corbeille = null; sauver(true);
  return true;
}
export function deplacer(chemin, de, vers) {
  const t = lire(chemin);
  if (!Array.isArray(t) || vers < 0 || vers >= t.length) return;
  const [el] = t.splice(de, 1); t.splice(vers, 0, el); sauver(true);
}

/* ---------- thème ---------- */
export function lireTheme() { return disque.lire(CLE_THEME) || 'auto'; }
export function ecrireTheme(t) { disque.ecrire(CLE_THEME, t); }

/* ==================================================================
   AVANCEMENT — une fraction 0..1 par outil
   ================================================================== */
const part = (fait, total) => total ? Math.max(0, Math.min(1, fait / total)) : 0;
const plein = v => (String(v ?? '').trim() ? 1 : 0);
const remplis = (...vs) => vs.filter(v => String(v ?? '').trim()).length;

export const MESURES = {
  1: d => part(remplis(d.o1.pourquoi, d.o1.valeurs, d.o1.changements, d.o1.actions), 4),
  2: d => part(d.o2.reponses.filter(r => r).length + Math.min(3, d.o2.equipe.length), 10),
  3: d => part(d.o3.petales.filter(p => p.moi?.trim()).length + (d.o3.notes?.trim() ? 2 : 0), 8),
  4: d => part(d.o4.acteurs.filter(a => a.nom?.trim()).length, 4),
  5: d => part(remplis(d.o5.valeurs, d.o5.hypotheses, d.o5.vision, d.o5.missions) +
              Math.min(2, d.o5.court.length + d.o5.moyen.length + d.o5.long.length), 6),
  6: d => part(['forces', 'faiblesses', 'opportunites', 'menaces'].reduce((n, k) => n + Math.min(1, d.o6[k].length), 0), 4),
  7: d => part(Object.values(d.o7).reduce((n, a) => n + Math.min(1, a.length), 0), 6),
  8: d => part(plein(d.o8.probleme) + Math.min(2, d.o8.causes.length) + Math.min(2, d.o8.consequences.length) + plein(d.o8.objectif), 6),
  9: d => part(plein(d.o9.probleme) + d.o9.pourquoi.filter(x => x?.trim()).length, 6),
  10: d => part(Math.min(4, d.o10.avec.length + d.o10.contre.length + d.o10.sans.length) + plein(d.o10.note), 5),
  11: d => part(d.o11.objectifs.reduce((n, o) => n + (remplis(o.temps, o.decision, o.action, o.moyen) >= 3 ? 1 : 0), 0), 2),
  12: d => part(Math.min(3, d.o12.cibles.length) + Math.min(2, d.o12.allies.length), 5),
  13: d => part(d.o13.messages.reduce((n, m) => n + (remplis(m.accroche, m.probleme, m.importance, m.cible, m.action) >= 4 ? 1 : 0), 0), 2),
  14: d => part(d.o14.avant.length + d.o14.pendant.length + d.o14.apres.length, 14),
  15: d => part(Math.min(3, d.o15.journal.length) + Math.min(2, d.o15.indicateurs.length) +
              Math.min(2, Object.values(d.o15.evaluation).filter(v => String(v).trim()).length), 7),
  16: d => part(Math.min(4, d.o16.echeances.length) + Object.values(d.o16.pret).filter(Boolean).length, 7),
  17: d => part(Math.min(4, d.o17.axes.length) + (d.o17.axes.some(a => Object.keys(a.notes || {}).length >= 4) ? 2 : 0), 6),
  18: d => part(Math.min(3, d.o18.retenues.length) + plein(d.o18.theorie) + plein(d.o18.repli), 5),
  19: d => part(d.o19.fiches.reduce((n, f) => n + Math.min(1, remplis(f.nom, f.action, f.detonateur, f.acces) / 3), 0), 2),
  20: d => part(Math.min(3, d.o20.membres.length) + Math.min(2, d.o20.creation.length) + Math.min(2, d.o20.vie.length), 7),
  21: d => part(Math.min(2, d.o21.medias.length) + plein(d.o21.pitch) + remplis(...d.o21.messages2) + Math.min(2, d.o21.interview.length), 7),
  22: d => part(Math.min(2, d.o22.actions.length) + remplis(d.o22.petition.titre, d.o22.petition.decideur, d.o22.petition.solution) + Math.min(2, d.o22.criteres.length), 7)
};

export function avancement(id, d = data()) {
  try { return MESURES[id] ? MESURES[id](d) : 0; } catch (e) { return 0; }
}
export const estFait = (id, d = data()) => avancement(id, d) >= 0.999;
export const estCommence = (id, d = data()) => avancement(id, d) > 0;

export function avancementGlobal(d = data()) {
  const total = OUTILS.reduce((s, o) => s + avancement(o.id, d), 0);
  return { faits: OUTILS.filter(o => estFait(o.id, d)).length, total: OUTILS.length, fraction: total / OUTILS.length };
}

export function avancementPartie(cle, d = data()) {
  const l = OUTILS.filter(o => o.partie === cle);
  return l.reduce((s, o) => s + avancement(o.id, d), 0) / (l.length || 1);
}

export function avancementPhase(cle, d = data()) {
  const l = OUTILS.filter(o => o.phase === cle);
  if (!l.length) return 0;
  return l.reduce((s, o) => s + avancement(o.id, d), 0) / l.length;
}

/* Prochain outil conseillé : le premier non terminé dans l'ordre du guide */
export function prochainOutil(ordre) {
  for (const id of ordre) if (!estFait(id)) return id;
  return null;
}
