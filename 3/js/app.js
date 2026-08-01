/* ============================================================
   PLAIDOYER CITOYEN ULTIME — cœur applicatif
   Fusion : gamification (/2/) + atelier complet (#B!Mi)
   + palette de commande et double thème (/1/).
   Vanilla JS, aucune dépendance, données locales.
   ============================================================ */
"use strict";

const CLE = "plaidoyer.ultime.v1";
const ANCIENNES_CLES = ["plaidoyer2.v1"];
const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));

/* ---------- État ---------- */
function etatVierge() {
  return {
    version: 3,
    theme: null,            // null = suivre le système ; "clair" | "sombre"
    xp: 0,
    streak: { last: null, count: 0, best: 0 },
    stats: { revues: 0, quiz: 0, parfait: 0, smart: 0, message: 0, acteurs: 0, taches: 0, journal: 0 },
    badges: [],
    srs: {},
    cartesPerso: [],
    projets: [],
    journal: []
  };
}

function projetVierge(nom, desc) {
  return {
    id: "prj" + Date.now() + Math.random().toString(36).slice(2, 6),
    nom, desc: desc || "", cree: Date.now(), modifie: Date.now(),
    // VOIR
    domino: { vision: "", ressources: "", obstacles: "" },
    profil: { competences: "", motivations: "", limites: "", temps: "" },
    fleur: { identites: "", privileges: "", oppressions: "" },
    acteurs: [],            // {nom, type, pos:-2..2, inf:0..2, notes}
    // JUGER
    tdc: { actuelle: "", visee: "", ii: "", ie: "", ci: "", ce: "", hypotheses: "", chemin: "" },
    swot: { forces: "", faiblesses: "", opportunites: "", menaces: "" },
    pestel: { politique: "", economique: "", socioculturel: "", technologique: "", environnemental: "", legal: "" },
    arbre: { causes: "", probleme: "", consequences: "", moyens: "", objectif: "", resultats: "" },
    pourquoi: ["", "", "", "", ""],
    // AGIR
    pouvoir: { avec: "", sans: "", contre: "" },
    smarts: [],             // {id, temps(date ou texte), decision, action, moyen, statut: todo|doing|done}
    cibles: { principales: "", secondaires: "", allies: "" },
    message: { accroche: "", probleme: "", important: "", cible: "", action: "" },
    checklist: Array(10).fill(false),
    evaluation: { indicateurs: "", methodes: "", calendrier: "", lecons: "" },
    // ORGANISER
    taches: [],             // {id, titre, col: todo|doing|done, echeance}
    journalc: []            // {t, txt}
  };
}

/* ---------- Migrations & convertisseurs d'import ---------- */
function migrerProjet(p) {
  // Accepte les projets de la version /2/ et les complète
  const neuf = Object.assign(projetVierge(p.nom || "Projet importé"), p);
  neuf.id = p.id || neuf.id;
  // /2/ : smart objet unique → liste smarts
  if (p.smart && !Array.isArray(p.smart) && (p.smart.temps || p.smart.decision)) {
    neuf.smarts = neuf.smarts.length ? neuf.smarts :
      [{ id: "s" + Date.now(), temps: p.smart.temps || "", decision: p.smart.decision || "",
         action: p.smart.action || "", moyen: p.smart.moyen || "", statut: "todo" }];
  }
  delete neuf.smart;
  // /2/ : suivi texte → evaluation.lecons
  if (typeof p.suivi === "string" && p.suivi.trim() && !neuf.evaluation.lecons) {
    neuf.evaluation.lecons = p.suivi;
  }
  delete neuf.suivi;
  if (!Array.isArray(neuf.pourquoi)) neuf.pourquoi = ["", "", "", "", ""];
  while (neuf.pourquoi.length < 5) neuf.pourquoi.push("");
  if (!Array.isArray(neuf.checklist)) neuf.checklist = Array(10).fill(false);
  return neuf;
}

function convertirBimi(d) {
  // Import d'un projet #B!Mi (annexe) : {meta:{name}, acteurs:[{name,role,position,power}], smart:[...], pestel:{p,e,s,t,en,l}...}
  const p = projetVierge(d.meta?.name || "Projet #B!Mi", d.meta?.description || "");
  const cp = (src, dst, mapping) => { for (const [de, vers] of Object.entries(mapping)) if (src?.[de]) dst[vers] = String(src[de]); };
  cp(d.domino, p.domino, { vision: "vision", ressources: "ressources", obstacles: "obstacles" });
  cp(d.profil, p.profil, { competences: "competences", motivations: "motivations", limites: "limites", temps: "temps" });
  cp(d.fleur, p.fleur, { identites: "identites", privileges: "privileges", oppressions: "oppressions" });
  cp(d.swot, p.swot, { forces: "forces", faiblesses: "faiblesses", opportunites: "opportunites", menaces: "menaces" });
  cp(d.pestel, p.pestel, { p: "politique", e: "economique", s: "socioculturel", t: "technologique", en: "environnemental", l: "legal" });
  cp(d.arbre, p.arbre, { causes: "causes", probleme: "probleme", consequences: "consequences" });
  cp(d.pouvoir, p.pouvoir, { avec: "avec", sans: "sans", contre: "contre" });
  cp(d.cibles, p.cibles, { principales: "principales", secondaires: "secondaires", allies: "allies" });
  cp(d.message, p.message, { accroche: "accroche", probleme: "probleme", importance: "important", cible: "cible", action: "action" });
  cp(d.tdc, p.tdc, { actuelle: "actuelle", visee: "visee", hypotheses: "hypotheses", chemin: "chemin" });
  cp(d.evaluation, p.evaluation, { indicateurs: "indicateurs", methodes: "methodes", calendrier: "calendrier", lecons: "lecons" });
  if (d.pourquoi) p.pourquoi = [1, 2, 3, 4, 5].map(i => String(d.pourquoi["q" + i] || d.pourquoi[i - 1] || ""));
  const posMap = { ally: 2, allie: 2, neutral: 0, neutre: 0, target: 0, cible: 0, opponent: -2, opposant: -2 };
  for (const a of d.acteurs || []) {
    p.acteurs.push({
      nom: a.name || a.nom || "?", type: a.role || a.type || "autre",
      pos: typeof a.position === "number" ? Math.max(-2, Math.min(2, a.position)) : (posMap[String(a.position).toLowerCase()] ?? 0),
      inf: Math.max(0, Math.min(2, (parseInt(a.power ?? a.inf) || 1) - (a.power ? 1 : 0))),
      notes: ""
    });
  }
  for (const s of d.smart || []) {
    p.smarts.push({ id: "s" + Date.now() + Math.random().toString(36).slice(2, 5),
      temps: s.deadline || "", decision: s.text || "", action: "", moyen: s.indicator || "",
      statut: s.done || s.status === "done" ? "done" : (s.status === "inprogress" || s.status === "doing" ? "doing" : "todo") });
  }
  for (const j of d.journal || []) {
    p.journalc.push({ t: Date.parse(j.date) || Date.now(), txt: j.content || j.txt || String(j) });
  }
  return p;
}

function detecterEtConvertirProjet(d) {
  if (d.meta && (d.acteurs || d.smart || d.swot)) return convertirBimi(d);   // #B!Mi
  if (d.nom && (d.smart || d.smarts || d.swot)) return migrerProjet(d);       // /2/ ou ultime
  throw new Error("format de projet non reconnu");
}

let S = charger();
function charger() {
  try {
    const brut = localStorage.getItem(CLE);
    if (brut) {
      const d = Object.assign(etatVierge(), JSON.parse(brut));
      d.projets = d.projets.map(migrerProjet);
      return d;
    }
    // Migration douce depuis la version /2/
    for (const ancienne of ANCIENNES_CLES) {
      const vieux = localStorage.getItem(ancienne);
      if (vieux) {
        const d = Object.assign(etatVierge(), JSON.parse(vieux));
        d.projets = (d.projets || []).map(migrerProjet);
        return d;
      }
    }
  } catch (e) { console.warn("Lecture impossible :", e); }
  return etatVierge();
}
function sauver() {
  try { S.projets.forEach(p => p.modifie = p.modifie || Date.now()); localStorage.setItem(CLE, JSON.stringify(S)); }
  catch (e) { console.warn("Sauvegarde impossible :", e); }
}

/* ---------- Thème ---------- */
function appliquerTheme() {
  const t = S.theme || (matchMedia("(prefers-color-scheme: dark)").matches ? "sombre" : "clair");
  document.documentElement.dataset.theme = t;
  const b = $("#btn-theme");
  if (b) b.textContent = t === "sombre" ? "☀️" : "🌙";
}
function basculerTheme() {
  const actuel = document.documentElement.dataset.theme;
  S.theme = actuel === "sombre" ? "clair" : "sombre";
  sauver(); appliquerTheme();
  toast(S.theme === "sombre" ? "Mode rétro geek activé." : "Mode papier riso activé.");
}

/* ---------- XP, streak, badges ---------- */
function gagnerXp(pts, motif) {
  const avant = niveauDepuisXp(S.xp).n;
  S.xp += pts;
  S.journal.unshift({ t: Date.now(), txt: motif, xp: pts });
  S.journal = S.journal.slice(0, 80);
  const apres = niveauDepuisXp(S.xp).n;
  toucherStreak(); verifierBadges(); sauver(); majEntete();
  toast(`+${pts} XP — ${motif}`);
  if (apres > avant) setTimeout(() => toast(`⬆ Niveau ${apres} : ${NIVEAUX[Math.min(apres - 1, NIVEAUX.length - 1)]}`, true), 700);
}
function aujourdHui() { return new Date().toISOString().slice(0, 10); }
function toucherStreak() {
  const jour = aujourdHui();
  if (S.streak.last === jour) return;
  const hier = new Date(Date.now() - 864e5).toISOString().slice(0, 10);
  S.streak.count = (S.streak.last === hier) ? S.streak.count + 1 : 1;
  S.streak.last = jour;
  S.streak.best = Math.max(S.streak.best, S.streak.count);
}
function verifierBadges() {
  for (const b of BADGES_ULTIME) {
    if (!S.badges.includes(b.id) && b.test(S)) {
      S.badges.push(b.id);
      setTimeout(() => toast(`🏅 Tampon obtenu : ${b.nom}`, true), 400);
    }
  }
}
const BADGES_ULTIME = BADGES.concat([
  { id: "kanban",   nom: "Chef·fe d'orchestre", cond: "5 tâches menées à bien",     test: s => s.stats.taches >= 5 },
  { id: "plume",    nom: "Mémorialiste",        cond: "3 entrées au journal de campagne", test: s => s.stats.journal >= 3 },
  { id: "complet",  nom: "Stratégie complète",  cond: "Un projet complété à 100 %", test: s => (s.projets || []).some(p => { try { return avancementProjet(p) === 100; } catch (e) { return false; } }) }
]);

/* ---------- SRS ---------- */
function toutesLesCartes() { return CARTES.concat(S.cartesPerso); }
function fiche(id) { return S.srs[id] || { ef: 2.5, iv: 0, due: 0, n: 0 }; }
function cartesDues(deck) {
  const now = Date.now();
  return toutesLesCartes().filter(c => (!deck || c.deck === deck) && fiche(c.id).due <= now);
}
function noterCarte(id, q) {
  const f = fiche(id);
  if (q === 0) { f.iv = 0; f.n = 0; f.ef = Math.max(1.3, f.ef - 0.2); f.due = Date.now() + 6e4; }
  else {
    f.n++;
    f.ef = Math.max(1.3, f.ef + (q === 2 ? 0.1 : -0.05));
    f.iv = f.n === 1 ? 1 : f.n === 2 ? 3 : Math.round(f.iv * f.ef);
    if (q === 2 && f.n > 2) f.iv = Math.round(f.iv * 1.15);
    f.due = Date.now() + f.iv * 864e5;
  }
  S.srs[id] = f;
  S.stats.revues++;
  gagnerXp(q === 0 ? 2 : q === 1 ? 5 : 8, "Carte étudiée");
}

/* ---------- Toast ---------- */
let toastTimer;
function toast(msg, fete) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.toggle("fete", !!fete);
  t.classList.add("visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("visible"), 2600);
}

/* ---------- Routage ---------- */
const ROUTES = { accueil: vueAccueil, cartes: vueCartes, quiz: vueQuiz, atelier: vueAtelier, biblio: vueBiblio, donnees: vueDonnees };
function naviguer() {
  const h = (location.hash || "#accueil").slice(1).split("/");
  const vue = ROUTES[h[0]] || vueAccueil;
  $$(".nav a").forEach(a => a.classList.toggle("actif", a.dataset.vue === h[0]));
  vue(h.slice(1));
  $("#vue").focus({ preventScroll: true });
  window.scrollTo(0, 0);
}
window.addEventListener("hashchange", naviguer);

/* ---------- En-tête ---------- */
function majEntete() {
  const nv = niveauDepuisXp(S.xp);
  const pct = Math.min(100, Math.round(((S.xp - nv.base) / (nv.next - nv.base)) * 100));
  $("#hud").innerHTML = `
    <span class="hud-niveau">Niv. ${nv.n} · ${nv.nom}</span>
    <span class="hud-barre" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100" aria-label="Progression vers le niveau suivant">
      <span style="width:${pct}%"></span></span>
    <span class="hud-xp">${S.xp} XP</span>
    <span class="hud-flamme" title="Série de jours d'activité">🔥 ${S.streak.count}</span>
    <button class="btn btn-mini" id="btn-palette" title="Palette de commande (Ctrl K)">⌘ K</button>
    <button class="btn btn-mini" id="btn-theme" title="Basculer clair / sombre">🌙</button>`;
  $("#btn-theme").addEventListener("click", basculerTheme);
  $("#btn-palette").addEventListener("click", ouvrirPalette);
  appliquerTheme();
}

/* ============================================================
   PALETTE DE COMMANDE (Ctrl/Cmd + K)
   ============================================================ */
function actionsPalette() {
  const acts = [
    { t: "🏠 Tableau de bord", f: () => location.hash = "#accueil" },
    { t: "🃏 Flashcards — étudier", f: () => location.hash = "#cartes" },
    { t: "🎯 Lancer un quiz", f: () => { location.hash = "#quiz"; } },
    { t: "🛠 Atelier — mes projets", f: () => location.hash = "#atelier" },
    { t: "📚 Bibliothèque des outils", f: () => location.hash = "#biblio" },
    { t: "💾 Données — import / export", f: () => location.hash = "#donnees" },
    { t: "🌓 Basculer le thème clair / sombre", f: basculerTheme },
    { t: "➕ Nouveau projet", f: () => { location.hash = "#atelier"; setTimeout(() => $("#nom-projet")?.focus(), 80); } }
  ];
  for (const p of S.projets) {
    acts.push({ t: `📂 Ouvrir « ${p.nom} »`, f: () => location.hash = `#atelier/${p.id}` });
    for (const o of OUTILS) acts.push({ t: `   ${p.nom} → ${o.nom}`, f: () => location.hash = `#atelier/${p.id}/${o.id}`, discret: true });
  }
  return acts;
}
let paletteIdx = 0;
function ouvrirPalette() {
  fermerPalette();
  const div = document.createElement("div");
  div.id = "palette";
  div.innerHTML = `<div class="palette-boite" role="dialog" aria-label="Palette de commande">
    <input id="palette-q" placeholder="Chercher une action, un outil, un projet…" autocomplete="off">
    <ul id="palette-liste" role="listbox"></ul>
    <p class="palette-aide">↑↓ naviguer · Entrée ouvrir · Échap fermer</p></div>`;
  document.body.appendChild(div);
  div.addEventListener("click", e => { if (e.target === div) fermerPalette(); });
  const q = $("#palette-q");
  paletteIdx = 0;
  const rendre = () => {
    const terme = q.value.trim().toLowerCase();
    const tout = actionsPalette();
    const vis = tout.filter(a => !terme ? !a.discret : a.t.toLowerCase().includes(terme)).slice(0, 12);
    paletteIdx = Math.min(paletteIdx, Math.max(0, vis.length - 1));
    $("#palette-liste").innerHTML = vis.map((a, i) =>
      `<li role="option" aria-selected="${i === paletteIdx}" class="${i === paletteIdx ? "actif" : ""}" data-i="${i}">${echap(a.t)}</li>`).join("")
      || `<li class="vide">Aucun résultat</li>`;
    $$("#palette-liste li[data-i]").forEach(li => li.addEventListener("click", () => { fermerPalette(); vis[+li.dataset.i].f(); }));
    div._vis = vis;
  };
  q.addEventListener("input", () => { paletteIdx = 0; rendre(); });
  q.addEventListener("keydown", e => {
    const vis = div._vis || [];
    if (e.key === "ArrowDown") { e.preventDefault(); paletteIdx = Math.min(paletteIdx + 1, vis.length - 1); rendre(); }
    else if (e.key === "ArrowUp") { e.preventDefault(); paletteIdx = Math.max(paletteIdx - 1, 0); rendre(); }
    else if (e.key === "Enter" && vis[paletteIdx]) { fermerPalette(); vis[paletteIdx].f(); }
    else if (e.key === "Escape") fermerPalette();
  });
  rendre();
  q.focus();
}
function fermerPalette() { $("#palette")?.remove(); }
document.addEventListener("keydown", e => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); ouvrirPalette(); }
});

/* ============================================================
   VUES — apprentissage & tableau de bord
   ============================================================ */
function vueAccueil() {
  const dues = cartesDues().length;
  const nv = niveauDepuisXp(S.xp);
  const obtenus = BADGES_ULTIME.filter(b => S.badges.includes(b.id));
  $("#vue").innerHTML = `
  <section class="hero">
    <p class="eyebrow">Voir · Juger · Agir · Organiser</p>
    <h1>Le plaidoyer citoyen,<br>un métier qui s'apprend.</h1>
    <p class="hero-sous">Le poste de travail complet : mémorise les outils avec les flashcards, teste-toi au quiz, puis construis ta stratégie réelle dans l'atelier — 18 outils, kanban, frise, exports multiformats. Astuce : <kbd>Ctrl K</kbd> ouvre la palette de commande.</p>
    <div class="hero-actions">
      <a class="btn btn-plein" href="#cartes">${dues ? `Étudier — ${dues} carte${dues > 1 ? "s" : ""} à revoir` : "Étudier les cartes"}</a>
      <a class="btn" href="#atelier">Ouvrir l'atelier</a>
    </div>
  </section>

  <section class="tuiles">
    <article class="tuile"><h2>Progression</h2>
      <p class="grand-chiffre">${S.xp}<small> XP</small></p>
      <p>Niveau ${nv.n} — ${nv.nom}. Encore ${nv.next - S.xp} XP avant le niveau ${nv.n + 1}.</p></article>
    <article class="tuile"><h2>Série</h2>
      <p class="grand-chiffre">🔥 ${S.streak.count}<small> jour${S.streak.count > 1 ? "s" : ""}</small></p>
      <p>Record : ${S.streak.best}. Reviens chaque jour pour entretenir la flamme.</p></article>
    <article class="tuile"><h2>Mémoire</h2>
      <p class="grand-chiffre">${S.stats.revues}<small> revues</small></p>
      <p>${toutesLesCartes().length} cartes, ${dues} due${dues > 1 ? "s" : ""} maintenant.</p></article>
    <article class="tuile"><h2>Projets</h2>
      <p class="grand-chiffre">${S.projets.length}<small> en cours</small></p>
      <p>${S.projets.length ? S.projets.map(p => `<a href="#atelier/${p.id}">${echap(p.nom)}</a> (${avancementProjet(p)} %)`).join(" · ") : "Crée ton premier projet dans l'atelier."}</p></article>
  </section>

  <section>
    <h2 class="titre-section">Tampons du collectif</h2>
    <p class="note">Chaque tampon marque une étape franchie. ${obtenus.length}/${BADGES_ULTIME.length} obtenus.</p>
    <div class="tampons">
      ${BADGES_ULTIME.map(b => `
        <div class="tampon ${S.badges.includes(b.id) ? "obtenu" : ""}" title="${b.cond}">
          <span class="tampon-nom">${b.nom}</span>
          <span class="tampon-cond">${b.cond}</span>
        </div>`).join("")}
    </div>
  </section>

  ${S.journal.length ? `
  <section>
    <h2 class="titre-section">Journal de bord</h2>
    <ul class="journal">
      ${S.journal.slice(0, 8).map(j => `<li><span>${new Date(j.t).toLocaleDateString("fr-BE", { day: "numeric", month: "short" })}</span> ${j.txt} <b>+${j.xp} XP</b></li>`).join("")}
    </ul>
  </section>` : ""}`;
}

/* ---------- Flashcards ---------- */
let session = null;
function vueCartes(args) {
  if (args && args[0] === "session" && session) return rendreCarte();
  $("#vue").innerHTML = `
  <h1 class="titre-page">Flashcards</h1>
  <p class="note">Répétition espacée : les cartes reviennent juste avant que tu les oublies. Note honnêtement — c'est ton futur toi qui te remercie.</p>
  <div class="decks">
    ${DECKS.map(d => {
      const total = toutesLesCartes().filter(c => c.deck === d.id).length;
      const dues = cartesDues(d.id).length;
      return `<button class="deck phase-${d.phase}" data-deck="${d.id}" ${total ? "" : "disabled"}>
        <span class="deck-nom">${d.nom}</span>
        <span class="deck-info">${total} cartes · <b>${dues} due${dues > 1 ? "s" : ""}</b></span>
      </button>`;
    }).join("")}
    <button class="deck phase-socle" data-deck=""><span class="deck-nom">Tout réviser</span>
      <span class="deck-info">${toutesLesCartes().length} cartes · <b>${cartesDues().length} dues</b></span></button>
  </div>
  <details class="bloc-perso">
    <summary>➕ Ajouter une carte personnelle</summary>
    <label>Question<textarea id="pq" rows="2"></textarea></label>
    <label>Réponse<textarea id="pr" rows="3"></textarea></label>
    <label>Paquet<select id="pd">${DECKS.map(d => `<option value="${d.id}">${d.nom}</option>`).join("")}</select></label>
    <button class="btn" id="ajouter-carte">Ajouter la carte</button>
    ${S.cartesPerso.length ? `<p class="note">${S.cartesPerso.length} carte(s) personnelle(s). Gestion complète dans « Données ».</p>` : ""}
  </details>`;
  $$(".deck").forEach(b => b.addEventListener("click", () => demarrerSession(b.dataset.deck)));
  $("#ajouter-carte").addEventListener("click", () => {
    const q = $("#pq").value.trim(), r = $("#pr").value.trim();
    if (!q || !r) return toast("Question et réponse sont nécessaires.");
    S.cartesPerso.push({ id: "p" + Date.now(), deck: $("#pd").value, q, r, perso: true });
    gagnerXp(4, "Carte personnelle créée");
    vueCartes();
  });
}
function demarrerSession(deck) {
  let file = cartesDues(deck || null);
  if (!file.length) {
    file = toutesLesCartes().filter(c => !deck || c.deck === deck)
      .sort((a, b) => fiche(a.id).due - fiche(b.id).due).slice(0, 8);
    toast("Rien n'est dû — petite révision libre !");
  }
  file.sort(() => Math.random() - 0.5);
  session = { file, i: 0, face: 0, faits: 0 };
  location.hash = "#cartes/session";
  rendreCarte();
}
function rendreCarte() {
  const s = session;
  if (!s || s.i >= s.file.length) {
    const n = s ? s.faits : 0;
    session = null;
    $("#vue").innerHTML = `
      <div class="fin-session">
        <p class="tampon obtenu grand"><span class="tampon-nom">Session terminée</span><span class="tampon-cond">${n} carte${n > 1 ? "s" : ""} revue${n > 1 ? "s" : ""}</span></p>
        <div class="hero-actions centre">
          <a class="btn btn-plein" href="#cartes">Retour aux paquets</a>
          <a class="btn" href="#quiz">Enchaîner sur un quiz</a>
        </div>
      </div>`;
    return;
  }
  const c = s.file[s.i];
  const d = DECKS.find(x => x.id === c.deck);
  $("#vue").innerHTML = `
  <div class="session-tete"><a href="#cartes" class="lien-retour">← Paquets</a><span>${s.i + 1} / ${s.file.length}</span></div>
  <div class="carte phase-${d ? d.phase : "socle"} ${s.face ? "retournee" : ""}" id="la-carte" tabindex="0" role="button"
       aria-label="Carte. ${s.face ? "Réponse affichée" : "Appuyer pour révéler la réponse"}">
    <p class="carte-deck">${d ? d.nom : "Perso"}</p>
    <p class="carte-texte">${s.face ? c.r : c.q}</p>
    <p class="carte-indice">${s.face ? "" : "Cliquer ou touche Espace pour retourner"}</p>
  </div>
  ${s.face ? `
  <div class="notes-carte">
    <button class="btn note-0" data-n="0">↺ À revoir</button>
    <button class="btn note-1" data-n="1">Difficile</button>
    <button class="btn note-2" data-n="2">Facile ✓</button>
  </div>` : ""}`;
  const carte = $("#la-carte");
  const retourner = () => { s.face = 1; rendreCarte(); };
  if (!s.face) {
    carte.addEventListener("click", retourner);
    carte.addEventListener("keydown", e => { if (e.key === " " || e.key === "Enter") { e.preventDefault(); retourner(); } });
    carte.focus();
  }
  $$(".notes-carte .btn").forEach(b => b.addEventListener("click", () => {
    noterCarte(c.id, +b.dataset.n);
    s.faits++; s.i++; s.face = 0;
    rendreCarte();
  }));
}

/* ---------- Quiz ---------- */
let quiz = null;
function vueQuiz() {
  if (quiz) return rendreQuiz();
  $("#vue").innerHTML = `
  <h1 class="titre-page">Quiz</h1>
  <p class="note">10 questions tirées au sort. Bonne réponse : +10 XP. Sans faute : +25 XP et le tampon « Sans faute ».</p>
  <button class="btn btn-plein" id="go-quiz">Lancer le quiz</button>`;
  $("#go-quiz").addEventListener("click", () => {
    quiz = { qs: QUIZ.slice().sort(() => Math.random() - 0.5).slice(0, 10), i: 0, ok: 0, repondu: null };
    rendreQuiz();
  });
}
function rendreQuiz() {
  const z = quiz;
  if (z.i >= z.qs.length) {
    const parfait = z.ok === z.qs.length;
    S.stats.quiz++;
    if (parfait) S.stats.parfait++;
    gagnerXp(z.ok * 10 + (parfait ? 25 : 0), `Quiz terminé : ${z.ok}/${z.qs.length}`);
    const score = z.ok, total = z.qs.length;
    quiz = null;
    $("#vue").innerHTML = `
      <div class="fin-session">
        <p class="tampon ${score >= total * 0.7 ? "obtenu" : ""} grand">
          <span class="tampon-nom">${score} / ${total}</span>
          <span class="tampon-cond">${parfait ? "Sans faute — chapeau !" : score >= 7 ? "Solide. Le collectif peut compter sur toi." : "Retourne aux flashcards, puis retente ta chance."}</span></p>
        <div class="hero-actions centre">
          <a class="btn btn-plein" href="#quiz">Rejouer</a>
          <a class="btn" href="#cartes">Réviser les cartes</a>
        </div>
      </div>`;
    return;
  }
  const q = z.qs[z.i];
  $("#vue").innerHTML = `
  <div class="session-tete"><a href="#accueil" class="lien-retour">← Quitter</a><span>Question ${z.i + 1} / ${z.qs.length} · ${z.ok} ✓</span></div>
  <div class="quiz-q"><p>${q.q}</p></div>
  <div class="quiz-options">
    ${q.o.map((o, i) => {
      let cls = "";
      if (z.repondu !== null) cls = i === q.b ? "bon" : (i === z.repondu ? "mauvais" : "fade");
      return `<button class="btn option ${cls}" data-i="${i}" ${z.repondu !== null ? "disabled" : ""}>${o}</button>`;
    }).join("")}
  </div>
  ${z.repondu !== null ? `<p class="quiz-explication">${q.e}</p><button class="btn btn-plein" id="suivant">Question suivante →</button>` : ""}`;
  if (z.repondu === null) {
    $$(".option").forEach(b => b.addEventListener("click", () => {
      z.repondu = +b.dataset.i;
      if (z.repondu === q.b) z.ok++;
      rendreQuiz();
    }));
  } else {
    $("#suivant").addEventListener("click", () => { z.i++; z.repondu = null; rendreQuiz(); });
  }
}

/* ---------- Bibliothèque ---------- */
function vueBiblio() {
  const phases = [["voir", "VOIR — poser des constats"], ["juger", "JUGER — analyser le contexte"], ["agir", "AGIR — passer à l'action"]];
  $("#vue").innerHTML = `
  <h1 class="titre-page">Bibliothèque des outils</h1>
  <p class="note">Les outils des manuels en fiches d'action. Chacun a son espace de travail dans l'atelier.</p>
  ${phases.map(([id, titre]) => `
    <h2 class="titre-section bandeau-${id}">${titre}</h2>
    <div class="fiches">
      ${FICHES.filter(f => f.phase === id).map(f => `
        <article class="fiche phase-${id}"><h3>${f.nom}</h3><p>${f.txt}</p></article>`).join("")}
    </div>`).join("")}`;
}

/* ---------- Données ---------- */
function vueDonnees() {
  $("#vue").innerHTML = `
  <h1 class="titre-page">Données</h1>
  <p class="note">Tout est stocké dans ton navigateur, rien ne quitte ta machine. Exporte régulièrement pour sauvegarder ou changer d'appareil.</p>

  <section class="tuile">
    <h2>Sauvegarde complète (JSON)</h2>
    <p>Progression, cartes personnelles, projets, tampons — tout dans un fichier.</p>
    <div class="hero-actions">
      <button class="btn btn-plein" id="exp-tout">Exporter tout (.json)</button>
      <label class="btn fichier">Importer une sauvegarde<input type="file" id="imp-tout" accept=".json,application/json" hidden></label>
    </div>
  </section>

  <section class="tuile">
    <h2>Projets — import universel</h2>
    <p>Accepte les projets de la version /2/, de la version #B!Mi (annexe) et de celle-ci. Chaque projet s'exporte depuis l'atelier en Markdown, HTML, Word, agenda iCal, Mermaid, CSV, JSON et PDF.</p>
    <div class="hero-actions">
      <button class="btn" id="exp-projets" ${S.projets.length ? "" : "disabled"}>Exporter tous les projets (.md)</button>
      <label class="btn fichier">Importer un projet (.json)<input type="file" id="imp-projet" accept=".json" hidden></label>
    </div>
  </section>

  <section class="tuile">
    <h2>Flashcards (CSV)</h2>
    <p>Format : <code>question;réponse;paquet</code> — compatible tableur. Paquets : ${DECKS.map(d => d.id).join(", ")}.</p>
    <div class="hero-actions">
      <button class="btn" id="exp-csv">Exporter les cartes (.csv)</button>
      <label class="btn fichier">Importer des cartes<input type="file" id="imp-csv" accept=".csv,text/csv,text/plain" hidden></label>
    </div>
  </section>

  <section class="tuile zone-danger">
    <h2>Zone sensible</h2>
    <div class="hero-actions">
      <button class="btn btn-danger" id="raz-srs">Réinitialiser la répétition espacée</button>
      <button class="btn btn-danger" id="raz-tout">Tout effacer</button>
    </div>
  </section>`;

  $("#exp-tout").addEventListener("click", () =>
    telecharger(`plaidoyer-sauvegarde-${aujourdHui()}.json`, JSON.stringify(S, null, 2), "application/json"));
  $("#imp-tout").addEventListener("change", e => lireFichier(e, txt => {
    try {
      const data = JSON.parse(txt);
      if (typeof data.xp !== "number") throw new Error("format inattendu");
      S = Object.assign(etatVierge(), data);
      S.projets = S.projets.map(migrerProjet);
      sauver(); majEntete(); toast("Sauvegarde restaurée ✓"); vueDonnees();
    } catch (err) { toast("Fichier illisible : " + err.message); }
  }));
  $("#exp-csv").addEventListener("click", () => {
    const lignes = toutesLesCartes().map(c => [c.q, c.r, c.deck].map(csvCellule).join(";"));
    telecharger(`plaidoyer-cartes-${aujourdHui()}.csv`, "question;réponse;paquet\n" + lignes.join("\n"), "text/csv");
  });
  $("#imp-csv").addEventListener("change", e => lireFichier(e, txt => {
    const lignes = analyserCsv(txt);
    let n = 0;
    for (const l of lignes) {
      if (l.length < 2 || !l[0].trim() || /^question$/i.test(l[0].trim())) continue;
      const deck = DECKS.some(d => d.id === (l[2] || "").trim()) ? l[2].trim() : "fond";
      S.cartesPerso.push({ id: "p" + Date.now() + "_" + n, deck, q: l[0].trim(), r: (l[1] || "").trim(), perso: true });
      n++;
    }
    if (n) gagnerXp(Math.min(n * 2, 20), `${n} carte(s) importée(s)`);
    else toast("Aucune carte reconnue dans ce fichier.");
    vueDonnees();
  }));
  $("#exp-projets").addEventListener("click", () =>
    telecharger(`plaidoyer-projets-${aujourdHui()}.md`, S.projets.map(projetEnMarkdown).join("\n\n---\n\n"), "text/markdown"));
  $("#imp-projet").addEventListener("change", e => lireFichier(e, txt => {
    try {
      const p = detecterEtConvertirProjet(JSON.parse(txt));
      S.projets.push(p);
      sauver(); toast("Projet importé ✓"); location.hash = "#atelier/" + p.id;
    } catch (err) { toast("Fichier illisible : " + err.message); }
  }));
  $("#raz-srs").addEventListener("click", () => {
    if (confirm("Remettre toutes les cartes à zéro ?")) { S.srs = {}; sauver(); toast("Répétition espacée réinitialisée."); }
  });
  $("#raz-tout").addEventListener("click", () => {
    if (confirm("Tout effacer, vraiment ? Exporte d'abord si tu tiens à tes données.")) {
      localStorage.removeItem(CLE); S = etatVierge(); sauver(); majEntete(); naviguer();
    }
  });
}

/* ---------- Utilitaires ---------- */
function telecharger(nom, contenu, type) {
  const blob = contenu instanceof Blob ? contenu : new Blob(["\uFEFF" + contenu], { type: type + ";charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = nom;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 4000);
  toast("Fichier généré : " + nom);
}
function lireFichier(e, cb) {
  const f = e.target.files[0];
  if (!f) return;
  const r = new FileReader();
  r.onload = () => cb(r.result.replace(/^\uFEFF/, ""));
  r.readAsText(f, "utf-8");
  e.target.value = "";
}
function csvCellule(v) {
  v = String(v || "");
  return /[;"\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v;
}
function analyserCsv(txt) {
  const sep = (txt.split("\n")[0] || "").includes(";") ? ";" : ",";
  const lignes = [];
  let ligne = [], cellule = "", entre = false;
  for (let i = 0; i < txt.length; i++) {
    const c = txt[i];
    if (entre) {
      if (c === '"' && txt[i + 1] === '"') { cellule += '"'; i++; }
      else if (c === '"') entre = false;
      else cellule += c;
    } else if (c === '"') entre = true;
    else if (c === sep) { ligne.push(cellule); cellule = ""; }
    else if (c === "\n" || c === "\r") {
      if (cellule || ligne.length) { ligne.push(cellule); lignes.push(ligne); ligne = []; cellule = ""; }
    } else cellule += c;
  }
  if (cellule || ligne.length) { ligne.push(cellule); lignes.push(ligne); }
  return lignes;
}
function echap(v) { return String(v || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;"); }
function slug(v) { return v.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "projet"; }

/* ---------- Démarrage ---------- */
majEntete();
naviguer();
toucherStreak();
sauver();

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./sw.js").catch(() => {});
}
