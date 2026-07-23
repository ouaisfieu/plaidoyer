/* ================================================================
   ATELIER PLAIDOYER — application
   Vanilla JS, sans dépendance, fonctionne hors-ligne.
   ================================================================ */

/* ---------- 1. Stockage ---------- */
const CLE = 'atelier-plaidoyer-v1';
const memoire = {};
const disque = {
  lire(k) {
    try { return localStorage.getItem(k); } catch (e) { return memoire[k] ?? null; }
  },
  ecrire(k, v) {
    try { localStorage.setItem(k, v); } catch (e) { memoire[k] = v; }
  }
};

const vierge = () => ({
  meta: { titre: '', cause: '', collectif: '', maj: null },
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
  o15: { journal: [], indicateurs: [], evaluation: {} }
});

let S = vierge();

function charger() {
  const brut = disque.lire(CLE);
  if (!brut) return;
  try {
    const d = JSON.parse(brut);
    S = fusion(vierge(), d);
  } catch (e) { console.warn('Données illisibles, on repart de zéro.'); }
}
function fusion(base, apport) {
  if (!apport || typeof apport !== 'object') return base;
  for (const k of Object.keys(base)) {
    if (!(k in apport)) continue;
    if (Array.isArray(base[k])) base[k] = Array.isArray(apport[k]) ? apport[k] : base[k];
    else if (base[k] && typeof base[k] === 'object') base[k] = fusion(base[k], apport[k]);
    else base[k] = apport[k];
  }
  return base;
}
let minuteur = null;
function sauver(immediat) {
  S.meta.maj = new Date().toISOString();
  clearTimeout(minuteur);
  const faire = () => { disque.ecrire(CLE, JSON.stringify(S)); majRail(); };
  if (immediat) faire(); else minuteur = setTimeout(faire, 400);
}

/* ---------- 2. Chemins ---------- */
function lire(chemin) {
  return chemin.split('.').reduce((o, k) => (o == null ? undefined : o[k]), S);
}
function ecrire(chemin, val) {
  const bouts = chemin.split('.');
  const dernier = bouts.pop();
  const cible = bouts.reduce((o, k) => o[k], S);
  cible[dernier] = val;
}

/* ---------- 3. Utilitaires ---------- */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const uid = () => Math.random().toString(36).slice(2, 9);
const outil = id => OUTILS.find(o => o.id === id);
const encreDe = id => PARTIES[outil(id).partie].encre;
const nonVide = v => String(v ?? '').trim().length > 0;

function toast(txt) {
  let t = $('.toast');
  if (!t) { t = document.createElement('div'); t.className = 'toast'; document.body.appendChild(t); }
  t.textContent = txt; t.classList.add('on');
  clearTimeout(t._t); t._t = setTimeout(() => t.classList.remove('on'), 2200);
}

/* ---------- 4. Avancement ---------- */
const AVANCEMENT = {
  1: d => [d.o1.pourquoi, d.o1.valeurs, d.o1.changements, d.o1.actions].filter(nonVide).length >= 3,
  2: d => d.o2.reponses.filter(r => r !== null).length === 7,
  3: d => d.o3.petales.filter(p => nonVide(p.moi)).length >= 4,
  4: d => d.o4.acteurs.length >= 3,
  5: d => [d.o5.vision, d.o5.valeurs, d.o5.hypotheses, d.o5.missions].filter(nonVide).length >= 3,
  6: d => ['forces', 'faiblesses', 'opportunites', 'menaces'].every(k => d.o6[k].length > 0),
  7: d => Object.values(d.o7).filter(a => a.length > 0).length >= 3,
  8: d => nonVide(d.o8.probleme) && d.o8.causes.length >= 2 && d.o8.consequences.length >= 1,
  9: d => nonVide(d.o9.probleme) && d.o9.pourquoi.filter(nonVide).length >= 4,
  10: d => d.o10.avec.length + d.o10.contre.length + d.o10.sans.length >= 3,
  11: d => d.o11.objectifs.some(o => nonVide(o.temps) && nonVide(o.decision)),
  12: d => d.o12.cibles.length >= 1 && d.o12.allies.length >= 1,
  13: d => d.o13.messages.some(m => nonVide(m.accroche) && nonVide(m.action)),
  14: d => d.o14.avant.length >= 5,
  15: d => d.o15.journal.length >= 1 || d.o15.indicateurs.length >= 1
};
const estFait = id => { try { return !!AVANCEMENT[id](S); } catch (e) { return false; } };
const totalFaits = () => OUTILS.filter(o => estFait(o.id)).length;

/* ---------- 5. Fragments d'interface ---------- */
function champ(chemin, label, ph, lignes) {
  const v = esc(lire(chemin));
  if (lignes === 0) {
    return `<label class="champ"><span>${esc(label)}</span>
      <input type="text" data-lien="${chemin}" value="${v}" placeholder="${esc(ph || '')}"></label>`;
  }
  return `<label class="champ"><span>${esc(label)}</span>
    <textarea data-lien="${chemin}" rows="${lignes || 3}" placeholder="${esc(ph || '')}">${v}</textarea></label>`;
}

function listeEditable(chemin, label, ph) {
  const items = lire(chemin) || [];
  return `<div class="liste-bloc" data-liste="${chemin}">
    ${label ? `<span class="eyebrow" style="display:block;margin-bottom:6px">${esc(label)}</span>` : ''}
    <ul class="liste-items">
      ${items.length ? items.map((t, i) => `<li><span>${esc(t)}</span>
        <button class="btn mini sup" data-action="liste-sup" data-chemin="${chemin}" data-i="${i}" aria-label="Supprimer">✕</button></li>`).join('')
      : '<li class="vide">Rien pour l’instant.</li>'}
    </ul>
    <div class="ajout">
      <input type="text" data-ajout="${chemin}" placeholder="${esc(ph || 'Ajouter un élément…')}">
      <button class="btn" data-action="liste-add" data-chemin="${chemin}">Ajouter</button>
    </div></div>`;
}

function blocGuide(o) {
  return `
  <div class="bloc ombre">
    <span class="eyebrow">Objectif</span>
    <p style="margin-top:6px">${o.objectif}</p>
  </div>
  <div class="bloc">
    <h3>Méthode</h3>
    <ul>${o.methode.map(m => `<li>${m}</li>`).join('')}</ul>
  </div>
  <div class="pointcle" style="margin-top:18px">
    <span class="eyebrow">Le point qui fait la différence</span>
    <p>${o.pointcle}</p>
  </div>
  <div class="bloc" style="margin-top:18px">
    <h3>Questions à se poser</h3>
    <ul>${o.questions.map(q => `<li>${esc(q)}</li>`).join('')}</ul>
  </div>
  ${o.exemple ? `<div class="bloc"><h3>Exemple</h3><p class="exemple">${esc(o.exemple)}</p></div>` : ''}
  ${o.source ? `<p class="source">${esc(o.source)}</p>` : ''}`;
}

/* ---------- 6. Ateliers ---------- */
const ATELIERS = {

  /* 1 — Domino du changement */
  domino() {
    const d = S.o1;
    const cases = [
      ['pourquoi', 'Pourquoi voulons-nous nous engager ?', 'Ce qui nous met en mouvement, ce que nous ne supportons plus…'],
      ['valeurs', 'Quelles valeurs portons-nous ?', 'Solidarité, justice, dignité, action collective…'],
      ['changements', 'Quels changements voulons-nous voir ?', 'Le futur visé, formulé au présent'],
      ['actions', 'Quelles actions pourrions-nous mener ?', 'Premières pistes concrètes']
    ];
    return `<div class="notice">Chaque réponse fait tomber la suivante. Écrivez d’un trait, sans chercher la formule parfaite : ce domino se relit à plusieurs.</div>
    <div class="grille g2" style="margin-top:18px">
      ${cases.map(([k, l, p], i) => `<div class="bloc">
        <span class="eyebrow">Domino ${i + 1} / 4</span>
        ${champ('o1.' + k, l, p, 4)}
      </div>`).join('')}
    </div>`;
  },

  /* 2 — Quel est mon profil ? */
  profil() {
    const rep = S.o2.reponses;
    const scores = { a: 0, b: 0, c: 0 };
    rep.forEach(r => { if (r) scores[r]++; });
    const complet = rep.filter(r => r !== null).length === 7;
    let gagnant = null;
    if (complet) gagnant = Object.keys(scores).sort((x, y) => scores[y] - scores[x])[0];

    const equipe = S.o2.equipe;
    const compte = { a: 0, b: 0, c: 0 };
    equipe.forEach(m => { if (compte[m.profil] !== undefined) compte[m.profil]++; });
    const manquants = Object.keys(PROFILS).filter(k => compte[k] === 0);

    return `
    <div class="bloc">
      <h3>Le test</h3>
      ${QUIZ.map((q, i) => `<div class="q-bloc">
        <p>${i + 1}. ${esc(q.q)}</p>
        ${q.r.map((t, j) => {
          const cle = ['a', 'b', 'c'][j];
          return `<label class="choix"><input type="radio" name="q${i}" value="${cle}" ${rep[i] === cle ? 'checked' : ''}
            data-action="quiz" data-i="${i}"> <span>${esc(t)}</span></label>`;
        }).join('')}
      </div>`).join('')}
      ${complet ? `<div class="resultat">
          <span class="eyebrow" style="color:rgba(255,255,255,.7)">Tendance dominante — ${scores[gagnant]} réponses sur 7</span>
          <h3 style="margin:6px 0 8px">${esc(PROFILS[gagnant].nom)}</h3>
          <p style="margin:0">${esc(PROFILS[gagnant].txt)}</p>
          <p style="margin:10px 0 0;font-size:.9rem;opacity:.85">Dans l’équipe : ${esc(PROFILS[gagnant].role)}</p>
        </div>
        <div class="barre-actions"><button class="btn" data-action="quiz-reset">Refaire le test</button>
        <button class="btn plein" data-action="quiz-vers-equipe" data-profil="${gagnant}">Ajouter ce profil à l’équipe</button></div>`
      : `<p class="vide">Répondez aux 7 questions pour voir votre tendance.</p>`}
    </div>

    <div class="bloc">
      <h3>L’équipe</h3>
      <div class="tab-scroll"><table class="tab">
        <thead><tr><th>Personne</th><th>Profil</th><th></th></tr></thead>
        <tbody>${equipe.length ? equipe.map((m, i) => `<tr>
          <td><input type="text" data-lien="o2.equipe.${i}.nom" value="${esc(m.nom)}" placeholder="Prénom"></td>
          <td><select data-lien="o2.equipe.${i}.profil" data-rerender="1">
            ${Object.values(PROFILS).map(p => `<option value="${p.cle}" ${m.profil === p.cle ? 'selected' : ''}>${esc(p.nom)}</option>`).join('')}
          </select></td>
          <td><button class="btn mini sup" data-action="tab-sup" data-chemin="o2.equipe" data-i="${i}">✕</button></td>
        </tr>`).join('') : '<tr><td colspan="3" class="vide">Personne pour l’instant.</td></tr>'}</tbody>
      </table></div>
      <div class="barre-actions">
        <button class="btn" data-action="add-objet" data-chemin="o2.equipe" data-modele="membre">Ajouter une personne</button>
      </div>
      ${equipe.length ? (manquants.length
        ? `<div class="pointcle" style="margin-top:16px"><span class="eyebrow">Déséquilibre repéré</span>
             <p>Aucun profil <strong>${manquants.map(k => PROFILS[k].nom.toLowerCase()).join(' ni ')}</strong> dans le groupe.
             ${esc(manquants.map(k => PROFILS[k].role).join(' '))} — qui peut prendre ce rôle ?</p></div>`
        : `<div class="pointcle" style="margin-top:16px"><span class="eyebrow">Équilibre</span>
             <p>Les trois profils sont représentés. Vérifiez que les rôles sont explicitement attribués, pas seulement présents.</p></div>`) : ''}
    </div>`;
  },

  /* 3 — Fleur de pouvoir */
  fleur() {
    const p = S.o3.petales;
    const svg = fleurSVG(p);
    return `<div class="fleur-zone">
      <div class="fleur"><div id="graph-fleur">${svg}</div>
        <div class="legende" style="justify-content:center">
          <span><i style="background:var(--bleu)"></i>Nous</span>
          <span><i style="background:var(--rose)"></i>La cible</span>
        </div>
      </div>
      <div>
        <div class="notice">Notez pour chaque pétale votre caractéristique, puis celle de la personne ou du milieu que vous visez. L’écart se lit sur la fleur.</div>
        <div class="tab-scroll" style="margin-top:16px"><table class="tab">
          <thead><tr><th>Critère</th><th>Nous</th><th>La cible</th></tr></thead>
          <tbody>${p.map((x, i) => `<tr>
            <td style="white-space:nowrap"><strong>${esc(x.cat)}</strong></td>
            <td><input type="text" data-lien="o3.petales.${i}.moi" data-graph="fleur" value="${esc(x.moi)}" placeholder="…"></td>
            <td><input type="text" data-lien="o3.petales.${i}.cible" data-graph="fleur" value="${esc(x.cible)}" placeholder="…"></td>
          </tr>`).join('')}</tbody>
        </table></div>
        <div style="margin-top:16px">
          ${champ('o3.notes', 'Ce que cet écart change pour la rencontre', 'Quels privilèges jouent en notre faveur ? Lesquels nous manquent ? Qui pourrait porter la parole avec nous ?', 4)}
        </div>
      </div>
    </div>`;
  },

  /* 4 — Cartographie des acteur·trice·s */
  acteurs() {
    const a = S.o4.acteurs;
    return `
    <div class="bloc">
      <h3>Les parties prenantes</h3>
      <div class="tab-scroll"><table class="tab">
        <thead><tr><th>Nom</th><th>Type de pouvoir</th><th>Position</th><th>Influence 1-5</th><th>Intérêt 1-5</th><th>Notes</th><th></th></tr></thead>
        <tbody>${a.length ? a.map((x, i) => `<tr>
          <td style="min-width:150px"><input type="text" data-lien="o4.acteurs.${i}.nom" data-graph="matrice" value="${esc(x.nom)}" placeholder="Nom"></td>
          <td><select data-lien="o4.acteurs.${i}.pouvoir">${POUVOIRS.map(pp => `<option ${x.pouvoir === pp ? 'selected' : ''}>${pp}</option>`).join('')}</select></td>
          <td><select data-lien="o4.acteurs.${i}.position" data-graph="matrice">${POSITIONS.map(pp => `<option value="${pp.cle}" ${x.position === pp.cle ? 'selected' : ''}>${pp.nom}</option>`).join('')}</select></td>
          <td><input type="number" min="1" max="5" data-lien="o4.acteurs.${i}.influence" data-graph="matrice" value="${esc(x.influence)}"></td>
          <td><input type="number" min="1" max="5" data-lien="o4.acteurs.${i}.interet" data-graph="matrice" value="${esc(x.interet)}"></td>
          <td style="min-width:170px"><input type="text" data-lien="o4.acteurs.${i}.notes" value="${esc(x.notes)}" placeholder="Levier, contact, mandat…"></td>
          <td><button class="btn mini sup" data-action="tab-sup" data-chemin="o4.acteurs" data-i="${i}">✕</button></td>
        </tr>`).join('') : '<tr><td colspan="7" class="vide">Aucun acteur recensé.</td></tr>'}</tbody>
      </table></div>
      <div class="barre-actions">
        <button class="btn plein" data-action="add-objet" data-chemin="o4.acteurs" data-modele="acteur">Ajouter un acteur</button>
      </div>
    </div>
    <div class="bloc">
      <h3>Power mapping</h3>
      <p class="lede" style="font-size:.95rem">Influence en abscisse, intérêt pour la thématique en ordonnée. Le quadrant en haut à droite concentre celles et ceux qu’il faut convaincre en priorité.</p>
      <div id="graph-matrice">${matriceSVG(a)}</div>
      <div class="legende">
        ${POSITIONS.map(p => `<span><i class="${p.cle}" style="background:${p.cle === 'allie' ? 'var(--bleu)' : p.cle === 'indecis' ? 'var(--jaune)' : 'var(--rose)'}"></i>${p.nom}</span>`).join('')}
      </div>
    </div>`;
  },

  /* 5 — Théorie du changement */
  toc() {
    const ordres = S.o5.ordres || [];
    const O = [
      ['1', 'Premier ordre — les événements et les façons de faire'],
      ['2', 'Deuxième ordre — les modèles et les façons de penser'],
      ['3', 'Troisième ordre — les structures et les façons de comprendre']
    ];
    return `
    <div class="grille g2">
      <div class="bloc">${champ('o5.valeurs', 'Nos valeurs', 'Les grands principes dont nous partons', 4)}</div>
      <div class="bloc">${champ('o5.hypotheses', 'Nos hypothèses', '« S’il se passe telle chose, alors le résultat sera… »', 4)}</div>
      <div class="bloc">${champ('o5.vision', 'Notre vision', 'Le futur idéal sur cette thématique', 4)}</div>
      <div class="bloc">${champ('o5.missions', 'Nos missions', 'Ce que le groupe fait concrètement pour y contribuer', 4)}</div>
    </div>
    <div class="bloc">
      <h3>Le chemin du changement</h3>
      <p class="lede" style="font-size:.95rem">Les conditions à réunir pour que le changement se produise, réparties dans le temps.</p>
      <div class="grille g3" style="margin-top:14px">
        <div>${listeEditable('o5.court', 'Court terme', 'Une condition à réunir…')}</div>
        <div>${listeEditable('o5.moyen', 'Moyen terme', 'Une condition à réunir…')}</div>
        <div>${listeEditable('o5.long', 'Long terme', 'Une condition à réunir…')}</div>
      </div>
    </div>
    <div class="bloc">
      <h3>À quel ordre s’attaque notre plaidoyer ?</h3>
      ${O.map(([k, t]) => `<label class="choix"><input type="checkbox" data-action="ordre" value="${k}" ${ordres.includes(k) ? 'checked' : ''}> <span>${esc(t)}</span></label>`).join('')}
      ${ordres.length === 1 && ordres[0] === '1' ? `<div class="pointcle" style="margin-top:14px"><span class="eyebrow">Attention</span>
        <p>Un plaidoyer qui ne touche que les façons de faire produit des victoires réversibles. Que faudrait-il pour atteindre les modèles, ou les structures ?</p></div>` : ''}
    </div>`;
  },

  /* 6 — SWOT */
  swot() {
    const b = (cle, titre, sous, classe) => `<div class="${classe}">
      <span class="eyebrow">${sous}</span>
      <h3 style="font-family:var(--display);font-stretch:condensed;text-transform:uppercase;font-size:22px;margin:4px 0 10px">${titre}</h3>
      ${listeEditable('o6.' + cle, '', 'Ajouter…')}</div>`;
    return `<div class="swot">
      ${b('forces', 'Forces', 'Interne · positif', 'interne')}
      ${b('faiblesses', 'Faiblesses', 'Interne · négatif', 'interne')}
      ${b('opportunites', 'Opportunités', 'Externe · positif', 'externe')}
      ${b('menaces', 'Menaces', 'Externe · négatif', 'externe')}
    </div>
    <div class="notice" style="margin-top:18px">Le haut du tableau, c’est ce sur quoi le groupe a prise. Le bas, c’est l’environnement. Une stratégie tient quand elle utilise une force pour saisir une opportunité — ou pour couvrir une faiblesse face à une menace.</div>`;
  },

  /* 7 — PESTEL */
  pestel() {
    return `<div class="grille g3">
      ${PESTEL_AXES.map(a => `<div class="bloc">
        <span class="eyebrow">${a.cle}</span>
        <h3 style="margin:2px 0 4px">${esc(a.nom)}</h3>
        <p style="font-size:.85rem;color:var(--ink-faint)">${esc(a.aide)}</p>
        ${listeEditable('o7.' + a.cle, '', 'Un facteur, une tendance…')}
      </div>`).join('')}
    </div>`;
  },

  /* 8 — Arbre à problème / à objectif */
  arbre() {
    return `<div class="grille g2">
      <div>
        <div class="fil"><span class="tag rose">Arbre à problème</span></div>
        <div class="arbre">
          <div class="etage"><span class="eyebrow">Les branches — conséquences</span>
            ${listeEditable('o8.consequences', '', 'Une conséquence du problème…')}</div>
          <div class="etage tronc"><span class="eyebrow">Le tronc — le problème</span>
            <input type="text" data-lien="o8.probleme" value="${esc(S.o8.probleme)}" placeholder="Formulez le problème en une phrase" style="margin-top:6px"></div>
          <div class="etage"><span class="eyebrow">Les racines — causes profondes</span>
            ${listeEditable('o8.causes', '', 'Une cause profonde…')}</div>
        </div>
      </div>
      <div>
        <div class="fil"><span class="tag bleu">Arbre à objectif</span>
          <button class="btn mini" data-action="positiver">Positiver l’arbre</button></div>
        <div class="arbre">
          <div class="etage"><span class="eyebrow">Finalités visées</span>
            ${listeEditable('o8.finalites', '', 'Ce qui s’améliore si le problème est résolu…')}</div>
          <div class="etage tronc"><span class="eyebrow">L’objectif</span>
            <input type="text" data-lien="o8.objectif" value="${esc(S.o8.objectif)}" placeholder="Le problème, retourné en objectif" style="margin-top:6px"></div>
          <div class="etage"><span class="eyebrow">Moyens — ce qu’il faut obtenir</span>
            ${listeEditable('o8.moyens', '', 'Une demande concrète, une mesure…')}</div>
        </div>
      </div>
    </div>
    <div class="notice" style="margin-top:18px">« Positiver l’arbre » recopie le problème et ses causes du côté objectif : à vous de reformuler chaque ligne en demande. Les moyens obtenus ici alimentent directement vos objectifs SMART et votre message.</div>`;
  },

  /* 9 — Les 5 pourquoi */
  cinq() {
    const p = S.o9.pourquoi;
    return `<div class="bloc">
      ${champ('o9.probleme', 'Le problème de départ', 'Ce que l’on constate', 2)}
      <ol class="chaine" style="margin-top:20px">
        ${p.map((v, i) => `<li data-n="${i + 1}" class="${i === 4 ? 'racine' : ''}">
          <label class="champ" style="margin:0">
            <span>${i === 4 ? 'Pourquoi ? — cause profonde' : 'Pourquoi ?'}</span>
            <textarea data-lien="o9.pourquoi.${i}" rows="2" placeholder="${i === 0 ? 'Parce que…' : 'Et pourquoi cela ?'}">${esc(v)}</textarea>
          </label></li>`).join('')}
      </ol>
      ${nonVide(p[4]) ? `<div class="pointcle"><span class="eyebrow">Cause profonde</span>
        <p>${esc(p[4])}</p>
        <p style="font-size:.9rem;margin-top:8px">C’est là qu’il faut agir. Vérifiez : cette cause est-elle structurelle, ou encore une conséquence d’autre chose ?</p></div>` : ''}
    </div>`;
  },

  /* 10 — Avec, sans, contre */
  rapport() {
    const col = (cle, titre, expl, tag) => `<div class="bloc">
      <div class="fil"><span class="tag ${tag}">${titre}</span></div>
      <p style="font-size:.9rem;color:var(--ink-soft)">${expl}</p>
      ${listeEditable('o10.' + cle, '', 'Une action…')}</div>`;
    return `<div class="grille g3">
      ${col('avec', 'Avec', 'Dialogue, négociation, co-construction. C’est le registre du plaidoyer.', 'bleu')}
      ${col('contre', 'Contre', 'Résistance, conflit ouvert avec les sphères de pouvoir.', 'rose')}
      ${col('sans', 'Sans', 'Espace d’autonomie, alternatives citoyennes construites à côté.', 'jaune')}
    </div>
    <div class="bloc">${champ('o10.note', 'Notre dosage', 'Quel registre domine aujourd’hui ? Est-il choisi ou subi ? Quelle action d’un autre registre renforcerait le plaidoyer ?', 3)}</div>`;
  },

  /* 11 — Objectifs SMART */
  smart() {
    const objs = S.o11.objectifs;
    const crits = [['S', 'Spécifique'], ['M', 'Mesurable'], ['A', 'Atteignable'], ['R', 'Réaliste'], ['T', 'Temporel']];
    return `${objs.length ? objs.map((o, i) => `<div class="bloc">
      <span class="eyebrow">Objectif ${i + 1}</span>
      <p class="phrase-smart" style="margin:10px 0 16px">
        D’ici <span class="trou">${esc(o.temps) || '…'}</span>, obtenir <span class="trou">${esc(o.decision) || '…'}</span>
        en faisant <span class="trou">${esc(o.action) || '…'}</span> grâce à <span class="trou">${esc(o.moyen) || '…'}</span>.
      </p>
      <div class="grille g2">
        <div>${champ(`o11.objectifs.${i}.temps`, 'D’ici… (temps)', 'décembre 2026', 0)}
             ${champ(`o11.objectifs.${i}.decision`, 'Obtenir… (décision spécifique et mesurable)', 'le vote d’une motion communale', 0)}</div>
        <div>${champ(`o11.objectifs.${i}.action`, 'En faisant… (action atteignable)', 'en rencontrant les 6 chef·fes de groupe', 0)}
             ${champ(`o11.objectifs.${i}.moyen`, 'Grâce à… (moyen réaliste)', 'notre note de position et le relais du comité de quartier', 0)}</div>
      </div>
      <div class="grille g3" style="margin-top:6px">
        ${crits.map(([k, n]) => `<label class="critere"><input type="checkbox" data-action="smart-crit" data-i="${i}" data-k="${k}" ${(o.crits || []).includes(k) ? 'checked' : ''}>
          <b>${k}</b><span>${n}</span></label>`).join('')}
      </div>
      <div class="barre-actions"><button class="btn sup" data-action="tab-sup" data-chemin="o11.objectifs" data-i="${i}">Supprimer cet objectif</button></div>
    </div>`).join('') : '<p class="vide">Aucun objectif formulé.</p>'}
    <div class="barre-actions">
      <button class="btn plein" data-action="add-objet" data-chemin="o11.objectifs" data-modele="objectif">Ajouter un objectif</button>
    </div>`;
  },

  /* 12 — Cibles et alliances */
  cibles() {
    const acteurs = S.o4.acteurs;
    const indecis = acteurs.filter(a => a.position === 'indecis');
    return `
    ${indecis.length ? `<div class="pointcle"><span class="eyebrow">Depuis votre cartographie</span>
      <p>${indecis.length} acteur·trice·s sont noté·e·s indécis·es : <strong>${indecis.map(a => esc(a.nom)).join(', ')}</strong>. C’est là que votre plaidoyer a le plus de prise.</p></div>` : ''}
    <div class="bloc" style="margin-top:18px">
      <h3>Les cibles</h3>
      <div class="tab-scroll"><table class="tab">
        <thead><tr><th>Cible</th><th>Ce qu’elle gagne</th><th>Ce qu’elle perd</th><th>Notre argument</th><th></th></tr></thead>
        <tbody>${S.o12.cibles.length ? S.o12.cibles.map((c, i) => `<tr>
          <td style="min-width:140px"><input type="text" data-lien="o12.cibles.${i}.nom" value="${esc(c.nom)}" placeholder="Nom, fonction"></td>
          <td><input type="text" data-lien="o12.cibles.${i}.gagne" value="${esc(c.gagne)}" placeholder="…"></td>
          <td><input type="text" data-lien="o12.cibles.${i}.perd" value="${esc(c.perd)}" placeholder="…"></td>
          <td style="min-width:180px"><input type="text" data-lien="o12.cibles.${i}.argument" value="${esc(c.argument)}" placeholder="L’angle qui la fait bouger"></td>
          <td><button class="btn mini sup" data-action="tab-sup" data-chemin="o12.cibles" data-i="${i}">✕</button></td>
        </tr>`).join('') : '<tr><td colspan="5" class="vide">Aucune cible retenue.</td></tr>'}</tbody>
      </table></div>
      <div class="barre-actions">
        <button class="btn plein" data-action="add-objet" data-chemin="o12.cibles" data-modele="cible">Ajouter une cible</button>
        ${indecis.length ? `<button class="btn" data-action="importer-indecis">Reprendre les indécis·es</button>` : ''}
      </div>
    </div>
    <div class="bloc">
      <h3>Les allié·e·s</h3>
      <div class="tab-scroll"><table class="tab">
        <thead><tr><th>Allié·e</th><th>Ce qu’il/elle apporte</th><th>Avantages</th><th>Risques</th><th></th></tr></thead>
        <tbody>${S.o12.allies.length ? S.o12.allies.map((c, i) => `<tr>
          <td style="min-width:140px"><input type="text" data-lien="o12.allies.${i}.nom" value="${esc(c.nom)}" placeholder="Organisation, personne"></td>
          <td><input type="text" data-lien="o12.allies.${i}.apport" value="${esc(c.apport)}" placeholder="Expertise, réseau, nombre, moyens"></td>
          <td><input type="text" data-lien="o12.allies.${i}.avantages" value="${esc(c.avantages)}" placeholder="…"></td>
          <td><input type="text" data-lien="o12.allies.${i}.risques" value="${esc(c.risques)}" placeholder="…"></td>
          <td><button class="btn mini sup" data-action="tab-sup" data-chemin="o12.allies" data-i="${i}">✕</button></td>
        </tr>`).join('') : '<tr><td colspan="5" class="vide">Aucun allié identifié.</td></tr>'}</tbody>
      </table></div>
      <div class="barre-actions">
        <button class="btn plein" data-action="add-objet" data-chemin="o12.allies" data-modele="allie">Ajouter un allié</button>
      </div>
    </div>`;
  },

  /* 13 — Construire un message */
  message() {
    const m = S.o13.messages;
    return `${m.length ? m.map((x, i) => `<div class="bloc">
      <span class="eyebrow">Message ${i + 1}</span>
      <div class="grille g2" style="margin-top:12px">
        <div>
          ${champ(`o13.messages.${i}.accroche`, 'Une accroche', 'Une statistique proche des gens, une image, « chaque seconde… »', 2)}
          ${champ(`o13.messages.${i}.probleme`, 'Le problème est que…', 'En une phrase simple', 2)}
          ${champ(`o13.messages.${i}.importance`, 'C’est important parce que…', 'Pour la cible, et pourquoi maintenant', 2)}
        </div>
        <div>
          ${champ(`o13.messages.${i}.cible`, 'Nous voulons que… (la cible)', 'À qui parlons-nous ?', 2)}
          ${champ(`o13.messages.${i}.action`, 'Fasse… (l’action demandée)', 'La demande précise. Sans elle, c’est de la sensibilisation.', 2)}
          ${champ(`o13.messages.${i}.usage`, 'Usage prévu', 'Affiche, rencontre lobby, communiqué, interview…', 0)}
        </div>
      </div>
      <div class="msg-rendu" style="margin-top:16px">
        ${[['Accroche', x.accroche], ['Le problème', x.probleme], ['Pourquoi c’est important', x.importance], ['La cible', x.cible], ['L’action demandée', x.action]]
          .map(([l, v]) => `<div class="ligne"><span class="eyebrow">${l}</span><p>${nonVide(v) ? esc(v) : '<span class="vide">—</span>'}</p></div>`).join('')}
      </div>
      <div class="barre-actions">
        <button class="btn" data-action="copier-message" data-i="${i}">Copier le message</button>
        <button class="btn sup" data-action="tab-sup" data-chemin="o13.messages" data-i="${i}">Supprimer</button>
      </div>
    </div>`).join('') : '<p class="vide">Aucun message préparé.</p>'}
    <div class="barre-actions">
      <button class="btn plein" data-action="add-objet" data-chemin="o13.messages" data-modele="message">Ajouter un message</button>
    </div>
    <div class="notice" style="margin-top:18px">Préparez-en plusieurs : on n’utilise pas le même morceau selon le support. Sur une affiche, c’est l’accroche ; en rencontre, c’est le « pourquoi maintenant » du décideur.</div>`;
  },

  /* 14 — Check-list de la rencontre */
  rencontre() {
    const bloc = (cle, titre) => `<div class="bloc">
      <h3>${titre}</h3>
      <ul class="check">${CHECKLIST[cle].map((t, i) => {
        const ok = (S.o14[cle] || []).includes(i);
        return `<li class="${ok ? 'ok' : ''}"><input type="checkbox" id="${cle}${i}" data-action="check" data-cle="${cle}" data-i="${i}" ${ok ? 'checked' : ''}>
          <label for="${cle}${i}">${esc(t)}</label></li>`;
      }).join('')}</ul></div>`;
    return `${bloc('avant', 'Avant la rencontre')}${bloc('pendant', 'Pendant')}${bloc('apres', 'Après')}
    <div class="bloc">
      <h3>Comptes rendus</h3>
      ${S.o14.comptes.length ? S.o14.comptes.map((c, i) => `<div style="border-top:1px solid var(--rule);padding-top:14px;margin-top:14px">
        <div class="grille g2">
          <div>${champ(`o14.comptes.${i}.date`, 'Date', '', 0)}${champ(`o14.comptes.${i}.qui`, 'Rencontré·e', 'Nom, fonction', 0)}</div>
          <div>${champ(`o14.comptes.${i}.engagement`, 'Engagement obtenu', 'Ce qui a été promis, même vaguement', 0)}${champ(`o14.comptes.${i}.suite`, 'Prochaine échéance', '', 0)}</div>
        </div>
        ${champ(`o14.comptes.${i}.resume`, 'Ce qui s’est dit — et les résistances entendues', 'Les objections sont vos arguments de la prochaine fois.', 3)}
        <button class="btn mini sup" data-action="tab-sup" data-chemin="o14.comptes" data-i="${i}">Supprimer ce compte rendu</button>
      </div>`).join('') : '<p class="vide">Aucun compte rendu.</p>'}
      <div class="barre-actions"><button class="btn plein" data-action="add-objet" data-chemin="o14.comptes" data-modele="compte">Ajouter un compte rendu</button></div>
    </div>`;
  },

  /* 15 — Suivi et évaluation */
  suivi() {
    const q = outil(15).questions;
    return `
    <div class="bloc">
      <h3>Journal de bord</h3>
      <div class="tab-scroll"><table class="tab">
        <thead><tr><th>Date</th><th>Objectif</th><th>Action</th><th>Résultat</th><th>Qui</th><th></th></tr></thead>
        <tbody>${S.o15.journal.length ? S.o15.journal.map((j, i) => `<tr>
          <td style="min-width:120px"><input type="text" data-lien="o15.journal.${i}.date" value="${esc(j.date)}"></td>
          <td><input type="text" data-lien="o15.journal.${i}.objectif" value="${esc(j.objectif)}" placeholder="…"></td>
          <td><input type="text" data-lien="o15.journal.${i}.action" value="${esc(j.action)}" placeholder="…"></td>
          <td><input type="text" data-lien="o15.journal.${i}.resultat" value="${esc(j.resultat)}" placeholder="…"></td>
          <td><input type="text" data-lien="o15.journal.${i}.personnes" value="${esc(j.personnes)}" placeholder="…"></td>
          <td><button class="btn mini sup" data-action="tab-sup" data-chemin="o15.journal" data-i="${i}">✕</button></td>
        </tr>`).join('') : '<tr><td colspan="6" class="vide">Journal vide.</td></tr>'}</tbody>
      </table></div>
      <div class="barre-actions"><button class="btn plein" data-action="add-objet" data-chemin="o15.journal" data-modele="journal">Ajouter une entrée</button></div>
    </div>

    <div class="bloc">
      <h3>Indicateurs et petites étapes</h3>
      <p class="lede" style="font-size:.95rem">Découpez chaque objectif en étapes aussi petites que possible : c’est ce qui rend le progrès visible quand la décision, elle, met deux ans.</p>
      ${S.o15.indicateurs.length ? S.o15.indicateurs.map((ind, i) => `<div style="border-top:1px solid var(--rule);padding-top:14px;margin-top:14px">
        ${champ(`o15.indicateurs.${i}.libelle`, 'Indicateur', 'Ex. : nombre de conseiller·ères communaux rencontré·es', 0)}
        <ul class="check">${(ind.etapes || []).map((e, j) => `<li class="${e.fait ? 'ok' : ''}">
          <input type="checkbox" id="ind${i}-${j}" data-action="etape" data-i="${i}" data-j="${j}" ${e.fait ? 'checked' : ''}>
          <label for="ind${i}-${j}">${esc(e.txt)}</label>
          <button class="btn mini sup" data-action="etape-sup" data-i="${i}" data-j="${j}">✕</button></li>`).join('')}</ul>
        <div class="ajout"><input type="text" data-etape="${i}" placeholder="Ajouter une étape…">
          <button class="btn" data-action="etape-add" data-i="${i}">Ajouter</button></div>
        <div class="barre-actions"><button class="btn mini sup" data-action="tab-sup" data-chemin="o15.indicateurs" data-i="${i}">Supprimer l’indicateur</button></div>
      </div>`).join('') : '<p class="vide">Aucun indicateur.</p>'}
      <div class="barre-actions"><button class="btn plein" data-action="add-objet" data-chemin="o15.indicateurs" data-modele="indicateur">Ajouter un indicateur</button></div>
    </div>

    <div class="bloc">
      <h3>L’évaluation</h3>
      ${q.map((x, i) => champ(`o15.evaluation.q${i}`, x, '', 2)).join('')}
    </div>`;
  }
};

/* ---------- 7. Graphiques ---------- */
function fleurSVG(petales) {
  const cx = 200, cy = 200, n = petales.length;
  let out = `<svg viewBox="0 0 400 400" role="img" aria-label="Fleur de pouvoir">`;
  petales.forEach((p, i) => {
    const ang = (360 / n) * i - 90;
    const rad = ang * Math.PI / 180;
    const px = cx + Math.cos(rad) * 92, py = cy + Math.sin(rad) * 92;
    const rempliMoi = nonVide(p.moi), rempliCible = nonVide(p.cible);
    const memeChose = rempliMoi && rempliCible && p.moi.trim().toLowerCase() === p.cible.trim().toLowerCase();
    let fill = 'none', op = '.15';
    if (memeChose) { fill = 'var(--jaune)'; op = '.85'; }
    else if (rempliMoi && rempliCible) { fill = 'var(--rose)'; op = '.5'; }
    else if (rempliMoi) { fill = 'var(--bleu)'; op = '.45'; }
    out += `<g transform="translate(${px} ${py}) rotate(${ang + 90})">
      <ellipse rx="52" ry="76" fill="${fill}" fill-opacity="${op}" stroke="var(--ink)" stroke-width="2"/>
    </g>`;
    const lx = cx + Math.cos(rad) * 92, ly = cy + Math.sin(rad) * 92;
    out += `<text x="${lx}" y="${ly - 6}" text-anchor="middle" font-size="10" font-family="ui-monospace,monospace"
      letter-spacing="1" fill="var(--ink)">${esc(p.cat.toUpperCase().slice(0, 14))}</text>`;
    out += `<text x="${lx}" y="${ly + 10}" text-anchor="middle" font-size="11" font-weight="700" fill="var(--bleu)">${esc((p.moi || '').slice(0, 16))}</text>`;
    out += `<text x="${lx}" y="${ly + 24}" text-anchor="middle" font-size="11" font-weight="700" fill="var(--rose)">${esc((p.cible || '').slice(0, 16))}</text>`;
  });
  out += `<circle cx="${cx}" cy="${cy}" r="46" fill="var(--paper-2)" stroke="var(--ink)" stroke-width="2"/>
    <text x="${cx}" y="${cy - 4}" text-anchor="middle" font-size="12" font-family="ui-monospace,monospace" fill="var(--ink)">FLEUR DE</text>
    <text x="${cx}" y="${cy + 12}" text-anchor="middle" font-size="12" font-family="ui-monospace,monospace" fill="var(--ink)">POUVOIR</text></svg>`;
  return out;
}

function matriceSVG(acteurs) {
  const pts = acteurs.filter(a => nonVide(a.nom)).map(a => {
    const inf = Math.min(5, Math.max(1, Number(a.influence) || 3));
    const int = Math.min(5, Math.max(1, Number(a.interet) || 3));
    const x = ((inf - 1) / 4) * 84 + 8;
    const y = 92 - ((int - 1) / 4) * 84;
    return `<div class="pt-acteur ${esc(a.position || 'indecis')}" style="left:${x}%;top:${y}%"><i></i><b>${esc(a.nom)}</b></div>`;
  }).join('');
  return `<div class="matrice">
    <div class="axe h"></div><div class="axe v"></div>
    <div class="quad" style="top:0;right:0;text-align:right">Fort intérêt · forte influence<br>→ priorité</div>
    <div class="quad" style="top:0;left:0">Fort intérêt · faible influence<br>→ allié·e·s de terrain</div>
    <div class="quad" style="bottom:0;right:0;text-align:right">Faible intérêt · forte influence<br>→ à intéresser</div>
    <div class="quad" style="bottom:0;left:0">Faible intérêt · faible influence<br>→ à surveiller</div>
    ${pts || '<div class="quad" style="top:46%;left:50%;transform:translateX(-50%)">Ajoutez des acteurs pour les voir apparaître</div>'}
  </div>`;
}

/* ---------- 8. Vues ---------- */
function vueAccueil() {
  const faits = totalFaits();
  const parPartie = k => OUTILS.filter(o => o.partie === k);
  const largeur = k => (parPartie(k).filter(o => estFait(o.id)).length / 15) * 100;
  return `
  <div class="hero">
    <span class="eyebrow">Poste de travail du plaidoyer citoyen · 15 outils</span>
    <h1><span class="b">Voir</span>, <span class="r">juger</span>, <span class="j">agir</span></h1>
    <p class="lede">Un guide et un atelier. Chaque outil vous donne sa fiche méthodologique, puis un espace pour la remplir sur votre propre cause. Tout est enregistré sur votre appareil, et fonctionne sans connexion.</p>
    <div class="cycle">${CYCLE.map(c => `<span>${c}</span>`).join('')}</div>
  </div>

  <div class="bloc ombre">
    <span class="eyebrow">Votre dossier</span>
    <div class="grille g3" style="margin-top:12px">
      ${champ('meta.titre', 'Nom du plaidoyer', 'Ex. : Une rue apaisée devant l’école', 0)}
      ${champ('meta.cause', 'La cause en une ligne', 'Ce que vous voulez changer', 0)}
      ${champ('meta.collectif', 'Collectif ou organisation', 'Qui porte ce plaidoyer', 0)}
    </div>
    <div style="margin-top:6px">
      <div class="jauge" role="img" aria-label="${faits} outils sur 15 renseignés">
        <i class="bleu" style="width:${largeur('voir')}%"></i>
        <i class="rose" style="width:${largeur('juger')}%"></i>
        <i class="jaune" style="width:${largeur('agir')}%"></i>
      </div>
      <p class="eyebrow" style="margin-top:8px">${faits} outil${faits > 1 ? 's' : ''} sur 15 renseigné${faits > 1 ? 's' : ''}</p>
    </div>
    <div class="domino">
      ${OUTILS.map(o => `<a class="domino-piece ${encreDe(o.id)} ${estFait(o.id) ? 'fait' : ''}" href="#/outil/${o.id}" title="${esc(o.titre)}">
        <span class="num">${String(o.id).padStart(2, '0')}</span>
        <span class="pt">${estFait(o.id) ? '●' : '○'}</span>
      </a>`).join('')}
    </div>
  </div>

  <div class="cartes-parties">
    ${Object.values(PARTIES).map(p => `<div class="carte-partie">
      <div class="bandeau ${p.encre}"></div>
      <span class="eyebrow">Partie ${p.num} · ${esc(p.accroche)}</span>
      <h2>${esc(p.titre)}</h2>
      <p>${esc(p.intro)}</p>
      <div class="barre-actions"><a class="btn" href="#/outil/${parPartie(p.cle)[0].id}">Commencer</a></div>
    </div>`).join('')}
  </div>

  <div class="bloc" style="margin-top:26px">
    <h3>Vos données</h3>
    <p class="lede" style="font-size:.95rem">Rien ne quitte cet appareil. Exportez pour partager le dossier avec votre collectif ou le sauvegarder.</p>
    <div class="barre-actions">
      <button class="btn plein" data-action="exporter">Exporter (fichier .json)</button>
      <button class="btn" data-action="importer">Importer un dossier</button>
      <a class="btn" href="#/dossier">Voir le dossier complet</a>
      <button class="btn sup" data-action="effacer">Tout effacer</button>
    </div>
    <input type="file" id="fichier-import" accept="application/json" hidden>
  </div>

  <p class="autosave">Enregistré automatiquement${S.meta.maj ? ' — dernière modification ' + new Date(S.meta.maj).toLocaleString('fr-BE') : ''}</p>
  <p class="source">D’après « Le petit guide du plaidoyer citoyen — 15 outils vers le changement », Commission Justice et Paix (2020), et le manuel de plaidoyer d’ULB-Coopération (2021).</p>`;
}

function vueOutil(id) {
  const o = outil(id);
  if (!o) return vueAccueil();
  const p = PARTIES[o.partie];
  const onglet = etatVue.onglet;
  const suivant = OUTILS.find(x => x.id === id + 1);
  const precedent = OUTILS.find(x => x.id === id - 1);
  return `
  <div class="fil">
    <span class="tag ${p.encre}">Partie ${p.num} · ${esc(p.titre)}</span>
    <span class="tag">Étape : ${esc(o.etape)}</span>
    ${estFait(id) ? '<span class="tag">✓ Renseigné</span>' : ''}
  </div>
  <div class="titre-outil">
    <span class="numero">${String(id).padStart(2, '0')}</span>
    <h1>${esc(o.titre)}</h1>
  </div>
  <p class="sous-titre">${esc(o.resume)}</p>

  <div class="onglets" role="tablist">
    <button class="onglet" role="tab" aria-selected="${onglet === 'guide'}" data-action="onglet" data-onglet="guide">Le guide</button>
    <button class="onglet" role="tab" aria-selected="${onglet === 'atelier'}" data-action="onglet" data-onglet="atelier">L’atelier</button>
  </div>

  <div id="contenu-onglet">${onglet === 'guide' ? blocGuide(o) : (ATELIERS[o.atelier] ? ATELIERS[o.atelier]() : '')}</div>

  <div class="barre-actions" style="margin-top:34px;border-top:2px solid var(--ink);padding-top:18px">
    ${precedent ? `<a class="btn" href="#/outil/${precedent.id}">← ${esc(precedent.titre)}</a>` : '<a class="btn" href="#/">← Accueil</a>'}
    ${suivant ? `<a class="btn plein" href="#/outil/${suivant.id}">${esc(suivant.titre)} →</a>` : '<a class="btn plein" href="#/dossier">Voir le dossier →</a>'}
  </div>
  <p class="autosave">Enregistré automatiquement sur cet appareil.</p>`;
}

function vueDossier() {
  const l = (t, v) => nonVide(v) ? `<h3>${t}</h3><p>${esc(v).replace(/\n/g, '<br>')}</p>` : '';
  const ul = (t, arr) => (arr && arr.length) ? `<h3>${t}</h3><ul>${arr.map(x => `<li>${esc(x)}</li>`).join('')}</ul>` : '';
  const d = S;
  return `<div class="dossier">
    <span class="eyebrow">Dossier de plaidoyer</span>
    <h1 class="display" style="font-size:clamp(32px,7vw,64px);margin:8px 0 6px">${esc(d.meta.titre) || 'Sans titre'}</h1>
    <p class="lede">${esc(d.meta.cause)}${nonVide(d.meta.collectif) ? ' — ' + esc(d.meta.collectif) : ''}</p>
    <div class="barre-actions"><button class="btn plein" data-action="imprimer">Imprimer / PDF</button>
      <button class="btn" data-action="exporter">Exporter en .json</button>
      <a class="btn" href="#/">Retour</a></div>

    <h2>1 · Voir</h2>
    ${l('Pourquoi nous nous engageons', d.o1.pourquoi)}${l('Nos valeurs', d.o1.valeurs)}
    ${l('Le changement visé', d.o1.changements)}${l('Premières actions', d.o1.actions)}
    ${d.o2.equipe.length ? `<h3>L’équipe</h3><ul>${d.o2.equipe.map(m => `<li>${esc(m.nom)} — ${esc(PROFILS[m.profil] ? PROFILS[m.profil].nom : '')}</li>`).join('')}</ul>` : ''}
    ${d.o3.petales.some(p => nonVide(p.moi)) ? `<h3>Fleur de pouvoir</h3><ul>${d.o3.petales.filter(p => nonVide(p.moi) || nonVide(p.cible)).map(p => `<li>${esc(p.cat)} : nous — ${esc(p.moi) || '—'} / cible — ${esc(p.cible) || '—'}</li>`).join('')}</ul>` : ''}
    ${l('Ce que l’écart change', d.o3.notes)}
    ${d.o4.acteurs.length ? `<h3>Acteur·trice·s</h3><ul>${d.o4.acteurs.map(a => `<li><strong>${esc(a.nom)}</strong> — pouvoir ${esc(a.pouvoir)}, ${esc((POSITIONS.find(p => p.cle === a.position) || {}).nom || '')}, influence ${esc(a.influence)}/5, intérêt ${esc(a.interet)}/5${nonVide(a.notes) ? '. ' + esc(a.notes) : ''}</li>`).join('')}</ul>` : ''}

    <h2>2 · Juger</h2>
    ${l('Valeurs', d.o5.valeurs)}${l('Hypothèses', d.o5.hypotheses)}${l('Vision', d.o5.vision)}${l('Missions', d.o5.missions)}
    ${ul('Conditions à court terme', d.o5.court)}${ul('À moyen terme', d.o5.moyen)}${ul('À long terme', d.o5.long)}
    ${ul('Forces', d.o6.forces)}${ul('Faiblesses', d.o6.faiblesses)}${ul('Opportunités', d.o6.opportunites)}${ul('Menaces', d.o6.menaces)}
    ${PESTEL_AXES.map(a => ul('PESTEL — ' + a.nom, d.o7[a.cle])).join('')}
    ${l('Problème central', d.o8.probleme)}${ul('Causes profondes', d.o8.causes)}${ul('Conséquences', d.o8.consequences)}
    ${l('Objectif', d.o8.objectif)}${ul('Moyens à obtenir', d.o8.moyens)}
    ${nonVide(d.o9.pourquoi[4]) ? `<h3>Cause profonde (5 pourquoi)</h3><p>${esc(d.o9.pourquoi[4])}</p>` : ''}

    <h2>3 · Agir</h2>
    ${ul('Agir avec le pouvoir', d.o10.avec)}${ul('Agir contre', d.o10.contre)}${ul('Agir sans', d.o10.sans)}
    ${d.o11.objectifs.length ? `<h3>Objectifs SMART</h3><ul>${d.o11.objectifs.map(o => `<li>D’ici ${esc(o.temps) || '…'}, obtenir ${esc(o.decision) || '…'} en faisant ${esc(o.action) || '…'} grâce à ${esc(o.moyen) || '…'}.</li>`).join('')}</ul>` : ''}
    ${d.o12.cibles.length ? `<h3>Cibles</h3><ul>${d.o12.cibles.map(c => `<li><strong>${esc(c.nom)}</strong> — gagne : ${esc(c.gagne) || '—'} ; perd : ${esc(c.perd) || '—'} ; argument : ${esc(c.argument) || '—'}</li>`).join('')}</ul>` : ''}
    ${d.o12.allies.length ? `<h3>Allié·e·s</h3><ul>${d.o12.allies.map(c => `<li><strong>${esc(c.nom)}</strong> — apporte ${esc(c.apport) || '—'} ; risques : ${esc(c.risques) || '—'}</li>`).join('')}</ul>` : ''}
    ${d.o13.messages.length ? `<h3>Messages</h3>${d.o13.messages.map(m => `<p><em>${esc(m.accroche)}</em><br>${esc(m.probleme)}<br>${esc(m.importance)}<br><strong>${esc(m.cible)}</strong> : ${esc(m.action)}</p>`).join('')}` : ''}
    ${d.o14.comptes.length ? `<h3>Rencontres</h3><ul>${d.o14.comptes.map(c => `<li>${esc(c.date)} — ${esc(c.qui)} : ${esc(c.resume)} <em>${esc(c.engagement)}</em></li>`).join('')}</ul>` : ''}
    ${d.o15.journal.length ? `<h3>Journal de bord</h3><ul>${d.o15.journal.map(j => `<li>${esc(j.date)} — ${esc(j.action)} → ${esc(j.resultat)}</li>`).join('')}</ul>` : ''}

    <p class="source">Généré par l’Atelier plaidoyer. Outils d’après la Commission Justice et Paix et ULB-Coopération.</p>
  </div>`;
}

/* ---------- 9. Rail de navigation ---------- */
function railHTML() {
  const groupes = Object.values(PARTIES).map(p => `
    <div class="nav-groupe">
      <div class="nav-titre"><span class="pastille ${p.encre}"></span> Partie ${p.num} — <b>${esc(p.titre)}</b></div>
      ${OUTILS.filter(o => o.partie === p.cle).map(o => `
        <a class="nav-lien ${estFait(o.id) ? 'fait' : ''}" href="#/outil/${o.id}">
          <span class="n">${String(o.id).padStart(2, '0')}</span><span>${esc(o.titre)}</span></a>`).join('')}
    </div>`).join('');
  return `
    <div class="rail-marque">
      <span class="eyebrow">Plaidoyer citoyen</span>
      <div class="display">Atelier</div>
    </div>
    <div class="rail-projet">
      <label><span class="eyebrow" style="color:#9C9A8E">Dossier en cours</span>
      <input type="text" data-lien="meta.titre" value="${esc(S.meta.titre)}" placeholder="Sans titre"></label>
    </div>
    <a class="nav-lien" href="#/"><span class="n">◧</span><span>Tableau de bord</span></a>
    <div class="nav-sep"></div>
    ${groupes}
    <div class="nav-sep"></div>
    <a class="nav-lien" href="#/dossier"><span class="n">▤</span><span>Dossier complet</span></a>`;
}

function majRail() {
  const r = $('.rail');
  if (!r) return;
  const focus = document.activeElement;
  if (focus && r.contains(focus)) return; /* ne pas casser la frappe */
  r.innerHTML = railHTML();
  marquerCourant();
}
function marquerCourant() {
  $$('.rail .nav-lien').forEach(a => {
    if (a.getAttribute('href') === location.hash || (location.hash === '' && a.getAttribute('href') === '#/'))
      a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
}

/* ---------- 10. Routage ---------- */
const etatVue = { onglet: 'guide' };

function router() {
  const h = location.hash || '#/';
  const m = h.match(/#\/outil\/(\d+)/);
  let html;
  if (m) {
    const id = Number(m[1]);
    if (etatVue.dernierOutil !== id) { etatVue.onglet = 'guide'; etatVue.dernierOutil = id; }
    html = vueOutil(id);
  } else if (h.startsWith('#/dossier')) html = vueDossier();
  else html = vueAccueil();
  const zone = $('.main');
  if (!zone) return;
  zone.innerHTML = html;
  window.scrollTo(0, 0);
  document.body.classList.remove('drawer-ouvert');
  majRail();
  marquerCourant();
}

function rafraichirAtelier() {
  const m = location.hash.match(/#\/outil\/(\d+)/);
  if (!m || etatVue.onglet !== 'atelier') { router(); return; }
  const o = outil(Number(m[1]));
  const zone = $('#contenu-onglet');
  if (!zone) { router(); return; }

  /* mémoriser le champ en cours pour ne pas éjecter la personne qui tape */
  const actif = document.activeElement;
  const lien = actif && actif.dataset ? actif.dataset.lien : null;
  let curseur = null;
  try { curseur = actif && actif.selectionStart; } catch (e) { }

  zone.innerHTML = ATELIERS[o.atelier] ? ATELIERS[o.atelier]() : '';

  if (lien) {
    const n = zone.querySelector(`[data-lien="${lien}"]`);
    if (n) { n.focus(); try { if (curseur != null) n.setSelectionRange(curseur, curseur); } catch (e) { } }
  }
  majRail();
}

/* Redessine un seul graphique, sans toucher aux champs de saisie. */
function majGraphique(nom) {
  if (nom === 'fleur') {
    const c = $('#graph-fleur');
    if (c) c.innerHTML = fleurSVG(S.o3.petales);
  } else if (nom === 'matrice') {
    const c = $('#graph-matrice');
    if (c) c.innerHTML = matriceSVG(S.o4.acteurs);
  }
}

/* ---------- 11. Modèles d'objets ---------- */
const MODELES = {
  membre: () => ({ id: uid(), nom: '', profil: 'a' }),
  acteur: () => ({ id: uid(), nom: '', pouvoir: 'politique', position: 'indecis', influence: 3, interet: 3, notes: '' }),
  objectif: () => ({ id: uid(), temps: '', decision: '', action: '', moyen: '', crits: [] }),
  cible: () => ({ id: uid(), nom: '', gagne: '', perd: '', argument: '' }),
  allie: () => ({ id: uid(), nom: '', apport: '', avantages: '', risques: '' }),
  message: () => ({ id: uid(), accroche: '', probleme: '', importance: '', cible: '', action: '', usage: '' }),
  compte: () => ({ id: uid(), date: new Date().toLocaleDateString('fr-BE'), qui: '', resume: '', engagement: '', suite: '' }),
  journal: () => ({ id: uid(), date: new Date().toLocaleDateString('fr-BE'), objectif: '', action: '', resultat: '', personnes: '' }),
  indicateur: () => ({ id: uid(), libelle: '', etapes: [] })
};

/* ---------- 12. Événements ---------- */
document.addEventListener('input', e => {
  const t = e.target;
  if (!t.dataset || !t.dataset.lien) return;
  let v = t.value;
  if (t.type === 'number') v = v === '' ? '' : Number(v);
  ecrire(t.dataset.lien, v);
  sauver();
  if (t.dataset.graph) majGraphique(t.dataset.graph);
});

document.addEventListener('change', e => {
  const t = e.target;
  if (!t.dataset || !t.dataset.lien) return;
  if (t.tagName === 'SELECT' || t.dataset.rerender === '1') {
    ecrire(t.dataset.lien, t.value);
    sauver(true);
    if (t.dataset.graph) majGraphique(t.dataset.graph);
    else if (t.dataset.rerender === '1') rafraichirAtelier();
  }
});

document.addEventListener('keydown', e => {
  if (e.key === 'Enter' && e.target.dataset && e.target.dataset.ajout) {
    e.preventDefault();
    ajouterItem(e.target.dataset.ajout, e.target.value);
    e.target.value = '';
  }
  if (e.key === 'Enter' && e.target.dataset && e.target.dataset.etape !== undefined && e.target.dataset.etape !== '') {
    e.preventDefault();
    ajouterEtape(Number(e.target.dataset.etape), e.target.value);
  }
});

function ajouterItem(chemin, valeur) {
  const v = String(valeur || '').trim();
  if (!v) return;
  lire(chemin).push(v);
  sauver(true);
  rafraichirAtelier();
}
function ajouterEtape(i, valeur) {
  const v = String(valeur || '').trim();
  if (!v) return;
  S.o15.indicateurs[i].etapes.push({ txt: v, fait: false });
  sauver(true);
  rafraichirAtelier();
}

document.addEventListener('click', e => {
  const b = e.target.closest('[data-action]');
  if (!b) return;
  const a = b.dataset.action;

  if (a === 'onglet') { etatVue.onglet = b.dataset.onglet; router(); return; }

  if (a === 'liste-add') {
    const champ = $(`[data-ajout="${b.dataset.chemin}"]`);
    ajouterItem(b.dataset.chemin, champ ? champ.value : '');
    return;
  }
  if (a === 'liste-sup') {
    lire(b.dataset.chemin).splice(Number(b.dataset.i), 1);
    sauver(true); rafraichirAtelier(); return;
  }
  if (a === 'add-objet') {
    lire(b.dataset.chemin).push(MODELES[b.dataset.modele]());
    sauver(true); rafraichirAtelier(); return;
  }
  if (a === 'tab-sup') {
    lire(b.dataset.chemin).splice(Number(b.dataset.i), 1);
    sauver(true); rafraichirAtelier(); return;
  }
  if (a === 'quiz-reset') { S.o2.reponses = Array(7).fill(null); sauver(true); rafraichirAtelier(); return; }
  if (a === 'quiz-vers-equipe') {
    S.o2.equipe.push({ id: uid(), nom: '', profil: b.dataset.profil });
    sauver(true); rafraichirAtelier(); toast('Profil ajouté — nommez la personne'); return;
  }
  if (a === 'ordre') return;
  if (a === 'positiver') {
    if (!nonVide(S.o8.objectif) && nonVide(S.o8.probleme)) S.o8.objectif = S.o8.probleme;
    S.o8.causes.forEach(c => { if (!S.o8.moyens.includes(c)) S.o8.moyens.push(c); });
    S.o8.consequences.forEach(c => { if (!S.o8.finalites.includes(c)) S.o8.finalites.push(c); });
    sauver(true); rafraichirAtelier();
    toast('Recopié — à vous de reformuler en positif'); return;
  }
  if (a === 'importer-indecis') {
    S.o4.acteurs.filter(x => x.position === 'indecis' && nonVide(x.nom)).forEach(x => {
      if (!S.o12.cibles.some(c => c.nom === x.nom))
        S.o12.cibles.push({ id: uid(), nom: x.nom, gagne: '', perd: '', argument: '' });
    });
    sauver(true); rafraichirAtelier(); return;
  }
  if (a === 'etape-add') { const ch = $(`[data-etape="${b.dataset.i}"]`); ajouterEtape(Number(b.dataset.i), ch ? ch.value : ''); return; }
  if (a === 'etape-sup') {
    S.o15.indicateurs[Number(b.dataset.i)].etapes.splice(Number(b.dataset.j), 1);
    sauver(true); rafraichirAtelier(); return;
  }
  if (a === 'copier-message') {
    const m = S.o13.messages[Number(b.dataset.i)];
    const txt = [m.accroche, m.probleme, m.importance, `${m.cible} : ${m.action}`].filter(nonVide).join('\n\n');
    navigator.clipboard?.writeText(txt).then(() => toast('Message copié'), () => toast('Copie impossible'));
    return;
  }
  if (a === 'exporter') {
    const nom = (S.meta.titre || 'plaidoyer').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const blob = new Blob([JSON.stringify(S, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a2 = document.createElement('a');
    a2.href = url; a2.download = `dossier-${nom || 'plaidoyer'}.json`; a2.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast('Dossier exporté'); return;
  }
  if (a === 'importer') { $('#fichier-import').click(); return; }
  if (a === 'effacer') {
    if (confirm('Effacer tout le dossier ? Cette action est définitive. Pensez à exporter d’abord.')) {
      S = vierge(); sauver(true); router(); toast('Dossier effacé');
    }
    return;
  }
  if (a === 'imprimer') { window.print(); return; }
  if (a === 'menu') { document.body.classList.toggle('drawer-ouvert'); return; }
  if (a === 'fermer-menu') { document.body.classList.remove('drawer-ouvert'); return; }
  if (a === 'installer') { lancerInstallation(); return; }
});

/* radios, cases à cocher */
document.addEventListener('change', e => {
  const t = e.target;
  const a = t.dataset.action;
  if (a === 'quiz') { S.o2.reponses[Number(t.dataset.i)] = t.value; sauver(true); rafraichirAtelier(); }
  if (a === 'ordre') {
    const set = new Set(S.o5.ordres || []);
    t.checked ? set.add(t.value) : set.delete(t.value);
    S.o5.ordres = Array.from(set).sort(); sauver(true); rafraichirAtelier();
  }
  if (a === 'check') {
    const cle = t.dataset.cle, i = Number(t.dataset.i);
    const set = new Set(S.o14[cle] || []);
    t.checked ? set.add(i) : set.delete(i);
    S.o14[cle] = Array.from(set); sauver(true); rafraichirAtelier();
  }
  if (a === 'etape') {
    S.o15.indicateurs[Number(t.dataset.i)].etapes[Number(t.dataset.j)].fait = t.checked;
    sauver(true); rafraichirAtelier();
  }
  if (a === 'smart-crit') {
    const o = S.o11.objectifs[Number(t.dataset.i)];
    const set = new Set(o.crits || []);
    t.checked ? set.add(t.dataset.k) : set.delete(t.dataset.k);
    o.crits = Array.from(set); sauver(true);
  }
});

document.addEventListener('change', e => {
  if (e.target.id !== 'fichier-import') return;
  const f = e.target.files[0];
  if (!f) return;
  const fr = new FileReader();
  fr.onload = () => {
    try {
      S = fusion(vierge(), JSON.parse(fr.result));
      sauver(true); router(); toast('Dossier importé');
    } catch (err) { toast('Fichier illisible'); }
  };
  fr.readAsText(f);
});

window.addEventListener('hashchange', router);

/* ---------- 13. Installation PWA ---------- */
let promesseInstall = null;
window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault(); promesseInstall = e;
  const b = $('#btn-installer'); if (b) b.hidden = false;
});
function lancerInstallation() {
  if (!promesseInstall) { toast('Utilisez « Ajouter à l’écran d’accueil » dans votre navigateur'); return; }
  promesseInstall.prompt();
  promesseInstall.userChoice.finally(() => { promesseInstall = null; const b = $('#btn-installer'); if (b) b.hidden = true; });
}

/* ---------- 14. Démarrage ---------- */
charger();
majRail();
router();

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => { /* hors-ligne indisponible en local file:// */ });
  });
}
