/* ==================================================================
   ATELIERS — la partie « outil » de chaque fiche
   ================================================================== */
import {
  QUIZ, PROFILS, PETALES, POUVOIRS, NIVEAUX_POUVOIR, POSITIONS, PESTEL_AXES, CHECKLIST,
  CRITERES, STRATEGIES, THEORIES, TYPO_ALLIES, VIE_ALLIANCE, MEDIA_QUESTIONS,
  ACCROCHES_MEDIA, INTERVIEW, PETITION_CRITERES, MOBILISATION_OUTILS, NIVEAUX_ENGAGEMENT, OUTILS
} from './content.js';
import { data, lire, uid } from './store.js';
import { esc, plein, champ, selecteurChamp, liste, coches, bouton, ico, videMsg } from './ui.js';

/* ---------- modèles d'objets ---------- */
export const MODELES = {
  membre: () => ({ id: uid(), nom: '', profil: 'a' }),
  acteur: () => ({ id: uid(), nom: '', pouvoir: 'politique', niveau: 'communal', position: 'indecis', influence: 3, interet: 3, rang: 'principale', notes: '' }),
  objectif: () => ({ id: uid(), temps: '', decision: '', action: '', moyen: '', crits: [] }),
  cible: () => ({ id: uid(), nom: '', niveau: '1', gagne: '', perd: '', argument: '' }),
  allie: () => ({ id: uid(), nom: '', apport: '', avantages: '', risques: '' }),
  message: () => ({ id: uid(), accroche: '', probleme: '', importance: '', cible: '', action: '', usage: '' }),
  compte: () => ({ id: uid(), date: new Date().toISOString().slice(0, 10), qui: '', resume: '', engagement: '', suite: '' }),
  journal: () => ({ id: uid(), date: new Date().toISOString().slice(0, 10), objectif: '', action: '', resultat: '', personnes: '' }),
  indicateur: () => ({ id: uid(), libelle: '', etapes: [] }),
  echeance: () => ({ id: uid(), date: '', quoi: '', niveau: 'communal', prise: '' }),
  axe: () => ({ id: uid(), libelle: '', cause: '', notes: {} }),
  fiche: () => ({
    id: uid(), nom: '', representant: '', objectifs: '', interet: '', soutien: '', influence: '',
    connaissance: '', action: '', acces: '', detonateur: '', langage: '', canaux: '', comptes: ''
  }),
  partenaire: () => ({ id: uid(), nom: '', type: 'secondaire', apport: '', contact: '', cible: '' }),
  media: () => ({ id: uid(), nom: '', audience: '', ligne: '', journaliste: '', passe: '', risque: 'moyen' }),
  actionMob: () => ({ id: uid(), type: "L'événement", quoi: '', date: '', qui: '' })
};

/* ================================================================ */
/*  1 — Domino du changement                                        */
/* ================================================================ */
function domino() {
  const cases = [
    ['pourquoi', "Pourquoi voulons-nous nous engager ?", "Ce qui nous met en mouvement, ce que nous ne supportons plus…"],
    ['valeurs', "Quelles valeurs portons-nous ?", "Solidarité, justice, dignité, action collective…"],
    ['changements', "Quels changements voulons-nous voir ?", "Le futur visé, formulé au présent"],
    ['actions', "Quelles actions pourrions-nous mener ?", "Premières pistes concrètes"]
  ];
  return `<div class="encadre info"><span class="surtitre">Comment faire</span>
    <p>Chaque réponse fait tomber la suivante. Écrivez d'un trait : ce domino se relit à plusieurs, et c'est la comparaison qui le rend utile.</p></div>
  <div class="grille g2" style="margin-top:16px">
    ${cases.map(([k, l, p], i) => `<div class="carte">
      <span class="surtitre">Domino ${i + 1} sur 4</span>
      <div style="margin-top:10px">${champ('o1.' + k, l, { ph: p, lignes: 4 })}</div>
    </div>`).join('')}
  </div>`;
}

/* ================================================================ */
/*  2 — Quel est mon profil ?                                       */
/* ================================================================ */
function profil() {
  const d = data().o2;
  const scores = { a: 0, b: 0, c: 0 };
  d.reponses.forEach(r => { if (r) scores[r]++; });
  const complet = d.reponses.filter(r => r).length === 7;
  const gagnant = complet ? Object.keys(scores).sort((x, y) => scores[y] - scores[x])[0] : null;
  const compte = { a: 0, b: 0, c: 0 };
  d.equipe.forEach(m => { if (compte[m.profil] !== undefined) compte[m.profil]++; });
  const manquants = Object.keys(PROFILS).filter(k => !compte[k]);

  return `<div class="grille" style="grid-template-columns:minmax(0,1fr);gap:16px">
    <div class="carte">
      <div class="carte-tete"><h3>Le test</h3><span class="surtitre">${d.reponses.filter(r => r).length} / 7</span></div>
      ${QUIZ.map((q, i) => `<fieldset style="border:0;padding:0;margin:0 0 14px">
        <legend style="font-variation-settings:'wght' 600;font-size:.95rem;margin-bottom:5px">${i + 1}. ${esc(q.q)}</legend>
        ${q.r.map((t, j) => {
          const cle = ['a', 'b', 'c'][j];
          return `<label class="coche"><input type="radio" name="q${i}" value="${cle}" ${d.reponses[i] === cle ? 'checked' : ''}
            data-agir="quiz" data-i="${i}"><span>${esc(t)}</span></label>`;
        }).join('')}
      </fieldset>`).join('')}
      ${complet ? `<div class="encadre" style="margin-top:6px">
          <span class="surtitre">Tendance dominante — ${scores[gagnant]} réponses sur 7</span>
          <p style="font-family:var(--display);font-variation-settings:'wght' 750,'wdth' 88;text-transform:uppercase;font-size:21px;margin:6px 0 6px">${esc(PROFILS[gagnant].nom)}</p>
          <p>${esc(PROFILS[gagnant].txt)}</p>
          <p class="note">Dans l'équipe : ${esc(PROFILS[gagnant].role)}</p>
        </div>
        <div class="rangee fin">
          ${bouton('Ajouter ce profil à l’équipe', 'quiz-equipe', { classe: 'fort', data: { profil: gagnant } })}
          ${bouton('Refaire le test', 'quiz-remise')}
        </div>` : ''}
    </div>

    <div class="carte">
      <h3>L’équipe</h3>
      ${d.equipe.length ? `<div class="defile"><table class="tableau">
        <thead><tr><th>Personne</th><th>Profil</th><th></th></tr></thead>
        <tbody>${d.equipe.map((m, i) => `<tr>
          <td><input type="text" data-lien="o2.equipe.${i}.nom" value="${esc(m.nom)}" placeholder="Prénom" aria-label="Prénom"></td>
          <td><select data-lien="o2.equipe.${i}.profil" data-rendu="1" aria-label="Profil">
            ${Object.values(PROFILS).map(p => `<option value="${p.cle}"${m.profil === p.cle ? ' selected' : ''}>${esc(p.nom)}</option>`).join('')}
          </select></td>
          <td style="width:36px"><button class="bouton discret petit" data-agir="retirer" data-chemin="o2.equipe" data-i="${i}" aria-label="Retirer">${ico('croix', 13)}</button></td>
        </tr>`).join('')}</tbody></table></div>`
        : videMsg('Personne pour l’instant', 'Ajoutez les membres du collectif pour voir l’équilibre des profils.')}
      <div class="rangee fin">${bouton('Ajouter une personne', 'ajouter-objet', { ico: 'plus', data: { chemin: 'o2.equipe', modele: 'membre' } })}</div>
      ${d.equipe.length ? (manquants.length
        ? `<div class="encadre alerte" style="margin-top:16px"><span class="surtitre">Déséquilibre</span>
            <p>Aucun profil <strong>${manquants.map(k => PROFILS[k].nom.toLowerCase()).join(' ni ')}</strong>.
            ${esc(manquants.map(k => PROFILS[k].role).join(' '))} Qui prend ce rôle ?</p></div>`
        : `<div class="encadre info" style="margin-top:16px"><span class="surtitre">Équilibre</span>
            <p>Les trois profils sont là. Vérifiez que les rôles sont attribués explicitement, pas seulement présents.</p></div>`) : ''}
    </div>
  </div>`;
}

/* ================================================================ */
/*  3 — Fleur de pouvoir                                            */
/* ================================================================ */
export function fleurSVG(petales) {
  const cx = 200, cy = 196, n = petales.length;
  let out = `<svg viewBox="0 0 400 392" class="fleur-svg" role="img" aria-label="Fleur de pouvoir">`;
  petales.forEach((p, i) => {
    const ang = (360 / n) * i - 90, rad = ang * Math.PI / 180;
    const px = cx + Math.cos(rad) * 88, py = cy + Math.sin(rad) * 88;
    const m = plein(p.moi), c = plein(p.cible);
    const meme = m && c && p.moi.trim().toLowerCase() === p.cible.trim().toLowerCase();
    let fill = 'var(--tenu)', op = '.07';
    if (meme) { fill = 'var(--agir)'; op = '.55'; }
    else if (m && c) { fill = 'var(--juger)'; op = '.30'; }
    else if (m) { fill = 'var(--voir)'; op = '.24'; }
    out += `<g transform="translate(${px} ${py}) rotate(${ang + 90})">
      <ellipse class="petale" rx="50" ry="74" fill="${fill}" fill-opacity="${op}" stroke="var(--bord-doux)" stroke-width="1.5"/></g>`;
    out += `<text x="${px}" y="${py - 8}" text-anchor="middle" font-size="9.5" font-family="var(--mono)"
      letter-spacing="1.1" fill="var(--tenu)">${esc(p.cat.toUpperCase().slice(0, 15))}</text>`;
    out += `<text x="${px}" y="${py + 8}" text-anchor="middle" font-size="12" font-weight="600" fill="var(--voir)">${esc((p.moi || '').slice(0, 15))}</text>`;
    out += `<text x="${px}" y="${py + 24}" text-anchor="middle" font-size="12" font-weight="600" fill="var(--juger)">${esc((p.cible || '').slice(0, 15))}</text>`;
  });
  out += `<circle cx="${cx}" cy="${cy}" r="44" fill="var(--surface)" stroke="var(--bord-doux)" stroke-width="1.5"/>
    <text x="${cx}" y="${cy - 3}" text-anchor="middle" font-size="11" font-family="var(--mono)" fill="var(--doux)">FLEUR DE</text>
    <text x="${cx}" y="${cy + 12}" text-anchor="middle" font-size="11" font-family="var(--mono)" fill="var(--doux)">POUVOIR</text></svg>`;
  return out;
}

function fleur() {
  const p = data().o3.petales;
  const ecarts = p.filter(x => plein(x.moi) && plein(x.cible) && x.moi.trim().toLowerCase() !== x.cible.trim().toLowerCase()).length;
  const communs = p.filter(x => plein(x.moi) && plein(x.cible) && x.moi.trim().toLowerCase() === x.cible.trim().toLowerCase()).length;
  return `<div class="grille g2" style="align-items:start">
    <div class="carte">
      <div id="graph-fleur">${fleurSVG(p)}</div>
      <div class="legende" style="justify-content:center">
        <span><i style="background:var(--voir)"></i>Nous</span>
        <span><i style="background:var(--juger)"></i>La cible</span>
        <span><i style="background:var(--agir)"></i>Terrain commun</span>
      </div>
      ${(ecarts || communs) ? `<p class="note" style="text-align:center;margin-top:10px">
        ${communs} critère${communs > 1 ? 's' : ''} en commun · ${ecarts} écart${ecarts > 1 ? 's' : ''}</p>` : ''}
    </div>
    <div>
      <div class="carte">
        <h3>Les pétales</h3>
        <div class="defile"><table class="tableau">
          <thead><tr><th>Critère</th><th>Nous</th><th>La cible</th></tr></thead>
          <tbody>${p.map((x, i) => `<tr>
            <td style="white-space:nowrap;padding-top:12px"><strong>${esc(x.cat)}</strong></td>
            <td><input type="text" data-lien="o3.petales.${i}.moi" data-graph="fleur" value="${esc(x.moi)}" placeholder="…" aria-label="Nous — ${esc(x.cat)}"></td>
            <td><input type="text" data-lien="o3.petales.${i}.cible" data-graph="fleur" value="${esc(x.cible)}" placeholder="…" aria-label="Cible — ${esc(x.cat)}"></td>
          </tr>`).join('')}</tbody></table></div>
        <div class="rangee fin">${bouton('Ajouter un critère', 'petale-ajouter', { ico: 'plus' })}</div>
      </div>
      <div class="carte">
        ${champ('o3.notes', "Ce que cet écart change pour la rencontre",
          { ph: "Quels privilèges jouent en notre faveur ? Lesquels nous manquent ? Qui pourrait porter la parole avec nous ?", lignes: 5 })}
      </div>
    </div>
  </div>`;
}

/* ================================================================ */
/*  4 — Cartographie des acteur·trice·s                             */
/* ================================================================ */
export function matriceHTML(acteurs) {
  const pts = acteurs.filter(a => plein(a.nom)).map(a => {
    const inf = Math.min(5, Math.max(1, Number(a.influence) || 3));
    const int = Math.min(5, Math.max(1, Number(a.interet) || 3));
    const x = 9 + ((inf - 1) / 4) * 82;
    const y = 91 - ((int - 1) / 4) * 82;
    return `<div class="point ${esc(a.position || 'indecis')}" style="left:${x}%;top:${y}%"><i></i><b>${esc(a.nom)}</b></div>`;
  }).join('');
  return `<div class="matrice">
    <div class="trait h"></div><div class="trait v"></div>
    <div class="cadran" style="top:0;right:0;text-align:right">Intérêt fort · influence forte<br>priorité absolue</div>
    <div class="cadran" style="top:0;left:0">Intérêt fort · influence faible<br>allié·e·s de terrain</div>
    <div class="cadran" style="bottom:0;right:0;text-align:right">Intérêt faible · influence forte<br>à intéresser</div>
    <div class="cadran" style="bottom:0;left:0">Intérêt faible · influence faible<br>à surveiller</div>
    ${pts || `<div class="cadran" style="top:46%;left:0;right:0;text-align:center;max-width:none">Ajoutez des acteurs pour les voir apparaître</div>`}
  </div>`;
}

function acteurs() {
  const a = data().o4.acteurs;
  const compte = c => a.filter(x => x.position === c && plein(x.nom)).length;
  return `<div class="carte">
    <div class="carte-tete"><h3>Les parties prenantes</h3>
      <span class="surtitre">${compte('allie')} allié·e·s · ${compte('indecis')} indécis·es · ${compte('adversaire')} adversaires</span></div>
    ${a.length ? `<div class="defile"><table class="tableau">
      <thead><tr><th>Nom</th><th>Pouvoir</th><th>Niveau</th><th>Position</th><th>Infl.</th><th>Intérêt</th><th>Rang</th><th>Notes</th><th></th></tr></thead>
      <tbody>${a.map((x, i) => `<tr>
        <td style="min-width:150px"><input type="text" data-lien="o4.acteurs.${i}.nom" data-graph="matrice" value="${esc(x.nom)}" placeholder="Nom, fonction" aria-label="Nom"></td>
        <td><select data-lien="o4.acteurs.${i}.pouvoir" aria-label="Type de pouvoir">${POUVOIRS.map(p => `<option${x.pouvoir === p ? ' selected' : ''}>${p}</option>`).join('')}</select></td>
        <td><select data-lien="o4.acteurs.${i}.niveau" aria-label="Niveau de pouvoir">${NIVEAUX_POUVOIR.map(p => `<option${x.niveau === p ? ' selected' : ''}>${p}</option>`).join('')}</select></td>
        <td><select data-lien="o4.acteurs.${i}.position" data-graph="matrice" aria-label="Position">${POSITIONS.map(p => `<option value="${p.cle}"${x.position === p.cle ? ' selected' : ''}>${p.nom}</option>`).join('')}</select></td>
        <td style="width:64px"><input type="number" min="1" max="5" data-lien="o4.acteurs.${i}.influence" data-graph="matrice" value="${esc(x.influence)}" aria-label="Influence"></td>
        <td style="width:64px"><input type="number" min="1" max="5" data-lien="o4.acteurs.${i}.interet" data-graph="matrice" value="${esc(x.interet)}" aria-label="Intérêt"></td>
        <td><select data-lien="o4.acteurs.${i}.rang" aria-label="Rang">
          <option value="principale"${x.rang === 'principale' ? ' selected' : ''}>principale</option>
          <option value="secondaire"${x.rang === 'secondaire' ? ' selected' : ''}>secondaire</option></select></td>
        <td style="min-width:160px"><input type="text" data-lien="o4.acteurs.${i}.notes" value="${esc(x.notes)}" placeholder="Levier, contact, mandat…" aria-label="Notes"></td>
        <td style="width:36px"><button class="bouton discret petit" data-agir="retirer" data-chemin="o4.acteurs" data-i="${i}" aria-label="Retirer">${ico('croix', 13)}</button></td>
      </tr>`).join('')}</tbody></table></div>`
      : videMsg('Aucun acteur recensé', 'Commencez par celles et ceux qui décident, puis remontez la chaîne d’influence.')}
    <div class="rangee fin">${bouton('Ajouter un acteur', 'ajouter-objet', { classe: 'fort', ico: 'plus', data: { chemin: 'o4.acteurs', modele: 'acteur' } })}</div>
  </div>

  <div class="carte">
    <h3>Power mapping</h3>
    <p class="chapo" style="font-size:.94rem">Influence en abscisse, intérêt pour la thématique en ordonnée.</p>
    <div id="graph-matrice" style="margin-top:12px">${matriceHTML(a)}</div>
    <div class="legende">${POSITIONS.map(p => `<span><i style="background:var(--${p.cle === 'allie' ? 'voir' : p.cle === 'indecis' ? 'agir' : 'juger'})"></i>${p.nom}</span>`).join('')}</div>
  </div>`;
}

/* ================================================================ */
/*  5 — Théorie du changement                                       */
/* ================================================================ */
function toc() {
  const o = data().o5;
  const ordres = o.ordres || [];
  const O = [
    ['1', "Premier ordre", "les événements, les façons de faire"],
    ['2', "Deuxième ordre", "les modèles, les façons de penser"],
    ['3', "Troisième ordre", "les structures, les façons de comprendre"]
  ];
  return `<div class="grille g2">
    <div class="carte">${champ('o5.valeurs', 'Nos valeurs', { aide: 'les principes', ph: "Ce en quoi nous croyons", lignes: 4 })}</div>
    <div class="carte">${champ('o5.hypotheses', 'Nos hypothèses', { aide: 'si… alors…', ph: "« S'il se passe telle chose, alors le résultat sera… »", lignes: 4 })}</div>
    <div class="carte">${champ('o5.vision', 'Notre vision', { aide: 'le futur idéal', ph: "L'état du monde que nous visons", lignes: 4 })}</div>
    <div class="carte">${champ('o5.missions', 'Nos missions', { aide: 'ce que nous faisons', ph: "Ce que le groupe fait concrètement pour y contribuer", lignes: 4 })}</div>
  </div>
  <div class="carte">
    <h3>Le chemin du changement</h3>
    <p class="chapo" style="font-size:.94rem">Les conditions à réunir pour que le changement se produise.</p>
    <div class="grille g3" style="margin-top:14px">
      <div>${liste('o5.court', { label: 'Court terme', ph: 'Une condition…' })}</div>
      <div>${liste('o5.moyen', { label: 'Moyen terme', ph: 'Une condition…' })}</div>
      <div>${liste('o5.long', { label: 'Long terme', ph: 'Une condition…' })}</div>
    </div>
  </div>
  <div class="carte">
    <h3>À quel ordre s’attaque notre plaidoyer ?</h3>
    ${O.map(([k, n, s]) => `<label class="coche"><input type="checkbox" data-agir="ordre" value="${k}" ${ordres.includes(k) ? 'checked' : ''}>
      <span><strong>${n}</strong> — ${s}</span></label>`).join('')}
    ${ordres.length === 1 && ordres[0] === '1' ? `<div class="encadre alerte" style="margin-top:12px">
      <span class="surtitre">Angle mort</span>
      <p>Un plaidoyer qui ne touche que les façons de faire produit des victoires réversibles. Que faudrait-il pour atteindre les modèles, ou les structures ?</p></div>` : ''}
  </div>`;
}

/* ================================================================ */
/*  6 — SWOT                                                        */
/* ================================================================ */
function swot() {
  const b = (cle, titre, sous, classe) => `<div class="${classe}">
    <span class="surtitre">${sous}</span>
    <h3 style="font-family:var(--display);font-variation-settings:'wght' 750,'wdth' 86;text-transform:uppercase;font-size:19px;margin:4px 0 10px">${titre}</h3>
    ${liste('o6.' + cle, { ph: 'Ajouter…', vide: '—' })}</div>`;
  return `<div class="swot">
    ${b('forces', 'Forces', 'Interne · positif', 'interne')}
    ${b('faiblesses', 'Faiblesses', 'Interne · négatif', 'interne')}
    ${b('opportunites', 'Opportunités', 'Externe · positif', 'externe')}
    ${b('menaces', 'Menaces', 'Externe · négatif', 'externe')}
  </div>
  <div class="encadre info" style="margin-top:16px"><span class="surtitre">Lire son SWOT</span>
    <p>Le haut du tableau, c'est ce sur quoi le groupe a prise. Le bas, l'environnement. Une stratégie tient quand elle utilise une force pour saisir une opportunité — ou pour couvrir une faiblesse face à une menace.</p></div>`;
}

/* ================================================================ */
/*  7 — PESTEL                                                      */
/* ================================================================ */
function pestel() {
  return `<div class="grille g3">
    ${PESTEL_AXES.map(a => `<div class="carte">
      <span class="surtitre">${a.cle}</span>
      <h3 style="margin:3px 0 3px">${esc(a.nom)}</h3>
      <p class="note" style="margin-bottom:10px">${esc(a.aide)}</p>
      ${liste('o7.' + a.cle, { ph: 'Un facteur…', vide: '—' })}
    </div>`).join('')}
  </div>`;
}

/* ================================================================ */
/*  16 — Fenêtres d'opportunité                                     */
/* ================================================================ */
function fenetres() {
  const o = data().o16;
  const tri = [...o.echeances].map((e, i) => ({ ...e, i })).sort((a, b) => (a.date || '9999').localeCompare(b.date || '9999'));
  const conditions = [
    ['probleme', "Le problème est défini clairement"],
    ['solution', "Une solution faisable est formulée"],
    ['contexte', "Le contexte politique s'y prête"]
  ];
  const pretes = conditions.filter(([k]) => o.pret[k]).length;
  return `<div class="carte">
    <div class="carte-tete"><h3>Agenda</h3><span class="surtitre">${o.echeances.length} échéance${o.echeances.length > 1 ? 's' : ''}</span></div>
    ${o.echeances.length ? `<div class="defile"><table class="tableau">
      <thead><tr><th>Date</th><th>Échéance</th><th>Niveau</th><th>Notre prise</th><th></th></tr></thead>
      <tbody>${tri.map(e => `<tr>
        <td style="width:150px"><input type="date" data-lien="o16.echeances.${e.i}.date" data-rendu="1" value="${esc(e.date)}" aria-label="Date"></td>
        <td><input type="text" data-lien="o16.echeances.${e.i}.quoi" value="${esc(e.quoi)}" placeholder="Vote, élection, budget, rapport…" aria-label="Échéance"></td>
        <td><select data-lien="o16.echeances.${e.i}.niveau" aria-label="Niveau">${NIVEAUX_POUVOIR.map(n => `<option${e.niveau === n ? ' selected' : ''}>${n}</option>`).join('')}</select></td>
        <td><input type="text" data-lien="o16.echeances.${e.i}.prise" value="${esc(e.prise)}" placeholder="Ce que nous pouvons y faire" aria-label="Notre prise"></td>
        <td style="width:36px"><button class="bouton discret petit" data-agir="retirer" data-chemin="o16.echeances" data-i="${e.i}" aria-label="Retirer">${ico('croix', 13)}</button></td>
      </tr>`).join('')}</tbody></table></div>`
      : videMsg('Agenda vide', 'Élections, votes en commission, budgets, rapports attendus, procès, journées internationales.')}
    <div class="rangee fin">${bouton('Ajouter une échéance', 'ajouter-objet', { classe: 'fort', ico: 'plus', data: { chemin: 'o16.echeances', modele: 'echeance' } })}</div>
  </div>

  <div class="carte">
    <h3>Sommes-nous prêts ?</h3>
    <p class="chapo" style="font-size:.94rem">Trois conditions rendent une fenêtre exploitable. Elles doivent être réunies <em>avant</em> qu'elle s'ouvre.</p>
    <div style="margin-top:12px">
      ${conditions.map(([k, t]) => `<label class="coche ${o.pret[k] ? 'faite' : ''}">
        <input type="checkbox" data-agir="pret" data-cle="${k}" ${o.pret[k] ? 'checked' : ''}><span>${t}</span></label>`).join('')}
    </div>
    <div class="encadre ${pretes === 3 ? 'info' : 'alerte'}" style="margin-top:14px">
      <span class="surtitre">${pretes} / 3</span>
      <p>${pretes === 3
        ? "Vous êtes en état de saisir une opportunité. Reste à la guetter — et éventuellement à la provoquer."
        : "Tant que les trois ne sont pas réunies, une fenêtre qui s'ouvre passera sans vous. C'est le travail des outils 8, 17 et 11."}</p>
    </div>
  </div>`;
}

/* ================================================================ */
/*  8 — Arbre à problème / à objectif                               */
/* ================================================================ */
function arbre() {
  const o = data().o8;
  return `<div class="grille g2">
    <div>
      <div class="rangee" style="margin-bottom:10px"><span class="etiquette juger">Arbre à problème</span></div>
      <div class="arbre">
        <div class="etage"><span class="surtitre">Les branches — conséquences</span>
          <div style="margin-top:8px">${liste('o8.consequences', { ph: 'Une conséquence…', vide: '—' })}</div></div>
        <div class="etage tronc"><span class="surtitre">Le tronc — le problème</span>
          <input type="text" data-lien="o8.probleme" value="${esc(o.probleme)}" placeholder="Le problème, en une phrase" style="margin-top:8px" aria-label="Le problème"></div>
        <div class="etage"><span class="surtitre">Les racines — causes profondes</span>
          <div style="margin-top:8px">${liste('o8.causes', { ph: 'Une cause profonde…', vide: '—' })}</div></div>
      </div>
    </div>
    <div>
      <div class="rangee" style="margin-bottom:10px"><span class="etiquette voir">Arbre à objectif</span>
        ${bouton('Positiver', 'positiver', { titre: "Recopier le problème et ses causes du côté objectif" })}</div>
      <div class="arbre">
        <div class="etage"><span class="surtitre">Finalités visées</span>
          <div style="margin-top:8px">${liste('o8.finalites', { ph: "Ce qui s'améliore…", vide: '—' })}</div></div>
        <div class="etage tronc"><span class="surtitre">L’objectif</span>
          <input type="text" data-lien="o8.objectif" value="${esc(o.objectif)}" placeholder="Le problème retourné en objectif" style="margin-top:8px" aria-label="L'objectif"></div>
        <div class="etage"><span class="surtitre">Moyens — ce qu’il faut obtenir</span>
          <div style="margin-top:8px">${liste('o8.moyens', { ph: 'Une demande concrète…', vide: '—' })}</div></div>
      </div>
    </div>
  </div>
  <div class="encadre info" style="margin-top:16px"><span class="surtitre">Et ensuite</span>
    <p>Chaque cause devient un axe stratégique possible : l'outil 17 les met en concurrence et n'en garde que deux ou trois.</p></div>`;
}

/* ================================================================ */
/*  9 — Les 5 pourquoi                                              */
/* ================================================================ */
function cinq() {
  const o = data().o9;
  return `<div class="carte">
    ${champ('o9.probleme', 'Le problème de départ', { ph: 'Ce que l’on constate', lignes: 2 })}
    <ol class="chaine" style="margin-top:20px">
      ${o.pourquoi.map((v, i) => `<li data-n="${i + 1}" class="${i === 4 ? 'profonde' : ''}">
        ${champ(`o9.pourquoi.${i}`, i === 4 ? 'Pourquoi ? — cause profonde' : 'Pourquoi ?',
          { ph: i === 0 ? 'Parce que…' : 'Et pourquoi cela ?', lignes: 2, graph: 'cinq' })}</li>`).join('')}
    </ol>
    ${plein(o.pourquoi[4]) ? `<div class="encadre"><span class="surtitre">Cause profonde</span>
      <p>${esc(o.pourquoi[4])}</p>
      <p class="note">Vérifiez : est-elle structurelle, ou encore une conséquence d'autre chose ? Et surtout : le collectif a-t-il prise dessus ?</p></div>` : ''}
  </div>`;
}

/* ================================================================ */
/*  17 — Axes stratégiques et priorisation                          */
/* ================================================================ */
function scoreAxe(axe, poids) {
  let somme = 0, total = 0;
  CRITERES.forEach(c => {
    const p = Number(poids[c.cle] ?? 2);
    const n = Number(axe.notes?.[c.cle] ?? 0);
    somme += n * p; total += 3 * p;
  });
  return total ? somme / total : 0;
}

function axes() {
  const o = data().o17;
  const causes = data().o8.causes || [];
  const classes = o.axes.map((a, i) => ({ a, i, s: scoreAxe(a, o.poids) })).sort((x, y) => y.s - x.s);
  return `<div class="carte">
    <div class="carte-tete"><h3>Les axes possibles</h3>
      <span class="surtitre">un axe = un plaidoyer</span></div>
    <p class="chapo" style="font-size:.94rem">Pour chaque cause du problème, quelle solution pourrions-nous proposer ? C'est un axe.</p>
    <div class="rangee fin">
      ${bouton('Ajouter un axe', 'ajouter-objet', { classe: 'fort', ico: 'plus', data: { chemin: 'o17.axes', modele: 'axe' } })}
      ${causes.length ? bouton(`Reprendre les ${causes.length} causes de l’arbre`, 'axes-depuis-causes') : ''}
    </div>
  </div>

  ${o.axes.length ? `<div class="carte">
    <h3>Pondération des critères</h3>
    <p class="chapo" style="font-size:.94rem">Tous les critères ne pèsent pas pareil selon les collectifs. Ajustez, le classement suit.</p>
    <div class="grille g3" style="margin-top:12px">
      ${CRITERES.map(c => `<label class="champ" style="margin-bottom:8px">
        <span class="intitule">${esc(c.nom)}<span class="aide">${['ignoré', 'secondaire', 'normal', 'décisif'][Number(o.poids[c.cle] ?? 2)]}</span></span>
        <input type="range" min="0" max="3" step="1" value="${Number(o.poids[c.cle] ?? 2)}"
          data-agir="poids" data-cle="${c.cle}" aria-label="Poids de ${esc(c.nom)}"></label>`).join('')}
    </div>
  </div>

  ${classes.map(({ a, i, s }, r) => `<div class="carte">
    <div class="carte-tete">
      <span class="rang-axe ${r === 0 ? 'premier' : ''}">${String(r + 1).padStart(2, '0')}</span>
      <div style="flex:1;min-width:200px">
        <input type="text" data-lien="o17.axes.${i}.libelle" data-rendu="1" value="${esc(a.libelle)}"
          placeholder="Formulez l’axe : la solution proposée" aria-label="Libellé de l’axe">
        ${plein(a.cause) ? `<p class="note" style="margin-top:5px">Depuis la cause : ${esc(a.cause)}</p>` : ''}
      </div>
      <div style="min-width:120px;text-align:right">
        <span class="surtitre">score ${Math.round(s * 100)} %</span>
        <div class="barre-score"><i style="width:${Math.round(s * 100)}%"></i></div>
      </div>
      <button class="bouton discret petit" data-agir="retirer" data-chemin="o17.axes" data-i="${i}" aria-label="Retirer">${ico('croix', 13)}</button>
    </div>
    <div class="grille g3" style="margin-top:8px">
      ${CRITERES.map(c => `<label class="champ" style="margin-bottom:6px">
        <span class="intitule" title="${esc(c.aide)}">${esc(c.nom)}</span>
        <select data-agir="note-axe" data-i="${i}" data-cle="${c.cle}" aria-label="${esc(c.nom)}">
          ${[0, 1, 2, 3].map(n => `<option value="${n}"${Number(a.notes?.[c.cle] ?? 0) === n ? ' selected' : ''}>${['—', 'faible', 'moyen', 'fort'][n]}</option>`).join('')}
        </select></label>`).join('')}
    </div>
  </div>`).join('')}

  ${classes.length > 3 ? `<div class="encadre alerte"><span class="surtitre">Trop d’axes</span>
    <p>Vous en avez ${classes.length}. Une organisation ne mène pas plus de deux ou trois plaidoyers de front — un seul si les ressources sont limitées. Les mieux classés ici sont <strong>${classes.slice(0, 2).map(c => esc(c.a.libelle || 'sans titre')).join('</strong> et <strong>')}</strong>.</p></div>` : ''}`
  : videMsg('Aucun axe', 'Partez des causes de votre arbre à problème : chacune appelle une solution.')}`;
}

/* ================================================================ */
/*  10 — Avec, sans, contre                                         */
/* ================================================================ */
function rapport() {
  const col = (cle, titre, expl, tag) => `<div class="carte">
    <div class="rangee" style="margin-bottom:8px"><span class="etiquette ${tag}">${titre}</span></div>
    <p class="note" style="margin-bottom:10px">${expl}</p>
    ${liste('o10.' + cle, { ph: 'Une action…', vide: '—' })}</div>`;
  return `<div class="grille g3">
    ${col('avec', 'Avec', "Dialogue, négociation, co-construction. Le registre du plaidoyer.", 'voir')}
    ${col('contre', 'Contre', "Résistance, conflit ouvert avec les sphères de pouvoir.", 'juger')}
    ${col('sans', 'Sans', "Espace d’autonomie, alternatives construites à côté.", 'agir')}
  </div>
  <div class="carte">${champ('o10.note', 'Notre dosage',
    { ph: "Quel registre domine aujourd'hui ? Est-il choisi ou subi ? Quelle action d'un autre registre renforcerait le plaidoyer ?", lignes: 3 })}</div>`;
}

/* ================================================================ */
/*  18 — Choix de la stratégie                                      */
/* ================================================================ */
export function planHTML(o) {
  const x = Number(o.x ?? 50), y = Number(o.y ?? 50);
  return `<div class="plan" data-agir="plan-clic" role="application" aria-label="Positionnement stratégique">
    <div class="trait" style="left:0;right:0;top:50%;height:1px"></div>
    <div class="trait" style="top:0;bottom:0;left:50%;width:1px"></div>
    <div class="zone" style="top:8%;left:5%">Conseiller</div>
    <div class="zone" style="top:8%;right:5%">Plaidoyer formel</div>
    <div class="zone" style="bottom:8%;left:5%">Lobby</div>
    <div class="zone" style="bottom:8%;right:5%">Activisme</div>
    <div class="etiq-axe" style="left:8px;top:50%;transform:translateY(-50%)">Coopération</div>
    <div class="etiq-axe" style="right:8px;top:50%;transform:translateY(-50%)">Confrontation</div>
    <div class="etiq-axe" style="left:50%;top:6px;transform:translateX(-50%)">Formel</div>
    <div class="etiq-axe" style="left:50%;bottom:6px;transform:translateX(-50%)">Informel</div>
    <div class="curseur-plan" style="left:${x}%;top:${y}%"></div>
  </div>`;
}

function strategie() {
  const o = data().o18;
  const zone = (o.x < 50 ? (o.y < 50 ? 'le rôle de conseiller' : 'le lobby') : (o.y < 50 ? 'le plaidoyer formel' : "l'activisme"));
  return `<div class="grille g2" style="align-items:start">
    <div class="carte">
      <h3>Où nous plaçons-nous ?</h3>
      <p class="chapo" style="font-size:.94rem">Cliquez sur le plan. Deux axes : coopération ↔ confrontation, formel ↔ informel.</p>
      <div id="graph-plan" style="margin-top:12px">${planHTML(o)}</div>
      <p class="note" style="margin-top:10px">Position actuelle : <strong>${zone}</strong>.</p>
    </div>
    <div class="carte">
      <h3>Notre théorie du changement politique</h3>
      <p class="chapo" style="font-size:.94rem">Comment pensons-nous que la décision bascule ? La stratégie devrait en découler.</p>
      <div style="margin-top:10px">
        ${THEORIES.map(t => `<label class="coche" style="align-items:flex-start">
          <input type="radio" name="theorie" data-lien="o18.theorie" data-rendu="1" value="${esc(t.nom)}" ${o.theorie === t.nom ? 'checked' : ''}>
          <span><strong>${esc(t.nom)}</strong><br><span class="note">${esc(t.txt)}</span></span></label>`).join('')}
      </div>
    </div>
  </div>

  <div class="carte">
    <div class="carte-tete"><h3>Le panel des stratégies</h3><span class="surtitre">${o.retenues.length} retenue${o.retenues.length > 1 ? 's' : ''}</span></div>
    <p class="chapo" style="font-size:.94rem">Cochez celles que vous comptez enchaîner. Elles ne s'excluent pas : elles se succèdent selon la réaction de la cible.</p>
    <div class="grille g2" style="margin-top:12px">
      ${STRATEGIES.map((s, i) => `<label class="coche ${o.retenues.includes(i) ? 'faite' : ''}" style="align-items:flex-start;border:1px solid var(--bord-doux);border-radius:var(--r);padding:9px 11px">
        <input type="checkbox" data-agir="cocher" data-chemin="o18.retenues" data-i="${i}" ${o.retenues.includes(i) ? 'checked' : ''}>
        <span><strong>${esc(s.nom)}</strong><br><span class="note">${esc(s.txt)}</span></span></label>`).join('')}
    </div>
  </div>

  <div class="carte">
    ${champ('o18.repli', 'Notre plan de repli',
      { aide: 'si la cible refuse', ph: "Action A réalisée → si la cible accepte de nous recevoir, action B. Si elle refuse, action C.", lignes: 3 })}
  </div>`;
}

/* ================================================================ */
/*  11 — Objectifs SMART                                            */
/* ================================================================ */
function smart() {
  const objs = data().o11.objectifs;
  const crits = [['S', 'Spécifique'], ['M', 'Mesurable'], ['A', 'Atteignable'], ['R', 'Réaliste'], ['T', 'Temporel']];
  return `${objs.length ? objs.map((o, i) => {
    const n = (o.crits || []).length;
    return `<div class="carte">
      <div class="carte-tete"><span class="surtitre">Objectif ${i + 1}</span>
        <span class="etiquette ${n === 5 ? 'voir' : ''}">${n} / 5 critères</span></div>
      <p style="font-size:1.05rem;line-height:2;margin:6px 0 16px">
        D’ici <b style="border-bottom:2px solid var(--agir)">${esc(o.temps) || '…'}</b>,
        obtenir <b style="border-bottom:2px solid var(--agir)">${esc(o.decision) || '…'}</b>
        en faisant <b style="border-bottom:2px solid var(--agir)">${esc(o.action) || '…'}</b>
        grâce à <b style="border-bottom:2px solid var(--agir)">${esc(o.moyen) || '…'}</b>.
      </p>
      <div class="grille g2">
        <div>
          ${champ(`o11.objectifs.${i}.temps`, "D’ici… (temps)", { ph: 'décembre 2027', lignes: 0, graph: 'smart' })}
          ${champ(`o11.objectifs.${i}.decision`, "Obtenir… (décision mesurable)", { ph: "le vote d'une motion communale", lignes: 0, graph: 'smart' })}
        </div>
        <div>
          ${champ(`o11.objectifs.${i}.action`, "En faisant… (action atteignable)", { ph: "en rencontrant les 6 chef·fes de groupe", lignes: 0, graph: 'smart' })}
          ${champ(`o11.objectifs.${i}.moyen`, "Grâce à… (moyen réaliste)", { ph: "notre note de position et le comité de quartier", lignes: 0, graph: 'smart' })}
        </div>
      </div>
      <div class="rangee" style="margin-top:4px">
        ${crits.map(([k, nom]) => `<label class="coche" style="padding:2px 0">
          <input type="checkbox" data-agir="crit-smart" data-i="${i}" data-cle="${k}" ${(o.crits || []).includes(k) ? 'checked' : ''}>
          <span><strong>${k}</strong> ${nom}</span></label>`).join('')}
      </div>
      <div class="rangee fin">${bouton('Supprimer', 'retirer', { classe: 'danger petit', data: { chemin: 'o11.objectifs', i } })}</div>
    </div>`;
  }).join('') : videMsg('Aucun objectif', "Un objectif tient en une phrase et se vérifie à l'échéance.")}
  <div class="rangee fin">${bouton('Ajouter un objectif', 'ajouter-objet', { classe: 'fort', ico: 'plus', data: { chemin: 'o11.objectifs', modele: 'objectif' } })}</div>`;
}

/* ================================================================ */
/*  12 — Cibles et alliances                                        */
/* ================================================================ */
function cibles() {
  const d = data();
  const indecis = d.o4.acteurs.filter(a => a.position === 'indecis' && plein(a.nom));
  return `
  ${indecis.length ? `<div class="encadre"><span class="surtitre">Depuis votre cartographie</span>
    <p>${indecis.length} acteur·trice·s sont noté·e·s indécis·es : <strong>${indecis.map(a => esc(a.nom)).join(', ')}</strong>. C'est là que votre plaidoyer a le plus de prise.</p></div>` : ''}

  <div class="carte" style="margin-top:16px">
    <h3>Les cibles</h3>
    ${d.o12.cibles.length ? `<div class="defile"><table class="tableau">
      <thead><tr><th>Cible</th><th>Niveau</th><th>Ce qu’elle gagne</th><th>Ce qu’elle perd</th><th>Notre argument</th><th></th></tr></thead>
      <tbody>${d.o12.cibles.map((c, i) => `<tr>
        <td style="min-width:140px"><input type="text" data-lien="o12.cibles.${i}.nom" value="${esc(c.nom)}" placeholder="Nom, fonction" aria-label="Cible"></td>
        <td style="width:96px"><select data-lien="o12.cibles.${i}.niveau" aria-label="Niveau">
          <option value="1"${c.niveau === '1' ? ' selected' : ''}>1er</option>
          <option value="2"${c.niveau === '2' ? ' selected' : ''}>2e</option></select></td>
        <td><input type="text" data-lien="o12.cibles.${i}.gagne" value="${esc(c.gagne)}" placeholder="…" aria-label="Gagne"></td>
        <td><input type="text" data-lien="o12.cibles.${i}.perd" value="${esc(c.perd)}" placeholder="…" aria-label="Perd"></td>
        <td style="min-width:170px"><input type="text" data-lien="o12.cibles.${i}.argument" value="${esc(c.argument)}" placeholder="L’angle qui la fait bouger" aria-label="Argument"></td>
        <td style="width:36px"><button class="bouton discret petit" data-agir="retirer" data-chemin="o12.cibles" data-i="${i}" aria-label="Retirer">${ico('croix', 13)}</button></td>
      </tr>`).join('')}</tbody></table></div>`
      : videMsg('Aucune cible retenue', 'Les indécis·es d’abord : ce sont elles que vous pouvez faire basculer.')}
    <div class="rangee fin">
      ${bouton('Ajouter une cible', 'ajouter-objet', { classe: 'fort', ico: 'plus', data: { chemin: 'o12.cibles', modele: 'cible' } })}
      ${indecis.length ? bouton('Reprendre les indécis·es', 'importer-indecis') : ''}
    </div>
  </div>

  <div class="carte">
    <h3>Les allié·e·s</h3>
    ${d.o12.allies.length ? `<div class="defile"><table class="tableau">
      <thead><tr><th>Allié·e</th><th>Apport</th><th>Avantages</th><th>Risques</th><th></th></tr></thead>
      <tbody>${d.o12.allies.map((c, i) => `<tr>
        <td style="min-width:140px"><input type="text" data-lien="o12.allies.${i}.nom" value="${esc(c.nom)}" placeholder="Organisation, personne" aria-label="Allié"></td>
        <td><input type="text" data-lien="o12.allies.${i}.apport" value="${esc(c.apport)}" placeholder="Expertise, réseau, nombre, moyens" aria-label="Apport"></td>
        <td><input type="text" data-lien="o12.allies.${i}.avantages" value="${esc(c.avantages)}" placeholder="…" aria-label="Avantages"></td>
        <td><input type="text" data-lien="o12.allies.${i}.risques" value="${esc(c.risques)}" placeholder="…" aria-label="Risques"></td>
        <td style="width:36px"><button class="bouton discret petit" data-agir="retirer" data-chemin="o12.allies" data-i="${i}" aria-label="Retirer">${ico('croix', 13)}</button></td>
      </tr>`).join('')}</tbody></table></div>`
      : videMsg('Aucun allié identifié', "L'accord partiel suffit : on s'allie sur un point précis, pas sur tout.")}
    <div class="rangee fin">${bouton('Ajouter un allié', 'ajouter-objet', { classe: 'fort', ico: 'plus', data: { chemin: 'o12.allies', modele: 'allie' } })}</div>
  </div>`;
}

/* ================================================================ */
/*  19 — Fiche de ciblage                                           */
/* ================================================================ */
function ciblage() {
  const d = data();
  const champs = [
    ['representant', 'Représentant·e / contact', 'Qui rencontre-t-on concrètement ?'],
    ['objectifs', 'Objectifs généraux de la cible', "Ce qu'elle cherche à obtenir, elle"],
    ['interet', 'Intérêt vis-à-vis du problème', 'Fort, moyen, nul ?'],
    ['soutien', 'Niveau de soutien ou d’opposition', 'Où se situe-t-elle ?'],
    ['influence', 'Influence sur le problème', 'Peut-elle décider, ou seulement peser ?'],
    ['connaissance', 'Niveau de connaissance du sujet', 'Faut-il d’abord informer ?'],
    ['action', 'Action souhaitée', 'Ce qu’on veut qu’elle fasse — sert au suivi'],
    ['acces', 'Niveau d’accès', 'Facile à rencontrer ? Sinon, par quelle voie ?'],
    ['detonateur', 'Détonateur', 'À quel type d’argument est-elle réceptive ?'],
    ['langage', 'Type de langage', 'Scientifique, juridique, de terrain, budgétaire…'],
    ['canaux', 'Canaux de communication', 'Par où la contacter ?'],
    ['comptes', 'À qui rend-elle des comptes', "Souvent le meilleur levier"]
  ];
  return `${d.o19.fiches.length ? d.o19.fiches.map((f, i) => `<div class="carte">
    <div class="carte-tete">
      <input type="text" data-lien="o19.fiches.${i}.nom" value="${esc(f.nom)}" placeholder="Nom de la cible"
        style="font-family:var(--display);font-variation-settings:'wght' 750,'wdth' 88;text-transform:uppercase;font-size:19px;flex:1;min-width:180px" aria-label="Nom de la cible">
      <button class="bouton discret petit" data-agir="retirer" data-chemin="o19.fiches" data-i="${i}" aria-label="Retirer">${ico('croix', 13)}</button>
    </div>
    <div class="grille g2">
      ${champs.map(([k, l, a]) => champ(`o19.fiches.${i}.${k}`, l, { aide: a, lignes: 0 })).join('')}
    </div>
  </div>`).join('') : videMsg('Aucune fiche', 'Une fiche par cible prioritaire — deux ou trois, pas plus.')}
  <div class="rangee fin">
    ${bouton('Nouvelle fiche', 'ajouter-objet', { classe: 'fort', ico: 'plus', data: { chemin: 'o19.fiches', modele: 'fiche' } })}
    ${d.o12.cibles.length ? bouton('Créer une fiche par cible', 'fiches-depuis-cibles') : ''}
  </div>
  <div class="encadre info" style="margin-top:16px"><span class="surtitre">Rappel</span>
    <p>« Le ministère » n'est pas une cible. Cherchez la personne responsable du dossier, et gardez plusieurs contacts dans l'institution : le jour où elle part, tout est à refaire.</p></div>`;
}

/* ================================================================ */
/*  20 — Alliances et réseau                                        */
/* ================================================================ */
function reseau() {
  const o = data().o20;
  return `<div class="carte">
    <div class="carte-tete"><h3>Composition</h3>
      <span class="surtitre">${o.membres.length} organisation${o.membres.length > 1 ? 's' : ''}</span></div>
    ${o.membres.length ? `<div class="defile"><table class="tableau">
      <thead><tr><th>Organisation</th><th>Type de lien</th><th>Apport</th><th>Point de contact</th><th>Pèse sur…</th><th></th></tr></thead>
      <tbody>${o.membres.map((m, i) => `<tr>
        <td style="min-width:140px"><input type="text" data-lien="o20.membres.${i}.nom" value="${esc(m.nom)}" placeholder="Nom" aria-label="Organisation"></td>
        <td><select data-lien="o20.membres.${i}.type" aria-label="Type">${TYPO_ALLIES.map(t => `<option value="${t.cle}"${m.type === t.cle ? ' selected' : ''}>${esc(t.nom)}</option>`).join('')}</select></td>
        <td><input type="text" data-lien="o20.membres.${i}.apport" value="${esc(m.apport)}" placeholder="Expertise, réseau, nombre…" aria-label="Apport"></td>
        <td><input type="text" data-lien="o20.membres.${i}.contact" value="${esc(m.contact)}" placeholder="Prénom, courriel" aria-label="Contact"></td>
        <td><input type="text" data-lien="o20.membres.${i}.cible" value="${esc(m.cible)}" placeholder="Quelle cible ?" aria-label="Cible"></td>
        <td style="width:36px"><button class="bouton discret petit" data-agir="retirer" data-chemin="o20.membres" data-i="${i}" aria-label="Retirer">${ico('croix', 13)}</button></td>
      </tr>`).join('')}</tbody></table></div>`
      : videMsg('Réseau vide', 'Cherchez d’abord des acteurs capables de peser sur des cibles différentes des vôtres.')}
    <div class="rangee fin">${bouton('Ajouter une organisation', 'ajouter-objet', { classe: 'fort', ico: 'plus', data: { chemin: 'o20.membres', modele: 'partenaire' } })}</div>
    <div class="grille g3" style="margin-top:18px">
      ${TYPO_ALLIES.map(t => `<div style="border:1px solid var(--bord-doux);border-radius:var(--r);padding:10px 12px">
        <b style="font-size:13px">${esc(t.nom)}</b><p class="note" style="margin:3px 0 0">${esc(t.txt)}</p></div>`).join('')}
    </div>
  </div>

  <div class="grille g2">
    <div class="carte"><h3>À la création</h3>${coches('o20.creation', VIE_ALLIANCE.creation)}</div>
    <div class="carte"><h3>Pour la faire vivre</h3>${coches('o20.vie', VIE_ALLIANCE.vie)}</div>
  </div>`;
}

/* ================================================================ */
/*  13 — Construire un message                                      */
/* ================================================================ */
function message() {
  const m = data().o13.messages;
  return `${m.length ? m.map((x, i) => `<div class="carte">
    <div class="carte-tete"><span class="surtitre">Message ${i + 1}</span>
      ${plein(x.usage) ? `<span class="etiquette">${esc(x.usage)}</span>` : ''}</div>
    <div class="grille g2" style="margin-top:10px">
      <div>
        ${champ(`o13.messages.${i}.accroche`, 'Une accroche', { aide: 'donner envie d’écouter', ph: "« Chaque seconde… », une statistique proche des gens", lignes: 2, graph: 'message' })}
        ${champ(`o13.messages.${i}.probleme`, 'Le problème est que…', { ph: 'En une phrase simple', lignes: 2, graph: 'message' })}
        ${champ(`o13.messages.${i}.importance`, 'C’est important parce que…', { aide: 'et pourquoi maintenant', ph: 'Pour la cible', lignes: 2, graph: 'message' })}
      </div>
      <div>
        ${champ(`o13.messages.${i}.cible`, 'Nous voulons que… (la cible)', { ph: 'À qui parlons-nous ?', lignes: 2, graph: 'message' })}
        ${champ(`o13.messages.${i}.action`, 'Fasse… (l’action demandée)', { aide: 'sans elle, c’est de la sensibilisation', ph: 'La demande précise', lignes: 2, graph: 'message' })}
        ${champ(`o13.messages.${i}.usage`, 'Usage prévu', { ph: 'Affiche, rencontre, communiqué, interview…', lignes: 0, graph: 'message' })}
      </div>
    </div>
    <div class="message-rendu" id="rendu-msg-${i}" style="margin-top:14px">${renduMessage(x)}</div>
    <div class="rangee fin">
      ${bouton('Copier', 'copier-message', { ico: 'copie', data: { i } })}
      ${bouton('Supprimer', 'retirer', { classe: 'danger', data: { chemin: 'o13.messages', i } })}
    </div>
  </div>`).join('') : videMsg('Aucun message', 'Préparez-en plusieurs : on n’utilise pas le même morceau selon le support.')}
  <div class="rangee fin">${bouton('Ajouter un message', 'ajouter-objet', { classe: 'fort', ico: 'plus', data: { chemin: 'o13.messages', modele: 'message' } })}</div>`;
}

export function renduMessage(x) {
  return [['Accroche', x.accroche], ['Le problème', x.probleme], ["Pourquoi c'est important", x.importance],
    ['La cible', x.cible], ["L'action demandée", x.action]]
    .map(([l, v]) => `<div class="bloc-msg"><span class="surtitre">${l}</span>
      <p>${plein(v) ? esc(v) : '<span style="color:var(--tenu)">—</span>'}</p></div>`).join('');
}

/* ================================================================ */
/*  21 — Médias et interview                                        */
/* ================================================================ */
function medias() {
  const o = data().o21;
  return `<div class="carte">
    <h3>Nos supports</h3>
    <p class="chapo" style="font-size:.94rem">Hiérarchisez selon ce que lit, écoute ou regarde <em>votre cible</em> — pas selon l'audience globale.</p>
    ${o.medias.length ? `<div class="defile"><table class="tableau">
      <thead><tr><th>Média</th><th>Qui l’écoute</th><th>Ligne / financement</th><th>Journaliste</th><th>Position passée</th><th>Déformation</th><th></th></tr></thead>
      <tbody>${o.medias.map((m, i) => `<tr>
        <td style="min-width:120px"><input type="text" data-lien="o21.medias.${i}.nom" value="${esc(m.nom)}" placeholder="Nom du média" aria-label="Média"></td>
        <td><input type="text" data-lien="o21.medias.${i}.audience" value="${esc(m.audience)}" placeholder="Public" aria-label="Audience"></td>
        <td><input type="text" data-lien="o21.medias.${i}.ligne" value="${esc(m.ligne)}" placeholder="Orientation, qui finance" aria-label="Ligne"></td>
        <td><input type="text" data-lien="o21.medias.${i}.journaliste" value="${esc(m.journaliste)}" placeholder="Qui a déjà couvert le sujet" aria-label="Journaliste"></td>
        <td><input type="text" data-lien="o21.medias.${i}.passe" value="${esc(m.passe)}" placeholder="Ce qu’il a écrit avant" aria-label="Position passée"></td>
        <td style="width:100px"><select data-lien="o21.medias.${i}.risque" aria-label="Risque de déformation">
          <option${m.risque === 'faible' ? ' selected' : ''}>faible</option>
          <option${m.risque === 'moyen' ? ' selected' : ''}>moyen</option>
          <option${m.risque === 'élevé' ? ' selected' : ''}>élevé</option></select></td>
        <td style="width:36px"><button class="bouton discret petit" data-agir="retirer" data-chemin="o21.medias" data-i="${i}" aria-label="Retirer">${ico('croix', 13)}</button></td>
      </tr>`).join('')}</tbody></table></div>`
      : videMsg('Aucun média listé', 'Commencez par les journalistes qui ont déjà couvert votre sujet.')}
    <div class="rangee fin">${bouton('Ajouter un média', 'ajouter-objet', { classe: 'fort', ico: 'plus', data: { chemin: 'o21.medias', modele: 'media' } })}</div>
    <div class="encadre info" style="margin-top:16px"><span class="surtitre">À se demander avant de solliciter</span>
      <ul style="margin:6px 0 0;padding-left:1.1em">${MEDIA_QUESTIONS.map(q => `<li style="font-size:.92rem">${esc(q)}</li>`).join('')}</ul></div>
  </div>

  <div class="grille g2">
    <div class="carte">
      <h3>Le pitch de 30 secondes</h3>
      ${champ('o21.pitch', 'Ce qu’on dit au téléphone', { ph: "L'angle, l'information nouvelle, pourquoi maintenant", lignes: 4 })}
      <span class="surtitre" style="display:block;margin:10px 0 6px">Ce qui accroche un·e journaliste</span>
      <ul style="margin:0;padding-left:1.1em">${ACCROCHES_MEDIA.map(a => `<li class="note">${esc(a)}</li>`).join('')}</ul>
    </div>
    <div class="carte">
      <h3>Les deux messages prioritaires</h3>
      <p class="chapo" style="font-size:.94rem">Ceux qu'on répétera quoi qu'il arrive. Si vous restez dessus, le journaliste sera obligé d'en parler.</p>
      ${champ('o21.messages2.0', 'Message 1', { ph: '…', lignes: 2 })}
      ${champ('o21.messages2.1', 'Message 2', { ph: '…', lignes: 2 })}
    </div>
  </div>

  <div class="carte">
    <h3>Préparation de l’interview</h3>
    ${coches('o21.interview', INTERVIEW)}
    <div class="encadre" style="margin-top:12px"><span class="surtitre">La technique du pont</span>
      <p>Ne répétez jamais un stéréotype, même pour le nier. Prenez un mot neutre de la question et repartez ailleurs.</p></div>
  </div>`;
}

/* ================================================================ */
/*  22 — Mobilisation et pétition                                   */
/* ================================================================ */
function mobilisation() {
  const o = data().o22;
  const p = o.petition;
  return `<div class="carte">
    <h3>Actions de mobilisation</h3>
    ${o.actions.length ? `<div class="defile"><table class="tableau">
      <thead><tr><th>Type</th><th>Quoi</th><th>Quand</th><th>Qui porte</th><th></th></tr></thead>
      <tbody>${o.actions.map((a, i) => `<tr>
        <td style="width:170px"><select data-lien="o22.actions.${i}.type" aria-label="Type">${MOBILISATION_OUTILS.map(m => `<option${a.type === m.nom ? ' selected' : ''}>${esc(m.nom)}</option>`).join('')}</select></td>
        <td><input type="text" data-lien="o22.actions.${i}.quoi" value="${esc(a.quoi)}" placeholder="Description" aria-label="Description"></td>
        <td style="width:150px"><input type="date" data-lien="o22.actions.${i}.date" value="${esc(a.date)}" aria-label="Date"></td>
        <td><input type="text" data-lien="o22.actions.${i}.qui" value="${esc(a.qui)}" placeholder="Responsable" aria-label="Responsable"></td>
        <td style="width:36px"><button class="bouton discret petit" data-agir="retirer" data-chemin="o22.actions" data-i="${i}" aria-label="Retirer">${ico('croix', 13)}</button></td>
      </tr>`).join('')}</tbody></table></div>`
      : videMsg('Aucune action', 'La mobilisation légitime le combat et fait pression. Elle se planifie comme le reste.')}
    <div class="rangee fin">${bouton('Ajouter une action', 'ajouter-objet', { classe: 'fort', ico: 'plus', data: { chemin: 'o22.actions', modele: 'actionMob' } })}</div>
    <div class="grille g3" style="margin-top:18px">
      ${MOBILISATION_OUTILS.map(m => `<div style="border:1px solid var(--bord-doux);border-radius:var(--r);padding:10px 12px">
        <b style="font-size:13px">${esc(m.nom)}</b><p class="note" style="margin:3px 0 0">${esc(m.txt)}</p></div>`).join('')}
    </div>
  </div>

  <div class="grille g2" style="align-items:start">
    <div class="carte">
      <h3>Rédiger la pétition</h3>
      ${champ('o22.petition.titre', 'Le titre', { aide: 'court, clair, attractif', ph: 'Une phrase qui se retient', lignes: 0, graph: 'petition' })}
      ${champ('o22.petition.decideur', 'À qui elle s’adresse', { aide: 'nommé·e et atteignable', ph: 'Le ou la décideuse visée', lignes: 0, graph: 'petition' })}
      ${champ('o22.petition.probleme', 'Le problème', { ph: 'Expliqué simplement', lignes: 3, graph: 'petition' })}
      ${champ('o22.petition.solution', 'La solution demandée', { aide: 'message positif', ph: 'Ce que nous voulons obtenir', lignes: 3, graph: 'petition' })}
      ${champ('o22.petition.urgence', 'Pourquoi maintenant', { ph: "L'échéance qui rend la signature urgente", lignes: 2, graph: 'petition' })}
    </div>
    <div>
      <div class="carte">
        <span class="surtitre">Aperçu</span>
        <div id="graph-petition" style="margin-top:8px">${apercuPetition(p)}</div>
      </div>
      <div class="carte">
        <h3>Les critères d’une pétition qui tient</h3>
        ${coches('o22.criteres', PETITION_CRITERES)}
      </div>
      <div class="encadre alerte"><span class="surtitre">Ordre de grandeur</span>
        <p>Sur change.org, sur 25 000 pétitions, une soixantaine dépassent 15 000 signatures. Ce n'est pas la pétition qui mobilise, c'est la campagne autour.</p></div>
    </div>
  </div>`;
}

export function apercuPetition(p) {
  return `<div style="border:1px solid var(--bord-doux);border-radius:var(--r);padding:16px;background:var(--surface-2)">
    <p style="font-family:var(--display);font-variation-settings:'wght' 780,'wdth' 84;text-transform:uppercase;font-size:21px;line-height:1.05;margin:0 0 8px">
      ${plein(p.titre) ? esc(p.titre) : '<span style="color:var(--tenu)">Titre de la pétition</span>'}</p>
    ${plein(p.decideur) ? `<p class="surtitre" style="margin-bottom:10px">Adressée à ${esc(p.decideur)}</p>` : ''}
    ${plein(p.probleme) ? `<p style="font-size:.94rem">${esc(p.probleme)}</p>` : ''}
    ${plein(p.solution) ? `<p style="font-size:.94rem"><strong>${esc(p.solution)}</strong></p>` : ''}
    ${plein(p.urgence) ? `<p class="note">${esc(p.urgence)}</p>` : ''}
  </div>`;
}

/* ================================================================ */
/*  14 — Check-list de la rencontre                                 */
/* ================================================================ */
function rencontre() {
  const o = data().o14;
  const bloc = (cle, titre) => `<div class="carte">
    <div class="carte-tete"><h3>${titre}</h3>
      <span class="surtitre">${(o[cle] || []).length} / ${CHECKLIST[cle].length}</span></div>
    ${coches('o14.' + cle, CHECKLIST[cle], { compteur: false })}</div>`;
  return `${bloc('avant', 'Avant la rencontre')}${bloc('pendant', 'Pendant')}${bloc('apres', 'Après')}
  <div class="carte">
    <h3>Comptes rendus</h3>
    ${o.comptes.length ? o.comptes.map((c, i) => `<div style="border-top:1px solid var(--bord-doux);padding-top:14px;margin-top:14px">
      <div class="grille g2">
        <div>${champ(`o14.comptes.${i}.date`, 'Date', { lignes: 0, type: 'date' })}
             ${champ(`o14.comptes.${i}.qui`, 'Rencontré·e', { ph: 'Nom, fonction', lignes: 0 })}</div>
        <div>${champ(`o14.comptes.${i}.engagement`, 'Engagement obtenu', { ph: 'Même vague', lignes: 0 })}
             ${champ(`o14.comptes.${i}.suite`, 'Prochaine échéance', { lignes: 0 })}</div>
      </div>
      ${champ(`o14.comptes.${i}.resume`, 'Ce qui s’est dit — et les résistances entendues',
        { aide: 'vos arguments de la prochaine fois', ph: '…', lignes: 3 })}
      ${bouton('Supprimer ce compte rendu', 'retirer', { classe: 'danger petit', data: { chemin: 'o14.comptes', i } })}
    </div>`).join('') : videMsg('Aucun compte rendu', 'À rédiger dans les 48 h, tant que les formulations exactes sont fraîches.')}
    <div class="rangee fin">${bouton('Ajouter un compte rendu', 'ajouter-objet', { classe: 'fort', ico: 'plus', data: { chemin: 'o14.comptes', modele: 'compte' } })}</div>
  </div>`;
}

/* ================================================================ */
/*  15 — Suivi et évaluation                                        */
/* ================================================================ */
function suivi() {
  const d = data();
  const o = d.o15;
  const q = OUTILS.find(x => x.id === 15).questions;
  const suivies = [...d.o12.cibles.map(c => c.nom), ...d.o4.acteurs.filter(a => a.rang === 'principale').map(a => a.nom)]
    .filter(plein).filter((v, i, t) => t.indexOf(v) === i);
  return `<div class="carte">
    <h3>Journal de bord</h3>
    ${o.journal.length ? `<div class="defile"><table class="tableau">
      <thead><tr><th>Date</th><th>Objectif</th><th>Action</th><th>Résultat</th><th>Qui</th><th></th></tr></thead>
      <tbody>${o.journal.map((j, i) => `<tr>
        <td style="width:150px"><input type="date" data-lien="o15.journal.${i}.date" value="${esc(j.date)}" aria-label="Date"></td>
        <td><input type="text" data-lien="o15.journal.${i}.objectif" value="${esc(j.objectif)}" placeholder="…" aria-label="Objectif"></td>
        <td><input type="text" data-lien="o15.journal.${i}.action" value="${esc(j.action)}" placeholder="…" aria-label="Action"></td>
        <td><input type="text" data-lien="o15.journal.${i}.resultat" value="${esc(j.resultat)}" placeholder="…" aria-label="Résultat"></td>
        <td><input type="text" data-lien="o15.journal.${i}.personnes" value="${esc(j.personnes)}" placeholder="…" aria-label="Personnes"></td>
        <td style="width:36px"><button class="bouton discret petit" data-agir="retirer" data-chemin="o15.journal" data-i="${i}" aria-label="Retirer">${ico('croix', 13)}</button></td>
      </tr>`).join('')}</tbody></table></div>`
      : videMsg('Journal vide', 'Une ligne par action : c’est ce qui permettra de démontrer votre contribution.')}
    <div class="rangee fin">${bouton('Ajouter une entrée', 'ajouter-objet', { classe: 'fort', ico: 'plus', data: { chemin: 'o15.journal', modele: 'journal' } })}</div>
  </div>

  <div class="carte">
    <h3>Indicateurs et petites étapes</h3>
    <p class="chapo" style="font-size:.94rem">Découpez au plus fin : c'est ce qui rend le progrès visible quand la décision, elle, met deux ans.</p>
    ${o.indicateurs.length ? o.indicateurs.map((ind, i) => {
      const faites = (ind.etapes || []).filter(e => e.fait).length;
      const tot = (ind.etapes || []).length;
      return `<div style="border-top:1px solid var(--bord-doux);padding-top:14px;margin-top:14px">
        <div class="carte-tete">
          <div style="flex:1;min-width:180px">${champ(`o15.indicateurs.${i}.libelle`, 'Indicateur',
            { ph: 'Ex. : nombre de conseiller·ères rencontré·es', lignes: 0 })}</div>
          <span class="surtitre">${faites} / ${tot}</span>
        </div>
        ${tot ? `<div class="barre-score" style="margin-bottom:10px"><i style="width:${tot ? (faites / tot) * 100 : 0}%"></i></div>` : ''}
        <ul class="liste">${(ind.etapes || []).map((e, j) => `<li>
          <label class="coche ${e.fait ? 'faite' : ''}" style="flex:1">
            <input type="checkbox" data-agir="etape" data-i="${i}" data-j="${j}" ${e.fait ? 'checked' : ''}><span>${esc(e.txt)}</span></label>
          <span class="outils-ligne"><button class="bouton discret petit" data-agir="etape-retirer" data-i="${i}" data-j="${j}" aria-label="Retirer">${ico('croix', 13)}</button></span>
        </li>`).join('')}</ul>
        <div class="ajout"><input type="text" data-etape="${i}" placeholder="Ajouter une étape…" aria-label="Nouvelle étape">
          <button class="bouton" data-agir="etape-ajouter" data-i="${i}">${ico('plus', 14)}</button></div>
        <div class="rangee fin">${bouton('Supprimer l’indicateur', 'retirer', { classe: 'danger petit', data: { chemin: 'o15.indicateurs', i } })}</div>
      </div>`;
    }).join('') : videMsg('Aucun indicateur', 'Un objectif sans indicateur ne s’évalue pas.')}
    <div class="rangee fin">${bouton('Ajouter un indicateur', 'ajouter-objet', { classe: 'fort', ico: 'plus', data: { chemin: 'o15.indicateurs', modele: 'indicateur' } })}</div>
  </div>

  <div class="carte">
    <h3>Évolution des cibles</h3>
    <p class="chapo" style="font-size:.94rem">Trois niveaux d'engagement : conscientisation, volonté, action. On suit la position, pas seulement le résultat final.</p>
    ${suivies.length ? `<div style="margin-top:12px">${suivies.map(nom => {
      const val = o.engagements[nom] || 'aucun';
      return `<div style="padding:10px 0;border-bottom:1px solid var(--bord-doux)">
        <b style="font-size:13.5px;display:block;margin-bottom:6px">${esc(nom)}</b>
        <div class="echelle">${NIVEAUX_ENGAGEMENT.map(n => `
          <button type="button" data-agir="engagement" data-nom="${esc(nom)}" data-niveau="${n.cle}"
            aria-pressed="${val === n.cle}">${esc(n.nom)}</button>`).join('')}</div>
      </div>`;
    }).join('')}</div>`
      : videMsg('Aucune cible à suivre', 'Renseignez vos cibles dans les outils 4 et 12 : elles apparaîtront ici.')}
  </div>

  <div class="carte">
    <h3>L’évaluation</h3>
    ${q.map((x, i) => champ(`o15.evaluation.q${i}`, x, { lignes: 2 })).join('')}
  </div>`;
}

/* ================================================================ */
export const ATELIERS = {
  domino, profil, fleur, acteurs, toc, swot, pestel, fenetres, arbre, cinq, axes,
  rapport, strategie, smart, cibles, ciblage, reseau, message, medias, mobilisation, rencontre, suivi
};
