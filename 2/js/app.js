/* ============================================================
   PLAIDOYER CITOYEN — Poste de travail gamifié
   Vanilla JS, aucune dépendance, données en localStorage.
   ============================================================ */
"use strict";

const CLE = "plaidoyer2.v1";
const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));

/* ---------- État ---------- */
function etatVierge() {
  return {
    version: 1,
    xp: 0,
    streak: { last: null, count: 0, best: 0 },
    stats: { revues: 0, quiz: 0, parfait: 0, smart: 0, message: 0, acteurs: 0 },
    badges: [],
    srs: {},                // id carte -> {ef, iv, due, n}
    cartesPerso: [],        // cartes ajoutées/importées
    projets: [],
    journal: []             // {t, txt, xp}
  };
}
let S = charger();

function charger() {
  try {
    const brut = localStorage.getItem(CLE);
    if (brut) return Object.assign(etatVierge(), JSON.parse(brut));
  } catch (e) { console.warn("Lecture impossible :", e); }
  return etatVierge();
}
function sauver() {
  try { localStorage.setItem(CLE, JSON.stringify(S)); }
  catch (e) { console.warn("Sauvegarde impossible :", e); }
}

/* ---------- XP, streak, badges ---------- */
function gagnerXp(pts, motif) {
  const avant = niveauDepuisXp(S.xp).n;
  S.xp += pts;
  S.journal.unshift({ t: Date.now(), txt: motif, xp: pts });
  S.journal = S.journal.slice(0, 60);
  const apres = niveauDepuisXp(S.xp).n;
  toucherStreak();
  verifierBadges();
  sauver();
  majEntete();
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
  for (const b of BADGES) {
    if (!S.badges.includes(b.id) && b.test(S)) {
      S.badges.push(b.id);
      setTimeout(() => toast(`🏅 Tampon obtenu : ${b.nom}`, true), 400);
    }
  }
}

/* ---------- SRS (SM-2 simplifié) ---------- */
function toutesLesCartes() { return CARTES.concat(S.cartesPerso); }
function fiche(id) { return S.srs[id] || { ef: 2.5, iv: 0, due: 0, n: 0 }; }
function cartesDues(deck) {
  const now = Date.now();
  return toutesLesCartes().filter(c => (!deck || c.deck === deck) && fiche(c.id).due <= now);
}
function noterCarte(id, q /*0=à revoir 1=difficile 2=facile*/) {
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
    <span class="hud-flamme" title="Série de jours d'étude">🔥 ${S.streak.count}</span>`;
}

/* ============================================================
   VUES
   ============================================================ */
function vueAccueil() {
  const dues = cartesDues().length;
  const nv = niveauDepuisXp(S.xp);
  const obtenus = BADGES.filter(b => S.badges.includes(b.id));
  $("#vue").innerHTML = `
  <section class="hero">
    <p class="eyebrow">Voir · Juger · Agir</p>
    <h1>Le plaidoyer citoyen,<br>un métier qui s'apprend.</h1>
    <p class="hero-sous">Un poste de travail complet pour maîtriser les 15 outils du plaidoyer : mémorise avec des flashcards, teste-toi au quiz, puis construis ta vraie stratégie dans l'atelier.</p>
    <div class="hero-actions">
      <a class="btn btn-plein" href="#cartes">${dues ? `Étudier — ${dues} carte${dues > 1 ? "s" : ""} à revoir` : "Étudier les cartes"}</a>
      <a class="btn" href="#atelier">Ouvrir l'atelier</a>
    </div>
  </section>

  <section class="tuiles">
    <article class="tuile">
      <h2>Progression</h2>
      <p class="grand-chiffre">${S.xp}<small> XP</small></p>
      <p>Niveau ${nv.n} — ${nv.nom}. Encore ${nv.next - S.xp} XP avant le niveau ${nv.n + 1}.</p>
    </article>
    <article class="tuile">
      <h2>Série</h2>
      <p class="grand-chiffre">🔥 ${S.streak.count}<small> jour${S.streak.count > 1 ? "s" : ""}</small></p>
      <p>Record : ${S.streak.best} jour${S.streak.best > 1 ? "s" : ""}. Reviens chaque jour pour entretenir la flamme.</p>
    </article>
    <article class="tuile">
      <h2>Mémoire</h2>
      <p class="grand-chiffre">${S.stats.revues}<small> revues</small></p>
      <p>${toutesLesCartes().length} cartes au total, ${dues} due${dues > 1 ? "s" : ""} maintenant.</p>
    </article>
    <article class="tuile">
      <h2>Projets</h2>
      <p class="grand-chiffre">${S.projets.length}<small> en cours</small></p>
      <p>${S.projets.length ? "Continue ton travail dans l'atelier." : "Crée ton premier projet de plaidoyer dans l'atelier."}</p>
    </article>
  </section>

  <section>
    <h2 class="titre-section">Tampons du collectif</h2>
    <p class="note">Chaque tampon marque une étape franchie. ${obtenus.length}/${BADGES.length} obtenus.</p>
    <div class="tampons">
      ${BADGES.map(b => `
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
  const v = $("#vue");
  v.innerHTML = `
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
    <label>Paquet
      <select id="pd">${DECKS.map(d => `<option value="${d.id}">${d.nom}</option>`).join("")}</select>
    </label>
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
    // rien de dû : proposer une révision libre des 8 cartes les plus anciennes
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
        <div class="hero-actions">
          <a class="btn btn-plein" href="#cartes">Retour aux paquets</a>
          <a class="btn" href="#quiz">Enchaîner sur un quiz</a>
        </div>
      </div>`;
    return;
  }
  const c = s.file[s.i];
  const d = DECKS.find(x => x.id === c.deck);
  $("#vue").innerHTML = `
  <div class="session-tete">
    <a href="#cartes" class="lien-retour">← Paquets</a>
    <span>${s.i + 1} / ${s.file.length}</span>
  </div>
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
  <p class="note">10 questions tirées au sort. Bonne réponse : +10 XP. Sans faute : tampon « Sans faute ».</p>
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
    const score = z.ok; const total = z.qs.length;
    quiz = null;
    $("#vue").innerHTML = `
      <div class="fin-session">
        <p class="tampon ${score >= total * 0.7 ? "obtenu" : ""} grand">
          <span class="tampon-nom">${score} / ${total}</span>
          <span class="tampon-cond">${parfait ? "Sans faute — chapeau !" : score >= 7 ? "Solide. Le collectif peut compter sur toi." : "Retourne aux flashcards, puis retente ta chance."}</span></p>
        <div class="hero-actions">
          <a class="btn btn-plein" href="#quiz" onclick="quiz=null">Rejouer</a>
          <a class="btn" href="#cartes">Réviser les cartes</a>
        </div>
      </div>`;
    return;
  }
  const q = z.qs[z.i];
  $("#vue").innerHTML = `
  <div class="session-tete"><a href="#accueil" class="lien-retour" onclick="quiz=null">← Quitter</a><span>Question ${z.i + 1} / ${z.qs.length} · ${z.ok} ✓</span></div>
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

/* ---------- Atelier (projets) ---------- */
function projetVierge(nom) {
  return {
    id: "prj" + Date.now(), nom, cree: Date.now(),
    smart: { temps: "", decision: "", action: "", moyen: "" },
    message: { accroche: "", probleme: "", important: "", cible: "", action: "" },
    swot: { forces: "", faiblesses: "", opportunites: "", menaces: "" },
    pestel: { politique: "", economique: "", socioculturel: "", technologique: "", environnemental: "", legal: "" },
    pourquoi: ["", "", "", "", ""],
    acteurs: [],            // {nom, position(-2..2), influence(0..2), type}
    checklist: Array(10).fill(false),
    suivi: ""
  };
}
const CHECKLIST_ITEMS = [
  "Veille faite sur l'agenda politique et les sphères du pouvoir",
  "Cibles précises identifiées (cartographie à jour)",
  "Attention attirée : lettre, pétition, déclaration ou événement",
  "Demande de rencontre envoyée par lettre officielle",
  "Relations de confiance entamées (réunions d'info, expertise, contacts)",
  "Représentant·e·s choisi·e·s en fonction de la cible",
  "Rôles répartis : qui introduit, qui présente objectifs, actions, messages clés",
  "Documents à transmettre prêts",
  "Aspects pratiques réglés (lieu, horaire, matériel)",
  "Remerciements et suivi de la rencontre planifiés"
];

function vueAtelier(args) {
  const id = args && args[0];
  const p = S.projets.find(x => x.id === id);
  if (p) return rendreProjet(p, args[1] || "smart");

  $("#vue").innerHTML = `
  <h1 class="titre-page">Atelier</h1>
  <p class="note">Ici, on ne révise plus : on construit. Chaque projet regroupe les outils des manuels — SMART, message, SWOT, PESTEL, 5 pourquoi, cartographie, check-list de rencontre et suivi.</p>
  <div class="nouveau-projet">
    <input id="nom-projet" placeholder="Nom du projet (ex. Cantines bio à Charleroi)" aria-label="Nom du nouveau projet">
    <button class="btn btn-plein" id="creer-projet">Créer le projet</button>
  </div>
  <div class="liste-projets">
    ${S.projets.map(p => `
      <article class="tuile projet-tuile">
        <h2>${echap(p.nom)}</h2>
        <p>${avancementProjet(p)} % complété · créé le ${new Date(p.cree).toLocaleDateString("fr-BE")}</p>
        <div class="hero-actions">
          <a class="btn btn-plein" href="#atelier/${p.id}">Ouvrir</a>
          <button class="btn btn-danger" data-suppr="${p.id}">Supprimer</button>
        </div>
      </article>`).join("") || `<p class="note vide">Aucun projet pour l'instant. Le changement commence par un nom.</p>`}
  </div>`;
  $("#creer-projet").addEventListener("click", () => {
    const nom = $("#nom-projet").value.trim();
    if (!nom) return toast("Donne un nom à ton projet.");
    const p = projetVierge(nom);
    S.projets.push(p);
    gagnerXp(15, "Projet créé");
    location.hash = "#atelier/" + p.id;
  });
  $$("[data-suppr]").forEach(b => b.addEventListener("click", () => {
    if (confirm("Supprimer ce projet ? (pense à l'exporter avant)")) {
      S.projets = S.projets.filter(x => x.id !== b.dataset.suppr);
      sauver(); vueAtelier();
    }
  }));
}

function avancementProjet(p) {
  let fait = 0, total = 8;
  if (Object.values(p.smart).every(v => v.trim())) fait++;
  if (Object.values(p.message).every(v => v.trim())) fait++;
  if (Object.values(p.swot).some(v => v.trim())) fait++;
  if (Object.values(p.pestel).some(v => v.trim())) fait++;
  if (p.pourquoi.some(v => v.trim())) fait++;
  if (p.acteurs.length >= 3) fait++;
  if (p.checklist.filter(Boolean).length >= 7) fait++;
  if (p.suivi.trim()) fait++;
  return Math.round(fait / total * 100);
}

const ONGLETS = [
  ["smart", "Objectif SMART"], ["message", "Message"], ["swot", "SWOT"],
  ["pestel", "PESTEL"], ["pourquoi", "5 pourquoi"], ["acteurs", "Cartographie"],
  ["checklist", "Rencontre"], ["suivi", "Suivi"]
];

function rendreProjet(p, onglet) {
  const contenu = {
    smart: () => `
      <p class="note">« D'ici <b>(temps)</b>, obtenir <b>(décision spécifique et mesurable)</b> en faisant <b>(action atteignable)</b> grâce à <b>(moyen réaliste)</b>. »</p>
      ${champ(p, "smart.temps", "D'ici… (échéance)", "ex. juin 2027")}
      ${champ(p, "smart.decision", "Obtenir… (décision spécifique et mesurable)", "ex. le vote d'une motion communale imposant 50 % de bio dans les cantines")}
      ${champ(p, "smart.action", "En faisant… (action atteignable)", "ex. une interpellation citoyenne au conseil communal appuyée par 1 000 signatures")}
      ${champ(p, "smart.moyen", "Grâce à… (moyen réaliste)", "ex. le collectif des parents d'élèves et l'expertise d'une diététicienne")}
      <div class="apercu"><h3>Ton objectif formulé</h3><p>${apercuSmart(p)}</p></div>`,
    message: () => `
      <p class="note">Les 5 caractéristiques d'un message : accroche, problème, pourquoi c'est important, cible, action demandée.</p>
      ${champ(p, "message.accroche", "Phrase d'accroche", "Un fait chiffré percutant fait souvent mouche")}
      ${champ(p, "message.probleme", "Le problème est que…", "")}
      ${champ(p, "message.important", "C'est important parce que…", "")}
      ${champ(p, "message.cible", "Nous voulons que… (cible)", "ex. le Collège communal")}
      ${champ(p, "message.action", "Fasse… (action demandée)", "")}
      <div class="apercu"><h3>Ton message assemblé</h3><p>${apercuMessage(p)}</p></div>`,
    swot: () => `
      <p class="note">Interne : forces et faiblesses. Externe : opportunités et menaces.</p>
      <div class="grille-2">
        ${zone(p, "swot.forces", "Forces (interne +)")}
        ${zone(p, "swot.faiblesses", "Faiblesses (interne −)")}
        ${zone(p, "swot.opportunites", "Opportunités (externe +)")}
        ${zone(p, "swot.menaces", "Menaces (externe −)")}
      </div>`,
    pestel: () => `
      <p class="note">Balaye le contexte externe, dimension par dimension.</p>
      <div class="grille-2">
        ${zone(p, "pestel.politique", "Politique")}${zone(p, "pestel.economique", "Économique")}
        ${zone(p, "pestel.socioculturel", "Socioculturel")}${zone(p, "pestel.technologique", "Technologique")}
        ${zone(p, "pestel.environnemental", "Environnemental")}${zone(p, "pestel.legal", "Légal")}
      </div>`,
    pourquoi: () => `
      <p class="note">Pars du problème visible et creuse : chaque réponse devient la matière du pourquoi suivant, jusqu'à la cause racine.</p>
      ${p.pourquoi.map((v, i) => `
        <label class="champ">Pourquoi n°${i + 1}${i === 4 ? " — cause racine ?" : ""}
          <textarea rows="2" data-pq="${i}">${echap(v)}</textarea></label>`).join("")}`,
    acteurs: () => `
      <p class="note">Position : de −2 (opposition forte) à +2 (soutien fort). Influence : 0 (faible) à 2 (forte). Les acteur·rice·s influents et opposés méritent ta meilleure stratégie.</p>
      <div class="ajout-acteur">
        <input id="act-nom" placeholder="Nom (ex. Échevine de l'enseignement)">
        <select id="act-type"><option>politique</option><option>économique</option><option>médiatique</option><option>citoyen</option><option>scientifique</option><option>juridique</option><option>religieux</option><option>culturel</option><option>autre</option></select>
        <select id="act-pos"><option value="-2">−2 opposition forte</option><option value="-1">−1 opposition</option><option value="0" selected>0 neutre</option><option value="1">+1 soutien</option><option value="2">+2 soutien fort</option></select>
        <select id="act-inf"><option value="0">influence faible</option><option value="1" selected>influence moyenne</option><option value="2">influence forte</option></select>
        <button class="btn" id="act-ajouter">Ajouter</button>
      </div>
      ${carteActeurs(p)}
      <ul class="liste-acteurs">
        ${p.acteurs.map((a, i) => `<li><b>${echap(a.nom)}</b> · ${a.type} · position ${a.pos > 0 ? "+" + a.pos : a.pos} · influence ${["faible", "moyenne", "forte"][a.inf]}
          <button class="btn btn-mini" data-act-suppr="${i}">✕</button></li>`).join("")}
      </ul>`,
    checklist: () => `
      <p class="note">Les 5 étapes clés des manuels, détaillées en points vérifiables. ${p.checklist.filter(Boolean).length}/10 prêts.</p>
      <ul class="checklist">
        ${CHECKLIST_ITEMS.map((item, i) => `
          <li><label><input type="checkbox" data-chk="${i}" ${p.checklist[i] ? "checked" : ""}> ${item}</label></li>`).join("")}
      </ul>`,
    suivi: () => `
      <p class="note">Réunions stratégiques, veille médiatique et politique, évolution de la cartographie, incidents critiques, données chiffrées : consigne tout ici.</p>
      ${zone(p, "suivi", "Journal de suivi-évaluation", 10)}`
  };

  $("#vue").innerHTML = `
  <div class="session-tete"><a href="#atelier" class="lien-retour">← Projets</a>
    <span>${avancementProjet(p)} % complété</span></div>
  <h1 class="titre-page">${echap(p.nom)}</h1>
  <nav class="onglets" role="tablist">
    ${ONGLETS.map(([id, nom]) => `<a role="tab" aria-selected="${id === onglet}" class="${id === onglet ? "actif" : ""}" href="#atelier/${p.id}/${id}">${nom}</a>`).join("")}
  </nav>
  <div class="panneau">${contenu[onglet] ? contenu[onglet]() : contenu.smart()}</div>
  <div class="hero-actions export-projet">
    <button class="btn" id="exp-md">Exporter en Markdown</button>
    <button class="btn" id="exp-txt">Exporter en texte</button>
    <button class="btn" id="exp-json">Exporter en JSON</button>
    <button class="btn" id="imprimer">Imprimer / PDF</button>
  </div>`;

  // Liaisons de champs
  $$("[data-lien]").forEach(el => el.addEventListener("input", () => {
    const chemin = el.dataset.lien.split(".");
    let cible = p;
    while (chemin.length > 1) cible = cible[chemin.shift()];
    cible[chemin[0]] = el.value;
    sauverAvecRecompenses(p, el.dataset.lien);
  }));
  $$("[data-pq]").forEach(el => el.addEventListener("input", () => { p.pourquoi[+el.dataset.pq] = el.value; sauver(); }));
  $$("[data-chk]").forEach(el => el.addEventListener("change", () => {
    p.checklist[+el.dataset.chk] = el.checked;
    sauver();
    if (p.checklist.every(Boolean)) gagnerXp(20, "Check-list de rencontre complète");
    rendreProjet(p, "checklist");
  }));
  const btnAct = $("#act-ajouter");
  if (btnAct) btnAct.addEventListener("click", () => {
    const nom = $("#act-nom").value.trim();
    if (!nom) return toast("Nomme l'acteur·rice.");
    p.acteurs.push({ nom, type: $("#act-type").value, pos: +$("#act-pos").value, inf: +$("#act-inf").value });
    S.stats.acteurs++;
    gagnerXp(5, "Acteur·rice cartographié·e");
    rendreProjet(p, "acteurs");
  });
  $$("[data-act-suppr]").forEach(b => b.addEventListener("click", () => {
    p.acteurs.splice(+b.dataset.actSuppr, 1); sauver(); rendreProjet(p, "acteurs");
  }));
  $("#exp-md").addEventListener("click", () => telecharger(`${slug(p.nom)}.md`, projetEnMarkdown(p), "text/markdown"));
  $("#exp-txt").addEventListener("click", () => telecharger(`${slug(p.nom)}.txt`, projetEnMarkdown(p).replace(/[#*_>`]/g, ""), "text/plain"));
  $("#exp-json").addEventListener("click", () => telecharger(`${slug(p.nom)}.json`, JSON.stringify(p, null, 2), "application/json"));
  $("#imprimer").addEventListener("click", () => imprimerProjet(p));

  // Suivi des marqueurs de saisie pour récompenses différées
  function sauverAvecRecompenses(p, lien) {
    sauver();
    if (lien.startsWith("smart") && Object.values(p.smart).every(v => v.trim()) && !p._xpSmart) {
      p._xpSmart = true; S.stats.smart++; gagnerXp(25, "Objectif SMART complété");
    }
    if (lien.startsWith("message") && Object.values(p.message).every(v => v.trim()) && !p._xpMsg) {
      p._xpMsg = true; S.stats.message++; gagnerXp(25, "Message de plaidoyer rédigé");
    }
  }
}

function champ(p, chemin, label, ph) {
  return `<label class="champ">${label}<input data-lien="${chemin}" value="${echap(lireChemin(p, chemin))}" placeholder="${echap(ph || "")}"></label>`;
}
function zone(p, chemin, label, rows) {
  return `<label class="champ">${label}<textarea data-lien="${chemin}" rows="${rows || 4}">${echap(lireChemin(p, chemin))}</textarea></label>`;
}
function lireChemin(o, chemin) { return chemin.split(".").reduce((a, k) => (a || {})[k], o) || ""; }
function apercuSmart(p) {
  const s = p.smart;
  if (!Object.values(s).some(v => v.trim())) return "<i>Remplis les champs ci-dessus…</i>";
  return `D'ici <b>${echap(s.temps) || "…"}</b>, obtenir <b>${echap(s.decision) || "…"}</b> en faisant <b>${echap(s.action) || "…"}</b> grâce à <b>${echap(s.moyen) || "…"}</b>.`;
}
function apercuMessage(p) {
  const m = p.message;
  if (!Object.values(m).some(v => v.trim())) return "<i>Remplis les champs ci-dessus…</i>";
  return `${echap(m.accroche)}<br>Le problème est que ${echap(m.probleme) || "…"}<br>C'est important parce que ${echap(m.important) || "…"}<br>Nous voulons que ${echap(m.cible) || "…"} ${echap(m.action) || "…"}`;
}

/* Quadrant SVG position × influence */
function carteActeurs(p) {
  if (!p.acteurs.length) return `<p class="note vide">Ajoute des acteur·rice·s pour voir la carte se dessiner.</p>`;
  const W = 640, H = 340, m = 44;
  const x = pos => m + ((pos + 2) / 4) * (W - 2 * m);
  const y = inf => H - m - (inf / 2) * (H - 2 * m);
  return `<svg class="quadrant" viewBox="0 0 ${W} ${H}" role="img" aria-label="Carte des acteurs : position horizontale = soutien ou opposition, verticale = influence">
    <line x1="${W / 2}" y1="${m - 14}" x2="${W / 2}" y2="${H - m + 14}" class="axe"/>
    <line x1="${m - 14}" y1="${H - m}" x2="${W - m + 14}" y2="${H - m}" class="axe"/>
    <text x="${m}" y="${H - m + 28}" class="axe-txt">← opposition</text>
    <text x="${W - m}" y="${H - m + 28}" class="axe-txt" text-anchor="end">soutien →</text>
    <text x="${m - 30}" y="${m}" class="axe-txt" transform="rotate(-90 ${m - 30} ${m})" text-anchor="end">influence ↑</text>
    ${p.acteurs.map(a => `
      <g>
        <circle cx="${x(a.pos)}" cy="${y(a.inf)}" r="${8 + a.inf * 4}" class="pt ${a.pos < 0 ? "pt-opp" : a.pos > 0 ? "pt-sout" : "pt-neutre"}"/>
        <text x="${x(a.pos)}" y="${y(a.inf) - 14 - a.inf * 4}" class="pt-txt" text-anchor="middle">${echap(a.nom).slice(0, 22)}</text>
      </g>`).join("")}
  </svg>`;
}

/* ---------- Bibliothèque ---------- */
function vueBiblio() {
  const phases = [["voir", "VOIR — poser des constats"], ["juger", "JUGER — analyser le contexte"], ["agir", "AGIR — passer à l'action"]];
  $("#vue").innerHTML = `
  <h1 class="titre-page">Bibliothèque des outils</h1>
  <p class="note">Les 15 outils des manuels, résumés en fiches d'action. Pour la version longue, garde les PDF sources sous la main.</p>
  ${phases.map(([id, titre]) => `
    <h2 class="titre-section bandeau-${id}">${titre}</h2>
    <div class="fiches">
      ${FICHES.filter(f => f.phase === id).map(f => `
        <article class="fiche phase-${id}"><h3>${f.nom}</h3><p>${f.txt}</p></article>`).join("")}
    </div>`).join("")}`;
}

/* ---------- Données : import / export ---------- */
function vueDonnees() {
  $("#vue").innerHTML = `
  <h1 class="titre-page">Données</h1>
  <p class="note">Tout est stocké dans ton navigateur, rien ne quitte ta machine. Exporte régulièrement pour sauvegarder ou passer d'un appareil à l'autre.</p>

  <section class="tuile">
    <h2>Sauvegarde complète (JSON)</h2>
    <p>Progression, cartes personnelles, projets, badges — tout dans un seul fichier.</p>
    <div class="hero-actions">
      <button class="btn btn-plein" id="exp-tout">Exporter tout (.json)</button>
      <label class="btn fichier">Importer une sauvegarde<input type="file" id="imp-tout" accept=".json,application/json" hidden></label>
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

  <section class="tuile">
    <h2>Projets (Markdown)</h2>
    <p>Chaque projet peut aussi être exporté individuellement depuis l'atelier (Markdown, texte, JSON, impression PDF).</p>
    <div class="hero-actions">
      <button class="btn" id="exp-projets" ${S.projets.length ? "" : "disabled"}>Exporter tous les projets (.md)</button>
      <label class="btn fichier">Importer un projet (.json)<input type="file" id="imp-projet" accept=".json" hidden></label>
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
    if (n) { gagnerXp(Math.min(n * 2, 20), `${n} carte(s) importée(s)`); }
    else toast("Aucune carte reconnue dans ce fichier.");
    vueDonnees();
  }));
  $("#exp-projets").addEventListener("click", () =>
    telecharger(`plaidoyer-projets-${aujourdHui()}.md`, S.projets.map(projetEnMarkdown).join("\n\n---\n\n"), "text/markdown"));
  $("#imp-projet").addEventListener("change", e => lireFichier(e, txt => {
    try {
      const p = JSON.parse(txt);
      if (!p.nom || !p.smart) throw new Error("ce n'est pas un projet");
      p.id = "prj" + Date.now();
      S.projets.push(Object.assign(projetVierge(p.nom), p, { id: p.id }));
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

/* ---------- Utilitaires import/export ---------- */
function telecharger(nom, contenu, type) {
  const blob = new Blob(["\uFEFF" + contenu], { type: type + ";charset=utf-8" });
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
  // Analyse simple ; ou , avec guillemets
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
function projetEnMarkdown(p) {
  const s = p.smart, m = p.message;
  return `# ${p.nom}
*Stratégie de plaidoyer citoyen — exporté le ${new Date().toLocaleDateString("fr-BE")}*

## Objectif SMART
D'ici **${s.temps || "…"}**, obtenir **${s.decision || "…"}** en faisant **${s.action || "…"}** grâce à **${s.moyen || "…"}**.

## Message de plaidoyer
> ${m.accroche || "…"}
>
> Le problème est que ${m.probleme || "…"}
> C'est important parce que ${m.important || "…"}
> Nous voulons que **${m.cible || "…"}** ${m.action || "…"}

## Analyse SWOT
| Forces | Faiblesses |
|---|---|
| ${md(p.swot.forces)} | ${md(p.swot.faiblesses)} |

| Opportunités | Menaces |
|---|---|
| ${md(p.swot.opportunites)} | ${md(p.swot.menaces)} |

## Analyse PESTEL
${["politique", "economique", "socioculturel", "technologique", "environnemental", "legal"].map(k => `- **${k[0].toUpperCase() + k.slice(1)}** : ${p.pestel[k] || "—"}`).join("\n")}

## Les 5 pourquoi
${p.pourquoi.map((v, i) => `${i + 1}. ${v || "—"}`).join("\n")}

## Cartographie des acteur·rice·s
${p.acteurs.length ? p.acteurs.map(a => `- **${a.nom}** (${a.type}) — position ${a.pos > 0 ? "+" + a.pos : a.pos}, influence ${["faible", "moyenne", "forte"][a.inf]}`).join("\n") : "—"}

## Check-list de rencontre (${p.checklist.filter(Boolean).length}/10)
${CHECKLIST_ITEMS.map((t, i) => `- [${p.checklist[i] ? "x" : " "}] ${t}`).join("\n")}

## Suivi-évaluation
${p.suivi || "—"}
`;
}
function md(v) { return (v || "—").replace(/\n/g, "<br>"); }
function imprimerProjet(p) {
  const w = window.open("", "_blank");
  w.document.write(`<!doctype html><html lang="fr"><head><meta charset="utf-8"><title>${echap(p.nom)}</title>
  <style>body{font:14px/1.6 Georgia,serif;max-width:720px;margin:2rem auto;padding:0 1rem;color:#1b1a33}
  h1{border-bottom:3px solid #1b1a33}h2{margin-top:1.6em;border-left:6px solid #2242c8;padding-left:.5em}
  blockquote{border-left:3px solid #999;margin-left:0;padding-left:1em}table{border-collapse:collapse;width:100%}
  td,th{border:1px solid #999;padding:.4em;vertical-align:top}li{margin:.2em 0}</style></head><body>
  ${markdownVersHtml(projetEnMarkdown(p))}
  <script>window.onload=()=>window.print()<\/script></body></html>`);
  w.document.close();
}
function markdownVersHtml(mdTxt) {
  return mdTxt
    .replace(/&/g, "&amp;").replace(/</g, "&lt;")
    .replace(/^### (.*)$/gm, "<h3>$1</h3>")
    .replace(/^## (.*)$/gm, "<h2>$1</h2>")
    .replace(/^# (.*)$/gm, "<h1>$1</h1>")
    .replace(/^\| ?(.*?) ?\| ?(.*?) ?\|$/gm, (l, a, b) => /^-+$/.test(a.replace(/-/g, "-")) && /^-+$/.test(b) ? "" : `<table><tr><td>${a}</td><td>${b}</td></tr></table>`)
    .replace(/^\|---\|---\|$/gm, "")
    .replace(/^&gt; ?(.*)$/gm, "<blockquote>$1</blockquote>")
    .replace(/^- \[(x| )\] (.*)$/gm, (l, c, t) => `<li>${c === "x" ? "☑" : "☐"} ${t}</li>`)
    .replace(/^- (.*)$/gm, "<li>$1</li>")
    .replace(/^(\d+)\. (.*)$/gm, "<li>$1. $2</li>")
    .replace(/\*\*(.+?)\*\*/g, "<b>$1</b>")
    .replace(/\*(.+?)\*/g, "<i>$1</i>")
    .replace(/\n\n/g, "<br>");
}
function echap(v) { return String(v || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;"); }
function slug(v) { return v.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "projet"; }

/* ---------- Démarrage ---------- */
majEntete();
naviguer();
toucherStreak();
sauver();

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./sw.js").catch(() => { /* hors ligne indisponible, tant pis */ });
}
