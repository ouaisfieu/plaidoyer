/* ==================================================================
   APPLICATION — routage, interactions, palette, import/export
   ================================================================== */
import { PARTIES, NIVEAUX_ENGAGEMENT, PROFILS, PESTEL_AXES } from './content.js';
import {
  charger, sauver, etat, dossier, data, lire, ecrire, uid,
  creerDossier, basculerDossier, supprimerDossier, dupliquerDossier,
  retirer, annulerRetrait, deplacer, normaliserDossier, dossierVierge,
  lireTheme, ecrireTheme, avancement, abonner
} from './store.js';
import { $, $$, esc, plein, toast, dialogue, ico, surligner } from './ui.js';
import { ATELIERS, MODELES, fleurSVG, matriceHTML, planHTML, renduMessage, apercuPetition } from './ateliers.js';
import {
  vueAccueil, vueOutil, vueDossier, vueReglages, flancHTML, barreMobileHTML,
  outilParId, outilsOrdonnes
} from './views.js';

/* ---------- état de l'interface ---------- */
const vue = { volet: {}, outilCourant: null };

/* ================================================================ */
/*  THÈME                                                           */
/* ================================================================ */
function appliquerTheme(t) {
  const sombre = t === 'sombre' || (t === 'auto' && matchMedia('(prefers-color-scheme: dark)').matches);
  document.documentElement.dataset.theme = sombre ? 'sombre' : 'clair';
  const meta = $('meta[name="theme-color"]');
  if (meta) meta.content = sombre ? '#101015' : '#E8E5DB';
}
let theme = lireTheme();
appliquerTheme(theme);
matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => { if (theme === 'auto') appliquerTheme('auto'); });

/* ================================================================ */
/*  ROUTAGE                                                         */
/* ================================================================ */
function route() {
  const h = location.hash || '#/';
  const m = h.match(/^#\/outil\/(\d+)/);
  if (m) return { nom: 'outil', id: Number(m[1]) };
  if (h.startsWith('#/dossier')) return { nom: 'dossier' };
  if (h.startsWith('#/reglages')) return { nom: 'reglages' };
  return { nom: 'accueil' };
}

function voletPour(id) {
  if (vue.volet[id]) return vue.volet[id];
  /* Première visite : le guide. Déjà entamé : directement l'atelier. */
  return avancement(id) > 0 ? 'atelier' : 'guide';
}

function rendre() {
  const r = route();
  const principal = $('#principal');
  if (!principal) return;

  if (r.nom === 'outil') {
    const o = outilParId(r.id);
    if (!o) { location.hash = '#/'; return; }
    vue.outilCourant = r.id;
    principal.innerHTML = vueOutil(r.id, voletPour(r.id));
  } else {
    vue.outilCourant = null;
    principal.innerHTML = r.nom === 'dossier' ? vueDossier()
      : r.nom === 'reglages' ? vueReglages(theme)
      : vueAccueil();
  }
  majFlanc();
  filAriane(r);
  appliquerVoletMobile();
  document.body.classList.remove('tiroir-ouvert');
  window.scrollTo(0, 0);
}

function filAriane(r) {
  const el = $('.fil-ariane');
  if (!el) return;
  const d = dossier();
  const bouts = [`<a href="#/">${esc(d.nom) || 'Sans titre'}</a>`];
  if (r.nom === 'outil') {
    const o = outilParId(r.id);
    bouts.push(esc(PARTIES[o.partie].titre), `${String(o.id).padStart(2, '0')} · ${esc(o.titre)}`);
  } else if (r.nom === 'dossier') bouts.push('Dossier complet');
  else if (r.nom === 'reglages') bouts.push('Réglages');
  el.innerHTML = bouts.join(' <span aria-hidden="true">/</span> ');
}

function majFlanc() {
  const f = $('.flanc');
  if (!f) return;
  if (f.contains(document.activeElement)) return;
  f.innerHTML = flancHTML();
  marquerCourant();
}
function marquerCourant() {
  $$('.lien-outil, .barre-mobile a').forEach(a => {
    const h = a.getAttribute('href');
    if (h === location.hash || (location.hash === '' && h === '#/')) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
}

/* Rendu partiel : on ne refait que l'atelier, en gardant le focus. */
function rafraichirAtelier() {
  const id = vue.outilCourant;
  if (!id) { rendre(); return; }
  const zone = $('#volet-atelier');
  const o = outilParId(id);
  if (!zone || !o) { rendre(); return; }

  const actif = document.activeElement;
  const lien = actif?.dataset?.lien || null;
  let curseur = null;
  try { curseur = actif?.selectionStart; } catch (e) { }

  zone.innerHTML = ATELIERS[o.atelier] ? ATELIERS[o.atelier]() : '';
  if (lien) {
    const n = zone.querySelector(`[data-lien="${CSS.escape ? CSS.escape(lien).replace(/\\\./g, '.') : lien}"]`)
      || zone.querySelector(`[data-lien="${lien}"]`);
    if (n) { n.focus({ preventScroll: true }); try { if (curseur != null) n.setSelectionRange(curseur, curseur); } catch (e) { } }
  }
  appliquerVoletMobile();
  majFlanc();
}

/* Mise à jour d'un seul visuel, sans toucher aux champs. */
function majGraphique(nom) {
  const d = data();
  if (nom === 'fleur') { const c = $('#graph-fleur'); if (c) c.innerHTML = fleurSVG(d.o3.petales); }
  else if (nom === 'matrice') { const c = $('#graph-matrice'); if (c) c.innerHTML = matriceHTML(d.o4.acteurs); }
  else if (nom === 'plan') { const c = $('#graph-plan'); if (c) c.innerHTML = planHTML(d.o18); }
  else if (nom === 'petition') { const c = $('#graph-petition'); if (c) c.innerHTML = apercuPetition(d.o22.petition); }
  else if (nom === 'message') d.o13.messages.forEach((m, i) => {
    const c = $(`#rendu-msg-${i}`); if (c) c.innerHTML = renduMessage(m);
  });
  else if (nom === 'smart' || nom === 'cinq') { /* recalcul léger différé */ }
}

function appliquerVoletMobile() {
  const petit = matchMedia('(max-width:1180px)').matches;
  $$('.volet').forEach(v => {
    if (!petit) { v.hidden = false; return; }
    v.hidden = v.dataset.mobileCache === '1';
  });
}
addEventListener('resize', appliquerVoletMobile);

/* ================================================================ */
/*  SAISIE                                                          */
/* ================================================================ */
function ecrireLien(chemin, valeur) {
  if (chemin.startsWith('__meta.')) {
    dossier()[chemin.slice(7)] = valeur;
  } else ecrire(chemin, valeur);
}

document.addEventListener('input', e => {
  const t = e.target;
  if (!t.dataset?.lien) return;
  let v = t.value;
  if (t.type === 'number') v = v === '' ? '' : Number(v);
  ecrireLien(t.dataset.lien, v);
  sauver();
  if (t.dataset.graph) majGraphique(t.dataset.graph);
  if (t.dataset.lien.startsWith('__meta.')) { majFlanc(); filAriane(route()); }
});

document.addEventListener('change', e => {
  const t = e.target;
  if (t.dataset?.lien && (t.tagName === 'SELECT' || t.type === 'radio' || t.type === 'date')) {
    ecrireLien(t.dataset.lien, t.value);
    sauver(true);
    if (t.dataset.graph) majGraphique(t.dataset.graph);
    if (t.dataset.rendu === '1') rafraichirAtelier();
    return;
  }
  if (t.id === 'fichier-import') lireFichierImport(t.files?.[0]);
});

/* Entrée dans un champ d'ajout */
document.addEventListener('keydown', e => {
  const t = e.target;
  if (e.key !== 'Enter' || !t.dataset) return;
  if (t.dataset.ajout) { e.preventDefault(); ajouterItem(t.dataset.ajout, t.value); }
  else if (t.dataset.etape !== undefined) { e.preventDefault(); ajouterEtape(Number(t.dataset.etape), t.value); }
});

function ajouterItem(chemin, valeur) {
  const v = String(valeur || '').trim();
  if (!v) return;
  const l = lire(chemin);
  if (Array.isArray(l)) { l.push(v); sauver(true); rafraichirAtelier(); }
}
function ajouterEtape(i, valeur) {
  const v = String(valeur || '').trim();
  if (!v) return;
  data().o15.indicateurs[i].etapes.push({ txt: v, fait: false });
  sauver(true); rafraichirAtelier();
}

/* ================================================================ */
/*  ACTIONS                                                         */
/* ================================================================ */
document.addEventListener('click', e => {
  const b = e.target.closest('[data-agir]');
  if (!b) return;
  executer(b.dataset.agir, b.dataset, e, b);
});

export function executer(a, ds = {}, e = null, b = null) {
  const d = data();

  switch (a) {
    case 'volet': {
      vue.volet[vue.outilCourant] = ds.volet;
      rendre();
      break;
    }
    case 'menu': document.body.classList.toggle('tiroir-ouvert'); break;
    case 'palette': ouvrirPalette(); break;
    case 'theme': {
      theme = ds.theme; ecrireTheme(theme); appliquerTheme(theme); rendre();
      break;
    }
    case 'ajouter': {
      const champAjout = $(`[data-ajout="${ds.chemin}"]`);
      ajouterItem(ds.chemin, champAjout ? champAjout.value : '');
      break;
    }
    case 'retirer': {
      const el = retirer(ds.chemin, Number(ds.i));
      rafraichirAtelier();
      toast('Élément supprimé', { label: 'Annuler', faire: () => { annulerRetrait(); rafraichirAtelier(); } });
      break;
    }
    case 'monter': deplacer(ds.chemin, Number(ds.i), Number(ds.i) - 1); rafraichirAtelier(); break;
    case 'descendre': deplacer(ds.chemin, Number(ds.i), Number(ds.i) + 1); rafraichirAtelier(); break;
    case 'ajouter-objet': {
      const l = lire(ds.chemin);
      if (Array.isArray(l)) { l.push(MODELES[ds.modele]()); sauver(true); rafraichirAtelier(); }
      break;
    }
    case 'quiz-remise': d.o2.reponses = Array(7).fill(null); sauver(true); rafraichirAtelier(); break;
    case 'quiz-equipe':
      d.o2.equipe.push({ id: uid(), nom: '', profil: ds.profil });
      sauver(true); rafraichirAtelier();
      toast('Profil ajouté — nommez la personne');
      break;
    case 'petale-ajouter':
      dialogue({
        titre: 'Nouveau critère', valider: 'Ajouter',
        corps: `<label class="champ"><span class="intitule">Intitulé</span>
          <input type="text" name="cat" placeholder="Langue, validité, statut de séjour…"></label>`,
        surValidation: dlg => {
          const v = dlg.querySelector('[name=cat]').value.trim();
          if (!v) return;
          d.o3.petales.push({ cat: v, moi: '', cible: '' });
          sauver(true); rafraichirAtelier();
        }
      });
      break;
    case 'positiver': {
      if (!plein(d.o8.objectif) && plein(d.o8.probleme)) d.o8.objectif = d.o8.probleme;
      d.o8.causes.forEach(c => { if (!d.o8.moyens.includes(c)) d.o8.moyens.push(c); });
      d.o8.consequences.forEach(c => { if (!d.o8.finalites.includes(c)) d.o8.finalites.push(c); });
      sauver(true); rafraichirAtelier();
      toast('Recopié — reformulez chaque ligne en positif');
      break;
    }
    case 'axes-depuis-causes': {
      let n = 0;
      d.o8.causes.forEach(c => {
        if (!d.o17.axes.some(x => x.cause === c)) { d.o17.axes.push({ id: uid(), libelle: '', cause: c, notes: {} }); n++; }
      });
      sauver(true); rafraichirAtelier();
      toast(n ? `${n} axe${n > 1 ? 's' : ''} à formuler` : 'Toutes les causes sont déjà reprises');
      break;
    }
    case 'importer-indecis': {
      let n = 0;
      d.o4.acteurs.filter(x => x.position === 'indecis' && plein(x.nom)).forEach(x => {
        if (!d.o12.cibles.some(c => c.nom === x.nom)) {
          d.o12.cibles.push({ id: uid(), nom: x.nom, niveau: '1', gagne: '', perd: '', argument: '' }); n++;
        }
      });
      sauver(true); rafraichirAtelier();
      toast(n ? `${n} cible${n > 1 ? 's' : ''} reprise${n > 1 ? 's' : ''}` : 'Déjà à jour');
      break;
    }
    case 'fiches-depuis-cibles': {
      let n = 0;
      d.o12.cibles.filter(c => plein(c.nom)).forEach(c => {
        if (!d.o19.fiches.some(f => f.nom === c.nom)) {
          const f = MODELES.fiche(); f.nom = c.nom; f.detonateur = c.argument || ''; d.o19.fiches.push(f); n++;
        }
      });
      sauver(true); rafraichirAtelier();
      toast(n ? `${n} fiche${n > 1 ? 's' : ''} créée${n > 1 ? 's' : ''}` : 'Déjà à jour');
      break;
    }
    case 'etape-ajouter': {
      const c = $(`[data-etape="${ds.i}"]`);
      ajouterEtape(Number(ds.i), c ? c.value : '');
      break;
    }
    case 'etape-retirer':
      d.o15.indicateurs[Number(ds.i)].etapes.splice(Number(ds.j), 1);
      sauver(true); rafraichirAtelier();
      break;
    case 'engagement':
      d.o15.engagements[ds.nom] = ds.niveau;
      sauver(true); rafraichirAtelier();
      break;
    case 'plan-clic': {
      if (!b || !e) break;
      const r = b.getBoundingClientRect();
      d.o18.x = Math.round(((e.clientX - r.left) / r.width) * 100);
      d.o18.y = Math.round(((e.clientY - r.top) / r.height) * 100);
      sauver(true); rafraichirAtelier();
      break;
    }
    case 'copier-message': {
      const m = d.o13.messages[Number(ds.i)];
      const txt = [m.accroche, m.probleme, m.importance, `${m.cible} : ${m.action}`].filter(plein).join('\n\n');
      navigator.clipboard?.writeText(txt).then(() => toast('Message copié'), () => toast('Copie impossible'));
      break;
    }
    case 'demarrer': assistantDemarrage(); break;
    case 'ouvrir-dossiers': location.hash = '#/reglages'; break;
    case 'nouveau-dossier':
      dialogue({
        titre: 'Nouveau dossier', valider: 'Créer',
        corps: `<label class="champ"><span class="intitule">Nom du plaidoyer</span>
          <input type="text" name="nom" placeholder="Ex. : Une rue apaisée devant l’école"></label>`,
        surValidation: dlg => { creerDossier(dlg.querySelector('[name=nom]').value.trim()); location.hash = '#/'; rendre(); }
      });
      break;
    case 'basculer-dossier': basculerDossier(ds.id); location.hash = '#/'; rendre(); break;
    case 'dupliquer-dossier': dupliquerDossier(ds.id); rendre(); toast('Dossier dupliqué'); break;
    case 'supprimer-dossier': {
      const cible = etat.dossiers.find(x => x.id === ds.id);
      if (confirm(`Supprimer « ${cible?.nom || 'Sans titre'} » ? Cette action est définitive. Pensez à exporter d'abord.`)) {
        supprimerDossier(ds.id); rendre(); toast('Dossier supprimé');
      }
      break;
    }
    case 'effacer':
      if (confirm('Effacer tout le contenu de ce dossier ? Cette action est définitive.')) {
        const d0 = dossier();
        Object.assign(d0, dossierVierge(d0.nom), { id: d0.id, nom: d0.nom, cause: d0.cause, collectif: d0.collectif });
        sauver(true); rendre(); toast('Dossier vidé');
      }
      break;
    case 'exporter': exporterJSON(false); break;
    case 'exporter-tout': exporterJSON(true); break;
    case 'exporter-md': exporterMarkdown(); break;
    case 'importer': $('#fichier-import')?.click(); break;
    case 'imprimer': window.print(); break;
    case 'installer': lancerInstallation(); break;
    case 'recharger': location.reload(); break;
  }
}

/* cases à cocher et radios */
document.addEventListener('change', e => {
  const t = e.target;
  const a = t.dataset?.agir;
  if (!a) return;
  const d = data();

  if (a === 'quiz') { d.o2.reponses[Number(t.dataset.i)] = t.value; sauver(true); rafraichirAtelier(); }
  else if (a === 'cocher') {
    const l = lire(t.dataset.chemin) || [];
    const i = Number(t.dataset.i);
    const s = new Set(l); t.checked ? s.add(i) : s.delete(i);
    ecrire(t.dataset.chemin, Array.from(s).sort((x, y) => x - y));
    sauver(true); rafraichirAtelier();
  }
  else if (a === 'ordre') {
    const s = new Set(d.o5.ordres || []);
    t.checked ? s.add(t.value) : s.delete(t.value);
    d.o5.ordres = Array.from(s).sort(); sauver(true); rafraichirAtelier();
  }
  else if (a === 'pret') { d.o16.pret[t.dataset.cle] = t.checked; sauver(true); rafraichirAtelier(); }
  else if (a === 'etape') { d.o15.indicateurs[Number(t.dataset.i)].etapes[Number(t.dataset.j)].fait = t.checked; sauver(true); rafraichirAtelier(); }
  else if (a === 'crit-smart') {
    const o = d.o11.objectifs[Number(t.dataset.i)];
    const s = new Set(o.crits || []); t.checked ? s.add(t.dataset.cle) : s.delete(t.dataset.cle);
    o.crits = Array.from(s); sauver(true); rafraichirAtelier();
  }
  else if (a === 'note-axe') {
    const ax = d.o17.axes[Number(t.dataset.i)];
    ax.notes = ax.notes || {}; ax.notes[t.dataset.cle] = Number(t.value);
    sauver(true); rafraichirAtelier();
  }
  else if (a === 'poids') { d.o17.poids[t.dataset.cle] = Number(t.value); sauver(true); rafraichirAtelier(); }
});

/* ================================================================ */
/*  ASSISTANT DE DÉMARRAGE                                          */
/* ================================================================ */
function assistantDemarrage() {
  dialogue({
    titre: 'Commencer un plaidoyer', valider: 'Créer le dossier',
    corps: `
      <label class="champ"><span class="intitule">Le nom de votre plaidoyer</span>
        <input type="text" name="nom" placeholder="Ex. : Une rue apaisée devant l’école"></label>
      <label class="champ"><span class="intitule">Ce que vous voulez changer<span class="aide">une ligne suffit</span></span>
        <input type="text" name="cause" placeholder="Ex. : la vitesse des voitures aux heures de sortie"></label>
      <label class="champ"><span class="intitule">Qui porte ce plaidoyer</span>
        <input type="text" name="collectif" placeholder="Ex. : le comité de parents"></label>`,
    surValidation: dlg => {
      const d0 = dossier();
      d0.nom = dlg.querySelector('[name=nom]').value.trim() || 'Sans titre';
      d0.cause = dlg.querySelector('[name=cause]').value.trim();
      d0.collectif = dlg.querySelector('[name=collectif]').value.trim();
      sauver(true);
      location.hash = '#/outil/1';
      rendre();
      toast('Dossier créé — commencez par le domino');
    }
  });
}

/* ================================================================ */
/*  IMPORT / EXPORT                                                 */
/* ================================================================ */
function nomFichier(base) {
  const n = (dossier().nom || 'plaidoyer').toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  return `${base}-${n || 'plaidoyer'}`;
}
function telecharger(contenu, nom, type) {
  const blob = new Blob([contenu], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = nom; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
function exporterJSON(tout) {
  const charge = tout ? etat : { version: 2, actif: dossier().id, dossiers: [dossier()] };
  telecharger(JSON.stringify(charge, null, 2), nomFichier(tout ? 'tous-dossiers' : 'dossier') + '.json', 'application/json');
  toast(tout ? 'Tous les dossiers exportés' : 'Dossier exporté');
}

function exporterMarkdown() {
  const d = data(), m = dossier();
  const L = [];
  const titre = t => L.push('', '## ' + t, '');
  const sous = (t, v) => { if (plein(v)) L.push('**' + t + '** — ' + String(v).replace(/\n/g, ' '), ''); };
  const liste = (t, arr) => { if (arr?.length) { L.push('**' + t + '**', ''); arr.forEach(x => L.push('- ' + x)); L.push(''); } };

  L.push('# ' + (m.nom || 'Dossier de plaidoyer'), '');
  if (plein(m.cause)) L.push('> ' + m.cause, '');
  if (plein(m.collectif)) L.push('*' + m.collectif + '*', '');

  titre('1 · Voir');
  sous("Pourquoi nous nous engageons", d.o1.pourquoi); sous('Nos valeurs', d.o1.valeurs);
  sous('Le changement visé', d.o1.changements); sous('Premières actions', d.o1.actions);
  if (d.o2.equipe.length) liste("L'équipe", d.o2.equipe.map(x => `${x.nom || '—'} (${PROFILS[x.profil]?.nom || ''})`));
  liste('Fleur de pouvoir', d.o3.petales.filter(p => plein(p.moi) || plein(p.cible))
    .map(p => `${p.cat} — nous : ${p.moi || '—'} / cible : ${p.cible || '—'}`));
  sous("Ce que l'écart change", d.o3.notes);
  liste('Acteur·trice·s', d.o4.acteurs.filter(a => plein(a.nom))
    .map(a => `${a.nom} — ${a.pouvoir} (${a.niveau}), ${a.position}, influence ${a.influence}/5, intérêt ${a.interet}/5`));

  titre('2 · Juger');
  sous('Valeurs', d.o5.valeurs); sous('Hypothèses', d.o5.hypotheses);
  sous('Vision', d.o5.vision); sous('Missions', d.o5.missions);
  liste('Court terme', d.o5.court); liste('Moyen terme', d.o5.moyen); liste('Long terme', d.o5.long);
  liste('Forces', d.o6.forces); liste('Faiblesses', d.o6.faiblesses);
  liste('Opportunités', d.o6.opportunites); liste('Menaces', d.o6.menaces);
  PESTEL_AXES.forEach(a => liste('PESTEL — ' + a.nom, d.o7[a.cle]));
  liste("Fenêtres d'opportunité", d.o16.echeances.filter(e => plein(e.quoi)).map(e => `${e.date || '—'} · ${e.quoi} (${e.niveau})`));
  sous('Problème central', d.o8.probleme);
  liste('Causes profondes', d.o8.causes); liste('Conséquences', d.o8.consequences);
  sous('Objectif', d.o8.objectif); liste('Moyens à obtenir', d.o8.moyens);
  sous('Cause profonde (5 pourquoi)', d.o9.pourquoi[4]);
  liste('Axes stratégiques', d.o17.axes.filter(a => plein(a.libelle)).map(a => a.libelle));

  titre('3 · Agir');
  liste('Agir avec', d.o10.avec); liste('Agir contre', d.o10.contre); liste('Agir sans', d.o10.sans);
  sous('Théorie du changement politique', d.o18.theorie); sous('Plan de repli', d.o18.repli);
  liste('Objectifs SMART', d.o11.objectifs.map(o =>
    `D'ici ${o.temps || '…'}, obtenir ${o.decision || '…'} en faisant ${o.action || '…'} grâce à ${o.moyen || '…'}.`));
  liste('Cibles', d.o12.cibles.map(c => `${c.nom} (niveau ${c.niveau}) — gagne : ${c.gagne || '—'} ; perd : ${c.perd || '—'} ; argument : ${c.argument || '—'}`));
  liste('Allié·e·s', d.o12.allies.map(c => `${c.nom} — apporte ${c.apport || '—'} ; risques : ${c.risques || '—'}`));
  liste('Réseau', d.o20.membres.filter(x => plein(x.nom)).map(x => `${x.nom} — ${x.type}`));
  d.o13.messages.forEach((x, i) => {
    L.push(`### Message ${i + 1}`, '', x.accroche || '', '', x.probleme || '', '', x.importance || '', '',
      `**${x.cible || '—'}** : ${x.action || '—'}`, '');
  });
  if (plein(d.o22.petition.titre)) {
    L.push('### Pétition', '', `**${d.o22.petition.titre}**`, '',
      `Adressée à ${d.o22.petition.decideur || '—'}`, '', d.o22.petition.solution || '', '');
  }
  liste('Rencontres', d.o14.comptes.map(c => `${c.date} — ${c.qui} : ${c.resume} ${c.engagement ? '(' + c.engagement + ')' : ''}`));
  liste('Journal de bord', d.o15.journal.map(j => `${j.date} — ${j.action} → ${j.resultat}`));
  liste('Évolution des cibles', Object.entries(d.o15.engagements)
    .map(([n, v]) => `${n} : ${NIVEAUX_ENGAGEMENT.find(x => x.cle === v)?.nom || v}`));

  L.push('', '---', '', "Dossier produit avec l'Atelier plaidoyer. Outils d'après la Commission Justice et Paix et ULB-Coopération.");
  telecharger(L.join('\n'), nomFichier('dossier') + '.md', 'text/markdown');
  toast('Markdown exporté');
}

function lireFichierImport(f) {
  if (!f) return;
  const fr = new FileReader();
  fr.onload = () => {
    try {
      const brut = JSON.parse(fr.result);
      const entrants = Array.isArray(brut?.dossiers) ? brut.dossiers
        : brut?.d ? [brut] : [{ nom: 'Dossier importé', d: brut }];
      const propres = entrants.map(x => { const n = normaliserDossier(x); n.id = uid(); return n; });
      dialogue({
        titre: `Importer ${propres.length} dossier${propres.length > 1 ? 's' : ''}`,
        valider: 'Ajouter', annuler: 'Remplacer tout',
        corps: `<p style="font-size:.94rem">« <strong>Ajouter</strong> » conserve vos dossiers actuels et place les dossiers importés à côté.
          « <strong>Remplacer tout</strong> » efface les dossiers présents dans ce navigateur.</p>`,
        surValidation: () => {
          etat.dossiers.push(...propres); etat.actif = propres[0].id;
          sauver(true); location.hash = '#/'; rendre(); toast('Dossiers importés');
        }
      }).addEventListener('close', ev => {
        const dlg = ev.target;
        if (dlg.returnValue === 'annuler') {
          etat.dossiers = propres; etat.actif = propres[0].id;
          sauver(true); location.hash = '#/'; rendre(); toast('Dossiers remplacés');
        }
      });
    } catch (err) { toast('Fichier illisible'); }
  };
  fr.readAsText(f);
}

/* ================================================================ */
/*  PALETTE DE COMMANDES                                            */
/* ================================================================ */
const ACTIONS = [
  { nom: 'Tableau de bord', sous: 'Vue d’ensemble', aller: '#/' },
  { nom: 'Dossier complet', sous: 'Tout le travail rassemblé', aller: '#/dossier' },
  { nom: 'Réglages', sous: 'Thème, dossiers, sauvegarde', aller: '#/reglages' },
  { nom: 'Exporter le dossier', sous: 'Fichier .json', agir: 'exporter' },
  { nom: 'Exporter en Markdown', sous: 'Fichier .md', agir: 'exporter-md' },
  { nom: 'Imprimer le dossier', sous: 'Ou enregistrer en PDF', agir: 'imprimer' },
  { nom: 'Nouveau dossier', sous: 'Un autre plaidoyer', agir: 'nouveau-dossier' }
];

function indexNotes() {
  const out = [];
  const d = data();
  const parcourir = (obj, cleOutil) => {
    if (typeof obj === 'string') {
      const t = obj.trim();
      if (t.length > 2) out.push({ texte: t, outil: cleOutil });
    } else if (Array.isArray(obj)) obj.forEach(x => parcourir(x, cleOutil));
    else if (obj && typeof obj === 'object') Object.values(obj).forEach(x => parcourir(x, cleOutil));
  };
  Object.entries(d).forEach(([k, v]) => {
    const id = Number(k.replace('o', ''));
    if (outilParId(id)) parcourir(v, id);
  });
  return out;
}

function chercher(q) {
  const r = [];
  const ql = q.toLowerCase().trim();
  const outils = outilsOrdonnes();
  if (!ql) {
    outils.slice(0, 8).forEach(o => r.push({ type: 'outil', o }));
    ACTIONS.forEach(a => r.push({ type: 'action', a }));
    return r;
  }
  outils.forEach(o => {
    const foin = `${o.id} ${o.titre} ${o.resume} ${o.objectif}`.toLowerCase();
    if (foin.includes(ql)) r.push({ type: 'outil', o });
  });
  ACTIONS.forEach(a => { if ((a.nom + ' ' + a.sous).toLowerCase().includes(ql)) r.push({ type: 'action', a }); });
  const vus = new Set();
  indexNotes().forEach(n => {
    if (r.length > 24) return;
    if (!n.texte.toLowerCase().includes(ql)) return;
    const c = n.outil + '|' + n.texte;
    if (vus.has(c)) return; vus.add(c);
    r.push({ type: 'note', n });
  });
  return r;
}

let resultats = [], vise = 0;

function ouvrirPalette() {
  const dlg = $('#palette');
  const input = $('#palette-champ');
  input.value = '';
  majPalette('');
  dlg.showModal();
  input.focus();
}

function majPalette(q) {
  resultats = chercher(q); vise = 0;
  const zone = $('#palette-resultats');
  if (!resultats.length) {
    zone.innerHTML = `<p class="vide" style="margin:10px">Rien trouvé pour « ${esc(q)} »</p>`;
    return;
  }
  zone.innerHTML = resultats.map((r, i) => {
    if (r.type === 'outil') return `<button class="res ${i === 0 ? 'vise' : ''}" data-idx="${i}">
      <span class="rang">${String(r.o.id).padStart(2, '0')}</span>
      <span class="lib"><b>${surligner(r.o.titre, q)}</b><span>${esc(r.o.resume)}</span></span></button>`;
    if (r.type === 'action') return `<button class="res ${i === 0 ? 'vise' : ''}" data-idx="${i}">
      <span class="rang">${ico('fleche', 13)}</span>
      <span class="lib"><b>${surligner(r.a.nom, q)}</b><span>${esc(r.a.sous)}</span></span></button>`;
    const o = outilParId(r.n.outil);
    return `<button class="res ${i === 0 ? 'vise' : ''}" data-idx="${i}">
      <span class="rang">${String(r.n.outil).padStart(2, '0')}</span>
      <span class="lib"><b>${surligner(r.n.texte.slice(0, 90), q)}</b><span>Votre note — ${esc(o?.titre || '')}</span></span></button>`;
  }).join('');
}

function choisir(i) {
  const r = resultats[i];
  if (!r) return;
  $('#palette').close();
  if (r.type === 'outil') location.hash = '#/outil/' + r.o.id;
  else if (r.type === 'note') { vue.volet[r.n.outil] = 'atelier'; location.hash = '#/outil/' + r.n.outil; }
  else if (r.a.aller) location.hash = r.a.aller;
  else executer(r.a.agir);
}

/* ================================================================ */
/*  CLAVIER                                                         */
/* ================================================================ */
document.addEventListener('keydown', e => {
  const dansChamp = /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName) || e.target.isContentEditable;
  const paletteOuverte = $('#palette')?.open;

  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); ouvrirPalette(); return; }

  if (paletteOuverte) {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      vise = Math.max(0, Math.min(resultats.length - 1, vise + (e.key === 'ArrowDown' ? 1 : -1)));
      $$('#palette-resultats .res').forEach((b, i) => b.classList.toggle('vise', i === vise));
      $$('#palette-resultats .res')[vise]?.scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'Enter') { e.preventDefault(); choisir(vise); }
    return;
  }

  if (dansChamp) return;

  if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
    const l = outilsOrdonnes();
    const i = l.findIndex(o => o.id === vue.outilCourant);
    if (i < 0) return;
    const n = l[i + (e.key === 'ArrowRight' ? 1 : -1)];
    if (n) location.hash = '#/outil/' + n.id;
  } else if (e.key.toLowerCase() === 'g' && vue.outilCourant) {
    vue.volet[vue.outilCourant] = voletPour(vue.outilCourant) === 'guide' ? 'atelier' : 'guide';
    rendre();
  }
});

/* ================================================================ */
/*  INSTALLATION ET MISE À JOUR                                     */
/* ================================================================ */
let promesseInstall = null;
addEventListener('beforeinstallprompt', e => {
  e.preventDefault(); promesseInstall = e;
  const b = $('#btn-installer'); if (b) b.hidden = false;
});
function lancerInstallation() {
  if (!promesseInstall) { toast('Utilisez « Ajouter à l’écran d’accueil » dans votre navigateur'); return; }
  promesseInstall.prompt();
  promesseInstall.userChoice.finally(() => {
    promesseInstall = null;
    const b = $('#btn-installer'); if (b) b.hidden = true;
  });
}

function proposerMaj() {
  if ($('.bandeau-maj')) return;
  const el = document.createElement('div');
  el.className = 'bandeau-maj';
  el.innerHTML = `<span>Une nouvelle version est disponible.</span>
    <button class="bouton" data-agir="recharger" style="background:#fff;color:#14151A;border-color:#fff">Recharger</button>`;
  document.body.appendChild(el);
}

/* ================================================================ */
/*  DÉMARRAGE                                                       */
/* ================================================================ */
charger();

$('.barre-mobile').innerHTML = barreMobileHTML();
addEventListener('hashchange', () => { rendre(); marquerCourant(); });

$('#palette-champ').addEventListener('input', e => majPalette(e.target.value));
$('#palette-resultats').addEventListener('click', e => {
  const b = e.target.closest('.res');
  if (b) choisir(Number(b.dataset.idx));
});

/* indicateur d'enregistrement */
abonner(quoi => {
  const el = $('.etat-sauve');
  if (!el) return;
  if (quoi === 'modif') { el.textContent = 'enregistrement…'; el.classList.add('on'); }
  if (quoi === 'sauve') {
    el.textContent = 'enregistré';
    setTimeout(() => el.classList.remove('on'), 1200);
  }
});

rendre();

if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
  addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').then(reg => {
      reg.addEventListener('updatefound', () => {
        const nouveau = reg.installing;
        nouveau?.addEventListener('statechange', () => {
          if (nouveau.state === 'installed' && navigator.serviceWorker.controller) proposerMaj();
        });
      });
    }).catch(() => { });
  });
}
