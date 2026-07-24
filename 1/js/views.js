/* ==================================================================
   VUES — tableau de bord, outil, dossier, réglages, flanc de nav
   ================================================================== */
import { OUTILS, ORDRE, PARTIES, PHASES, POSITIONS, PROFILS, PESTEL_AXES, NIVEAUX_ENGAGEMENT } from './content.js';
import {
  data, dossier, etat, avancement, avancementGlobal, avancementPartie, avancementPhase,
  estFait, prochainOutil, stockageOK
} from './store.js';
import { esc, plein, champ, ico, bouton, videMsg, dateCourte } from './ui.js';
import { ATELIERS } from './ateliers.js';

export const outilParId = id => OUTILS.find(o => o.id === Number(id));
export const outilsOrdonnes = () => ORDRE.map(outilParId).filter(Boolean);
export const encreDe = o => PARTIES[o.partie].encre;
const pct = f => Math.round(f * 100);

/* ================================================================ */
/*  FLANC DE NAVIGATION                                             */
/* ================================================================ */
export function flancHTML() {
  const g = avancementGlobal();
  const suivant = prochainOutil(ORDRE);
  const oSuivant = suivant ? outilParId(suivant) : null;
  const R = 21, C = 2 * Math.PI * R;
  const d = dossier();

  return `
  <div class="flanc-tete">
    <a class="marque" href="#/" aria-label="Accueil">
      <svg class="marque-logo" viewBox="0 0 64 64" aria-hidden="true">
        <rect x="6" y="6" width="52" height="52" rx="3" fill="none" stroke="currentColor" stroke-width="3"/>
        <rect x="12" y="30.5" width="40" height="3" fill="currentColor"/>
        <circle cx="20" cy="20" r="5" fill="var(--voir)"/><circle cx="32" cy="20" r="5" fill="var(--juger)"/>
        <circle cx="44" cy="20" r="5" fill="var(--agir)"/><circle cx="32" cy="44" r="6" fill="currentColor"/>
      </svg>
      <span class="marque-nom">Atelier<br>plaidoyer</span>
    </a>
    <button class="selecteur" data-agir="ouvrir-dossiers" aria-label="Changer de dossier">
      <span style="flex:1;min-width:0">
        <span class="surtitre">Dossier</span>
        <span class="titre-dossier">${esc(d.nom) || 'Sans titre'}</span>
      </span>${ico('chevron', 15)}
    </button>
  </div>

  <div class="flanc-progres">
    <svg class="anneau" width="52" height="52" viewBox="0 0 52 52" aria-hidden="true">
      <circle class="piste" cx="26" cy="26" r="${R}"/>
      <circle class="arc" cx="26" cy="26" r="${R}" stroke-dasharray="${(g.fraction * C).toFixed(1)} ${C.toFixed(1)}"
        transform="rotate(-90 26 26)"/>
      <text x="26" y="31" text-anchor="middle">${pct(g.fraction)}</text>
    </svg>
    <div class="progres-txt">
      <b>${g.faits} / ${g.total}</b>
      <span>${oSuivant ? 'À suivre : ' + esc(oSuivant.titre) : 'Dossier complet'}</span>
    </div>
  </div>

  <nav class="flanc-nav" aria-label="Les outils">
    ${Object.values(PARTIES).map(p => `
      <div class="groupe-tete"><span class="jeton ${p.encre}"></span><b>${esc(p.titre)}</b>
        <i>${pct(avancementPartie(p.cle))} %</i></div>
      ${outilsOrdonnes().filter(o => o.partie === p.cle).map(o => {
        const a = avancement(o.id);
        return `<a class="lien-outil ${p.encre}" href="#/outil/${o.id}">
          <span class="rang">${String(o.id).padStart(2, '0')}</span>
          <span>${esc(o.titre)}${o.complement ? ' <span class="plus">+</span>' : ''}</span>
          <span class="etat" data-p="${a >= 1 ? 1 : a > 0 ? 0.5 : 0}" aria-hidden="true"></span>
        </a>`;
      }).join('')}
    `).join('')}
  </nav>

  <div class="flanc-pied">
    <a class="bouton discret" href="#/dossier" style="flex:1">${ico('dossier', 15)} Dossier</a>
    <button class="bouton discret icone" data-agir="palette" title="Rechercher (Ctrl+K)" aria-label="Rechercher">${ico('recherche', 15)}</button>
    <a class="bouton discret icone" href="#/reglages" title="Réglages" aria-label="Réglages">${ico('reglages', 15)}</a>
  </div>`;
}

export function barreMobileHTML() {
  return `
  <button data-agir="menu" aria-label="Les outils">${ico('outils')}<span>Outils</span></button>
  <a href="#/" aria-label="Accueil">${ico('accueil')}<span>Accueil</span></a>
  <button data-agir="palette" aria-label="Rechercher">${ico('recherche')}<span>Chercher</span></button>
  <a href="#/dossier" aria-label="Dossier">${ico('dossier')}<span>Dossier</span></a>`;
}

/* ================================================================ */
/*  TABLEAU DE BORD                                                 */
/* ================================================================ */
export function vueAccueil() {
  const g = avancementGlobal();
  const suivant = prochainOutil(ORDRE);
  const oSuivant = suivant ? outilParId(suivant) : null;
  const d = dossier();
  const vierge = g.fraction === 0 && !plein(d.nom);

  return `<div class="scene">
    <div class="entree-scene">
      <span class="surtitre">Poste de travail du plaidoyer citoyen</span>
      <h1 class="affiche titre-geant"><span class="v">Voir</span>, <span class="j">juger</span>, <span class="a">agir</span></h1>
      <p class="chapo" style="max-width:60ch">Vingt-deux outils, chacun avec sa fiche méthodologique et son atelier.
      Le guide explique, l'atelier enregistre. Tout reste sur votre appareil et fonctionne sans connexion.</p>
      ${vierge ? `<div class="rangee fin">
        ${bouton('Commencer un plaidoyer', 'demarrer', { classe: 'fort', ico: 'fleche' })}
        ${bouton('Importer un dossier', 'importer', { ico: 'telecharger' })}
      </div>` : ''}
    </div>

    ${!vierge ? `<div class="carte" style="margin-bottom:20px">
      <div class="carte-tete">
        <h3>${esc(d.nom) || 'Sans titre'}</h3>
        <span class="surtitre">${g.faits} outils terminés sur ${g.total} · ${pct(g.fraction)} %</span>
      </div>
      <div class="grille g3">
        ${champ('__meta.nom', 'Nom du plaidoyer', { ph: "Ex. : Une rue apaisée devant l'école", lignes: 0 })}
        ${champ('__meta.cause', 'La cause en une ligne', { ph: 'Ce que vous voulez changer', lignes: 0 })}
        ${champ('__meta.collectif', 'Collectif ou organisation', { ph: 'Qui porte ce plaidoyer', lignes: 0 })}
      </div>
      ${oSuivant ? `<div class="encadre" style="margin-top:6px">
        <span class="surtitre">Prochaine étape conseillée</span>
        <p style="margin:6px 0 10px"><strong>${String(oSuivant.id).padStart(2, '0')} · ${esc(oSuivant.titre)}</strong> — ${esc(oSuivant.resume)}</p>
        <a class="bouton fort" href="#/outil/${oSuivant.id}">Ouvrir ${ico('fleche', 14)}</a>
      </div>` : `<div class="encadre info" style="margin-top:6px"><span class="surtitre">Bravo</span>
        <p>Les vingt-deux outils sont renseignés. Passez au dossier : il rassemble tout en une note de position imprimable.</p></div>`}
    </div>` : ''}

    <div class="carte">
      <div class="carte-tete"><h3>Le cycle</h3><span class="surtitre">avancement par phase</span></div>
      <div class="cycle">
        ${PHASES.map(p => {
          const f = avancementPhase(p.cle);
          return `<a class="phase" href="#/outil/${(OUTILS.find(o => o.phase === p.cle) || OUTILS[0]).id}">
            <b>${esc(p.nom)}</b><span>${pct(f)} %</span>
            <i class="barre" style="width:${pct(f)}%"></i></a>`;
        }).join('')}
      </div>
      <div class="dominos" role="list">
        ${outilsOrdonnes().map(o => {
          const a = avancement(o.id);
          const cl = a >= 1 ? 'faite ' + encreDe(o) : a > 0 ? 'partielle' : '';
          return `<a class="domino ${cl}" href="#/outil/${o.id}" role="listitem"
            title="${esc(o.titre)} — ${pct(a)} %"><span class="n">${String(o.id).padStart(2, '0')}</span>
            <span class="pip"></span></a>`;
        }).join('')}
      </div>
      <p class="note" style="margin-top:10px">Chaque domino est un outil. Il se remplit d'encre quand l'atelier est complet.</p>
    </div>

    <div class="suite">
      ${Object.values(PARTIES).map(p => {
        const l = outilsOrdonnes().filter(o => o.partie === p.cle);
        return `<div class="carte-partie">
          <div class="bande ${p.encre}"></div>
          <div class="dedans">
            <span class="surtitre">Partie ${p.num} · ${esc(p.accroche)}</span>
            <h2>${esc(p.titre)}</h2>
            <p>${esc(p.intro)}</p>
            <p class="note" style="margin:8px 0 12px">${l.length} outils · ${pct(avancementPartie(p.cle))} %</p>
            <a class="bouton" href="#/outil/${l[0].id}">Ouvrir ${ico('fleche', 14)}</a>
          </div></div>`;
      }).join('')}
    </div>

    ${!stockageOK ? `<div class="encadre alerte" style="margin-top:20px"><span class="surtitre">Stockage indisponible</span>
      <p>Votre navigateur bloque l'enregistrement local (mode privé, ou fichier ouvert directement depuis le disque).
      Le travail restera en mémoire jusqu'à la fermeture de l'onglet — pensez à exporter.</p></div>` : ''}

    <p class="note" style="margin-top:26px">Outils d'après « Le petit guide du plaidoyer citoyen — 15 outils vers le changement »,
    Commission Justice et Paix (2020), et le manuel de plaidoyer d'ULB-Coopération (2021).
    Les sept fiches marquées <span class="plus">+</span> sont des compléments tirés du second.</p>
  </div>`;
}

/* ================================================================ */
/*  PAGE D'OUTIL                                                    */
/* ================================================================ */
export function vueOutil(id, volet) {
  const o = outilParId(id);
  if (!o) return vueAccueil();
  const p = PARTIES[o.partie];
  const liste = outilsOrdonnes();
  const pos = liste.findIndex(x => x.id === o.id);
  const prec = liste[pos - 1], suiv = liste[pos + 1];
  const a = avancement(o.id);

  return `<div class="scene">
    <div class="rangee" style="margin-bottom:14px">
      <span class="etiquette ${p.encre}">Partie ${p.num} · ${esc(p.titre)}</span>
      <span class="etiquette">${esc(PHASES.find(x => x.cle === o.phase)?.nom || '')}</span>
      ${o.complement ? '<span class="etiquette">Complément ULB</span>' : ''}
      ${a >= 1 ? `<span class="etiquette pleine">${ico('check', 12)} terminé</span>`
        : a > 0 ? `<span class="etiquette">${pct(a)} % rempli</span>` : ''}
    </div>

    <div class="tete-outil">
      <span class="rang-geant" aria-hidden="true">${String(o.id).padStart(2, '0')}</span>
      <div>
        <h1>${esc(o.titre)}</h1>
        <p class="chapo" style="margin-top:8px;max-width:56ch">${esc(o.resume)}</p>
      </div>
    </div>

    <div class="bascule" role="tablist" aria-label="Guide ou atelier">
      <button role="tab" aria-selected="${volet === 'guide'}" data-agir="volet" data-volet="guide">Le guide</button>
      <button role="tab" aria-selected="${volet === 'atelier'}" data-agir="volet" data-volet="atelier">L’atelier</button>
    </div>

    <div class="volets">
      <div class="volet volet-guide" id="volet-guide" ${volet === 'atelier' ? 'data-mobile-cache="1"' : ''}>
        ${ficheHTML(o)}
      </div>
      <div class="volet" id="volet-atelier" ${volet === 'guide' ? 'data-mobile-cache="1"' : ''}>
        ${ATELIERS[o.atelier] ? ATELIERS[o.atelier]() : ''}
      </div>
    </div>

    <nav class="rangee" style="margin-top:36px;padding-top:18px;border-top:1px solid var(--bord-doux)" aria-label="Navigation entre outils">
      ${prec ? `<a class="bouton" href="#/outil/${prec.id}">← ${esc(prec.titre)}</a>` : `<a class="bouton" href="#/">← Accueil</a>`}
      <span style="flex:1"></span>
      ${suiv ? `<a class="bouton fort" href="#/outil/${suiv.id}">${esc(suiv.titre)} →</a>` : `<a class="bouton fort" href="#/dossier">Voir le dossier →</a>`}
    </nav>
  </div>`;
}

function ficheHTML(o) {
  return `<div class="fiche carte">
    <section><h4>Objectif</h4><p>${o.objectif}</p></section>
    <section><h4>Méthode</h4><ul>${o.methode.map(m => `<li>${m}</li>`).join('')}</ul></section>
    <section><h4>Le point qui fait la différence</h4>
      <div class="encadre"><p>${o.pointcle}</p></div></section>
    <section><h4>Questions à se poser</h4><ul>${o.questions.map(q => `<li>${esc(q)}</li>`).join('')}</ul></section>
    ${o.exemple ? `<section><h4>Exemple</h4><p class="exemple">${esc(o.exemple)}</p></section>` : ''}
    ${o.source ? `<p class="note">${o.source}</p>` : ''}
  </div>`;
}

/* ================================================================ */
/*  DOSSIER                                                         */
/* ================================================================ */
export function vueDossier() {
  const d = data(), m = dossier();
  const g = avancementGlobal();
  const bloc = (t, v) => plein(v) ? `<h3>${t}</h3><p>${esc(v).replace(/\n/g, '<br>')}</p>` : '';
  const ul = (t, arr) => (arr && arr.length) ? `<h3>${t}</h3><ul>${arr.map(x => `<li>${esc(x)}</li>`).join('')}</ul>` : '';

  return `<div class="scene etroit">
    <div class="dossier">
      <div class="couverture">
        <span class="surtitre">Dossier de plaidoyer</span>
        <h1 class="affiche" style="font-size:clamp(32px,6vw,58px);margin:8px 0 8px">${esc(m.nom) || 'Sans titre'}</h1>
        <p class="chapo">${esc(m.cause)}${plein(m.collectif) ? ' — ' + esc(m.collectif) : ''}</p>
        <p class="note">${g.faits} outils sur ${g.total} renseignés · mis à jour le ${dateCourte(m.maj)}</p>
        <div class="rangee fin">
          ${bouton('Imprimer / PDF', 'imprimer', { classe: 'fort', ico: 'imprimer' })}
          ${bouton('Exporter en Markdown', 'exporter-md', { ico: 'telecharger' })}
          ${bouton('Exporter en JSON', 'exporter', { ico: 'telecharger' })}
        </div>
      </div>

      <h2>1 · Voir</h2>
      ${bloc('Pourquoi nous nous engageons', d.o1.pourquoi)}${bloc('Nos valeurs', d.o1.valeurs)}
      ${bloc('Le changement visé', d.o1.changements)}${bloc('Premières actions', d.o1.actions)}
      ${d.o2.equipe.length ? `<h3>L’équipe</h3><ul>${d.o2.equipe.map(x => `<li>${esc(x.nom || '—')} — ${esc(PROFILS[x.profil]?.nom || '')}</li>`).join('')}</ul>` : ''}
      ${d.o3.petales.some(p => plein(p.moi) || plein(p.cible)) ? `<h3>Fleur de pouvoir</h3><ul>${d.o3.petales
        .filter(p => plein(p.moi) || plein(p.cible))
        .map(p => `<li>${esc(p.cat)} — nous : ${esc(p.moi) || '—'} / cible : ${esc(p.cible) || '—'}</li>`).join('')}</ul>` : ''}
      ${bloc('Ce que l’écart change', d.o3.notes)}
      ${d.o4.acteurs.length ? `<h3>Acteur·trice·s</h3><ul>${d.o4.acteurs.filter(a => plein(a.nom)).map(a =>
        `<li><strong>${esc(a.nom)}</strong> — pouvoir ${esc(a.pouvoir)} (${esc(a.niveau)}), ${esc(POSITIONS.find(p => p.cle === a.position)?.nom || '')},
         influence ${esc(a.influence)}/5, intérêt ${esc(a.interet)}/5, cible ${esc(a.rang)}${plein(a.notes) ? '. ' + esc(a.notes) : ''}</li>`).join('')}</ul>` : ''}

      <h2>2 · Juger</h2>
      ${bloc('Valeurs', d.o5.valeurs)}${bloc('Hypothèses', d.o5.hypotheses)}${bloc('Vision', d.o5.vision)}${bloc('Missions', d.o5.missions)}
      ${ul('Conditions à court terme', d.o5.court)}${ul('À moyen terme', d.o5.moyen)}${ul('À long terme', d.o5.long)}
      ${ul('Forces', d.o6.forces)}${ul('Faiblesses', d.o6.faiblesses)}${ul('Opportunités', d.o6.opportunites)}${ul('Menaces', d.o6.menaces)}
      ${PESTEL_AXES.map(a => ul('PESTEL — ' + a.nom, d.o7[a.cle])).join('')}
      ${d.o16.echeances.length ? `<h3>Fenêtres d’opportunité</h3><ul>${d.o16.echeances
        .filter(e => plein(e.quoi)).map(e => `<li>${esc(e.date || '—')} · ${esc(e.quoi)} (${esc(e.niveau)})${plein(e.prise) ? ' — ' + esc(e.prise) : ''}</li>`).join('')}</ul>` : ''}
      ${bloc('Problème central', d.o8.probleme)}${ul('Causes profondes', d.o8.causes)}${ul('Conséquences', d.o8.consequences)}
      ${bloc('Objectif', d.o8.objectif)}${ul('Moyens à obtenir', d.o8.moyens)}
      ${plein(d.o9.pourquoi[4]) ? `<h3>Cause profonde (5 pourquoi)</h3><p>${esc(d.o9.pourquoi[4])}</p>` : ''}
      ${d.o17.axes.length ? `<h3>Axes stratégiques</h3><ul>${d.o17.axes.filter(a => plein(a.libelle))
        .map(a => `<li>${esc(a.libelle)}</li>`).join('')}</ul>` : ''}

      <h2>3 · Agir</h2>
      ${ul('Agir avec le pouvoir', d.o10.avec)}${ul('Agir contre', d.o10.contre)}${ul('Agir sans', d.o10.sans)}
      ${bloc('Théorie du changement politique retenue', d.o18.theorie)}${bloc('Plan de repli', d.o18.repli)}
      ${d.o11.objectifs.length ? `<h3>Objectifs SMART</h3><ul>${d.o11.objectifs.map(o =>
        `<li>D’ici ${esc(o.temps) || '…'}, obtenir ${esc(o.decision) || '…'} en faisant ${esc(o.action) || '…'} grâce à ${esc(o.moyen) || '…'}.</li>`).join('')}</ul>` : ''}
      ${d.o12.cibles.length ? `<h3>Cibles</h3><ul>${d.o12.cibles.map(c =>
        `<li><strong>${esc(c.nom)}</strong> (niveau ${esc(c.niveau)}) — gagne : ${esc(c.gagne) || '—'} ; perd : ${esc(c.perd) || '—'} ; argument : ${esc(c.argument) || '—'}</li>`).join('')}</ul>` : ''}
      ${d.o19.fiches.filter(f => plein(f.nom)).map(f => `<h3>Fiche de ciblage — ${esc(f.nom)}</h3><ul>
        ${[['Représentant·e', f.representant], ['Objectifs', f.objectifs], ['Action souhaitée', f.action],
           ['Accès', f.acces], ['Détonateur', f.detonateur], ['Langage', f.langage], ['Canaux', f.canaux],
           ['Rend des comptes à', f.comptes]].filter(([, v]) => plein(v))
          .map(([l, v]) => `<li>${l} : ${esc(v)}</li>`).join('')}</ul>`).join('')}
      ${d.o12.allies.length ? `<h3>Allié·e·s</h3><ul>${d.o12.allies.map(c =>
        `<li><strong>${esc(c.nom)}</strong> — apporte ${esc(c.apport) || '—'} ; risques : ${esc(c.risques) || '—'}</li>`).join('')}</ul>` : ''}
      ${d.o20.membres.length ? `<h3>Réseau</h3><ul>${d.o20.membres.filter(x => plein(x.nom))
        .map(x => `<li>${esc(x.nom)} — ${esc(x.type)}${plein(x.cible) ? ', pèse sur ' + esc(x.cible) : ''}</li>`).join('')}</ul>` : ''}
      ${d.o13.messages.length ? `<h3>Messages</h3>${d.o13.messages.map(m2 =>
        `<p>${esc(m2.accroche)}<br>${esc(m2.probleme)}<br>${esc(m2.importance)}<br><strong>${esc(m2.cible)}</strong> : ${esc(m2.action)}</p>`).join('')}` : ''}
      ${plein(d.o22.petition.titre) ? `<h3>Pétition</h3><p><strong>${esc(d.o22.petition.titre)}</strong><br>
        Adressée à ${esc(d.o22.petition.decideur)}<br>${esc(d.o22.petition.solution)}</p>` : ''}
      ${d.o14.comptes.length ? `<h3>Rencontres</h3><ul>${d.o14.comptes.map(c =>
        `<li>${esc(c.date)} — ${esc(c.qui)} : ${esc(c.resume)} ${plein(c.engagement) ? '<em>' + esc(c.engagement) + '</em>' : ''}</li>`).join('')}</ul>` : ''}
      ${d.o15.journal.length ? `<h3>Journal de bord</h3><ul>${d.o15.journal.map(j =>
        `<li>${esc(j.date)} — ${esc(j.action)} → ${esc(j.resultat)}</li>`).join('')}</ul>` : ''}
      ${Object.keys(d.o15.engagements).length ? `<h3>Évolution des cibles</h3><ul>${Object.entries(d.o15.engagements)
        .map(([nom, n]) => `<li>${esc(nom)} : ${esc(NIVEAUX_ENGAGEMENT.find(x => x.cle === n)?.nom || n)}</li>`).join('')}</ul>` : ''}

      <p class="note" style="margin-top:30px">Dossier produit avec l’Atelier plaidoyer.
      Outils d’après la Commission Justice et Paix et ULB-Coopération.</p>
    </div>
  </div>`;
}

/* ================================================================ */
/*  RÉGLAGES                                                        */
/* ================================================================ */
export function vueReglages(theme) {
  return `<div class="scene etroit">
    <span class="surtitre">Réglages</span>
    <h1 class="affiche" style="font-size:clamp(30px,5vw,46px);margin:8px 0 22px">Préférences et données</h1>

    <div class="carte">
      <h3>Apparence</h3>
      <div class="rangee">
        ${['auto', 'clair', 'sombre'].map(t => `<button class="bouton ${theme === t ? 'fort' : ''}" data-agir="theme" data-theme="${t}">
          ${t === 'clair' ? ico('soleil', 14) : t === 'sombre' ? ico('lune', 14) : ''} ${t}</button>`).join('')}
      </div>
    </div>

    <div class="carte">
      <h3>Mes dossiers</h3>
      <p class="chapo" style="font-size:.94rem">Un dossier par plaidoyer. Vous pouvez en mener plusieurs de front — même si le manuel conseille de n'en porter que deux ou trois.</p>
      <div class="defile" style="margin-top:12px"><table class="tableau">
        <thead><tr><th>Nom</th><th>Avancement</th><th>Modifié</th><th></th></tr></thead>
        <tbody>${etat.dossiers.map(x => {
          const f = OUTILS.reduce((s, o) => s + avancement(o.id, x.d), 0) / OUTILS.length;
          return `<tr>
            <td><strong>${esc(x.nom) || 'Sans titre'}</strong>${x.id === etat.actif ? ' <span class="etiquette voir">actif</span>' : ''}
              ${plein(x.cause) ? `<br><span class="note">${esc(x.cause)}</span>` : ''}</td>
            <td style="white-space:nowrap">${pct(f)} %</td>
            <td style="white-space:nowrap">${dateCourte(x.maj)}</td>
            <td style="white-space:nowrap">
              ${x.id !== etat.actif ? bouton('Ouvrir', 'basculer-dossier', { classe: 'petit', data: { id: x.id } }) : ''}
              ${bouton('Dupliquer', 'dupliquer-dossier', { classe: 'petit discret', data: { id: x.id } })}
              ${etat.dossiers.length > 1 ? bouton('Supprimer', 'supprimer-dossier', { classe: 'petit danger', data: { id: x.id } }) : ''}
            </td></tr>`;
        }).join('')}</tbody></table></div>
      <div class="rangee fin">${bouton('Nouveau dossier', 'nouveau-dossier', { classe: 'fort', ico: 'plus' })}</div>
    </div>

    <div class="carte">
      <h3>Sauvegarde</h3>
      <p class="chapo" style="font-size:.94rem">Tout est enregistré dans ce navigateur, sur cet appareil. Rien n'est envoyé sur un serveur — donc rien n'est sauvegardé ailleurs. Exportez régulièrement.</p>
      <div class="rangee fin">
        ${bouton('Exporter ce dossier', 'exporter', { classe: 'fort', ico: 'telecharger' })}
        ${bouton('Exporter tous les dossiers', 'exporter-tout', { ico: 'telecharger' })}
        ${bouton('Importer', 'importer')}
        ${bouton('Effacer ce dossier', 'effacer', { classe: 'danger' })}
      </div>
      <input type="file" id="fichier-import" accept="application/json" hidden>
    </div>

    <div class="carte">
      <h3>Raccourcis</h3>
      <table class="tableau"><tbody>
        <tr><td><kbd>Ctrl</kbd> <kbd>K</kbd></td><td>Rechercher un outil ou une note</td></tr>
        <tr><td><kbd>←</kbd> <kbd>→</kbd></td><td>Outil précédent / suivant</td></tr>
        <tr><td><kbd>G</kbd></td><td>Basculer guide / atelier</td></tr>
        <tr><td><kbd>Échap</kbd></td><td>Fermer</td></tr>
      </tbody></table>
      <p class="note" style="margin-top:10px">Les flèches ne s'activent pas pendant la saisie dans un champ.</p>
    </div>

    <div class="carte">
      <h3>À propos</h3>
      <p style="font-size:.94rem">Outils et méthode : Commission Justice et Paix francophone de Belgique,
      <em>Le petit guide du plaidoyer citoyen — 15 outils vers le changement</em> (2020) ;
      ULB-Coopération, manuel de plaidoyer (2021), nourri des formations ACE Europe et CAP Impact.
      La trame voir / juger / agir vient de Joseph Cardijn.</p>
      <p class="note">Polices : Bricolage Grotesque, Public Sans, JetBrains Mono (licence SIL Open Font).</p>
    </div>
  </div>`;
}
