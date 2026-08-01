/* ============================================================
   ATELIER — projets de plaidoyer, 18 outils, organisation
   et exports multiformats (MD, HTML, DOC, iCal, Mermaid, CSV,
   JSON, impression PDF).
   ============================================================ */
"use strict";

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

/* ---------- Avancement ---------- */
function avancementProjet(p) {
  const blocs = [
    Object.values(p.domino).some(v => v.trim()),
    Object.values(p.profil).some(v => v.trim()) || Object.values(p.fleur).some(v => v.trim()),
    p.acteurs.length >= 3,
    Object.values(p.tdc).some(v => v.trim()),
    Object.values(p.swot).some(v => v.trim()),
    Object.values(p.pestel).some(v => v.trim()) || Object.values(p.arbre).some(v => v.trim()) || p.pourquoi.some(v => v.trim()),
    Object.values(p.pouvoir).some(v => v.trim()) || Object.values(p.cibles).some(v => v.trim()),
    p.smarts.some(s => (s.decision || "").trim()),
    Object.values(p.message).every(v => v.trim()),
    p.checklist.filter(Boolean).length >= 7,
    Object.values(p.evaluation).some(v => v.trim()),
    p.taches.length + p.journalc.length >= 1
  ];
  return Math.round(blocs.filter(Boolean).length / blocs.length * 100);
}

/* ---------- Vue liste des projets ---------- */
function vueAtelier(args) {
  const id = args && args[0];
  const p = S.projets.find(x => x.id === id);
  if (p) return rendreProjet(p, args[1] || "domino");

  $("#vue").innerHTML = `
  <h1 class="titre-page">Atelier</h1>
  <p class="note">Ici, on ne révise plus : on construit. Chaque projet regroupe les 15 outils des manuels plus un kanban, une frise et un journal de campagne.</p>
  <div class="nouveau-projet">
    <input id="nom-projet" placeholder="Nom du projet (ex. Cantines bio à Charleroi)" aria-label="Nom du nouveau projet">
    <select id="modele-projet" aria-label="Modèle de départ">
      ${MODELES.map(m => `<option value="${m.id}" title="${echap(m.desc)}">${m.nom}</option>`).join("")}
    </select>
    <button class="btn btn-plein" id="creer-projet">Créer le projet</button>
  </div>
  <div class="liste-projets">
    ${S.projets.map(p => `
      <article class="tuile projet-tuile">
        <h2>${echap(p.nom)}</h2>
        <p>${p.desc ? echap(p.desc) + " · " : ""}${avancementProjet(p)} % complété · ${p.acteurs.length} acteur·rice·s · ${p.smarts.length} objectif${p.smarts.length > 1 ? "s" : ""} · ${p.taches.length} tâche${p.taches.length > 1 ? "s" : ""}</p>
        <div class="mini-barre"><span style="width:${avancementProjet(p)}%"></span></div>
        <div class="hero-actions">
          <a class="btn btn-plein" href="#atelier/${p.id}">Ouvrir</a>
          <button class="btn" data-dupliquer="${p.id}">Dupliquer</button>
          <button class="btn btn-danger" data-suppr="${p.id}">Supprimer</button>
        </div>
      </article>`).join("") || `<p class="note vide">Aucun projet pour l'instant. Le changement commence par un nom.</p>`}
  </div>`;
  $("#creer-projet").addEventListener("click", () => {
    const nom = $("#nom-projet").value.trim();
    if (!nom) return toast("Donne un nom à ton projet.");
    const modele = MODELES.find(m => m.id === $("#modele-projet").value);
    const p = projetVierge(nom, modele && modele.id !== "vierge" ? modele.desc : "");
    if (modele?.graine) {
      for (const [k, v] of Object.entries(modele.graine)) {
        if (Array.isArray(v)) p[k] = JSON.parse(JSON.stringify(v)).map(x => k === "smarts" ? Object.assign({ id: "s" + Date.now() + Math.random().toString(36).slice(2, 5) }, x) : x);
        else Object.assign(p[k], v);
      }
    }
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
  $$("[data-dupliquer]").forEach(b => b.addEventListener("click", () => {
    const src = S.projets.find(x => x.id === b.dataset.dupliquer);
    const copie = migrerProjet(JSON.parse(JSON.stringify(src)));
    copie.id = "prj" + Date.now();
    copie.nom = src.nom + " (copie)";
    S.projets.push(copie);
    sauver(); vueAtelier();
  }));
}

/* ---------- Vue projet ---------- */
function rendreProjet(p, outilId) {
  if (outilId === "export") return rendreExport(p);
  const outil = OUTILS.find(o => o.id === outilId) || OUTILS[0];
  const phaseActive = outil.phase;

  $("#vue").innerHTML = `
  <div class="session-tete"><a href="#atelier" class="lien-retour">← Projets</a>
    <span>${avancementProjet(p)} % complété</span></div>
  <h1 class="titre-page">${echap(p.nom)}</h1>
  <nav class="phases" role="tablist" aria-label="Phases">
    ${PHASES_ATELIER.map(([id, nom]) => {
      const premier = id === "export" ? "export" : OUTILS.find(o => o.phase === id).id;
      return `<a role="tab" aria-selected="${id === phaseActive || (id === "export" && outilId === "export")}"
        class="phase-onglet bandeau-${id} ${id === phaseActive ? "actif" : ""}" href="#atelier/${p.id}/${premier}">${nom}</a>`;
    }).join("")}
  </nav>
  <nav class="onglets" aria-label="Outils de la phase">
    ${OUTILS.filter(o => o.phase === phaseActive).map(o =>
      `<a class="${o.id === outil.id ? "actif" : ""}" href="#atelier/${p.id}/${o.id}">${o.nom}</a>`).join("")}
  </nav>
  <div class="panneau phase-${phaseActive}">
    <p class="note aide-outil">💡 ${outil.aide}</p>
    <div id="corps-outil"></div>
  </div>`;

  const corps = $("#corps-outil");
  if (outil.type === "zones") rendreZones(p, outil, corps);
  else RENDUS_SPECIAUX[outil.id](p, corps);
}

/* ---------- Rendu générique : zones de texte ---------- */
function rendreZones(p, outil, corps) {
  corps.innerHTML = `<div class="${outil.grille ? "grille-2" : ""}">
    ${outil.champs.map(([cle, label]) =>
      `<label class="champ">${label}<textarea data-zone="${cle}" rows="${outil.grille ? 4 : 3}">${echap(p[outil.id][cle])}</textarea></label>`).join("")}
  </div>`;
  $$("[data-zone]").forEach(el => el.addEventListener("input", () => {
    p[outil.id][el.dataset.zone] = el.value;
    p.modifie = Date.now();
    sauver();
  }));
}

/* ---------- Rendus spéciaux ---------- */
const RENDUS_SPECIAUX = {

  pourquoi(p, corps) {
    corps.innerHTML = p.pourquoi.map((v, i) => `
      <label class="champ">Pourquoi n°${i + 1}${i === 4 ? " — cause racine ?" : ""}
        <textarea rows="2" data-pq="${i}">${echap(v)}</textarea></label>`).join("");
    $$("[data-pq]").forEach(el => el.addEventListener("input", () => { p.pourquoi[+el.dataset.pq] = el.value; sauver(); }));
  },

  acteurs(p, corps) {
    corps.innerHTML = `
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
        <input class="notes-acteur" data-act-note="${i}" value="${echap(a.notes || "")}" placeholder="notes, approche…">
        <button class="btn btn-mini" data-act-suppr="${i}">✕</button></li>`).join("")}
    </ul>
    ${p.acteurs.length ? `<p class="note">Lecture stratégique : les points en haut à gauche (influents et opposés) exigent ta meilleure stratégie ; en haut à droite, tes meilleurs relais.</p>` : ""}`;
    $("#act-ajouter").addEventListener("click", () => {
      const nom = $("#act-nom").value.trim();
      if (!nom) return toast("Nomme l'acteur·rice.");
      p.acteurs.push({ nom, type: $("#act-type").value, pos: +$("#act-pos").value, inf: +$("#act-inf").value, notes: "" });
      S.stats.acteurs++;
      gagnerXp(5, "Acteur·rice cartographié·e");
      rendreProjet(p, "acteurs");
    });
    $$("[data-act-suppr]").forEach(b => b.addEventListener("click", () => {
      p.acteurs.splice(+b.dataset.actSuppr, 1); sauver(); rendreProjet(p, "acteurs");
    }));
    $$("[data-act-note]").forEach(el => el.addEventListener("input", () => {
      p.acteurs[+el.dataset.actNote].notes = el.value; sauver();
    }));
  },

  smart(p, corps) {
    corps.innerHTML = `
    <div class="smart-nouveau">
      <label class="champ">D'ici… (échéance)<input type="date" id="sm-temps"></label>
      <label class="champ">Obtenir… (décision spécifique et mesurable)<input id="sm-decision" placeholder="ex. le vote d'une motion communale"></label>
      <label class="champ">En faisant… (action atteignable)<input id="sm-action" placeholder="ex. une interpellation citoyenne appuyée par 1 000 signatures"></label>
      <label class="champ">Grâce à… (moyen réaliste)<input id="sm-moyen" placeholder="ex. le collectif des parents et une expertise externe"></label>
      <button class="btn btn-plein" id="sm-ajouter">Ajouter l'objectif</button>
    </div>
    <div class="smart-liste">
      ${p.smarts.map((s, i) => `
        <article class="smart-item statut-${s.statut}">
          <p class="smart-texte">D'ici <b>${s.temps ? new Date(s.temps + "T00:00").toLocaleDateString("fr-BE") : "…"}</b>,
            obtenir <b>${echap(s.decision) || "…"}</b>${s.action ? ` en faisant <b>${echap(s.action)}</b>` : ""}${s.moyen ? ` grâce à <b>${echap(s.moyen)}</b>` : ""}.</p>
          <div class="smart-pied">
            <select data-sm-statut="${i}">
              <option value="todo" ${s.statut === "todo" ? "selected" : ""}>À faire</option>
              <option value="doing" ${s.statut === "doing" ? "selected" : ""}>En cours</option>
              <option value="done" ${s.statut === "done" ? "selected" : ""}>Atteint ✓</option>
            </select>
            <button class="btn btn-mini" data-sm-suppr="${i}">✕</button>
          </div>
        </article>`).join("") || `<p class="note vide">Aucun objectif pour l'instant. Un plaidoyer sans objectif SMART, c'est une carte sans destination.</p>`}
    </div>
    ${p.smarts.some(s => s.temps) ? `<p class="note">📅 Les échéances alimentent la frise (onglet Organiser) et l'export agenda iCal (onglet Exporter).</p>` : ""}`;
    $("#sm-ajouter").addEventListener("click", () => {
      const decision = $("#sm-decision").value.trim();
      if (!decision) return toast("Formule au moins la décision visée.");
      p.smarts.push({ id: "s" + Date.now(), temps: $("#sm-temps").value, decision,
        action: $("#sm-action").value.trim(), moyen: $("#sm-moyen").value.trim(), statut: "todo" });
      S.stats.smart++;
      gagnerXp(25, "Objectif SMART formulé");
      rendreProjet(p, "smart");
    });
    $$("[data-sm-statut]").forEach(el => el.addEventListener("change", () => {
      const s = p.smarts[+el.dataset.smStatut];
      const avant = s.statut;
      s.statut = el.value;
      sauver();
      if (el.value === "done" && avant !== "done") gagnerXp(40, "Objectif SMART atteint 🎉");
      rendreProjet(p, "smart");
    }));
    $$("[data-sm-suppr]").forEach(b => b.addEventListener("click", () => {
      p.smarts.splice(+b.dataset.smSuppr, 1); sauver(); rendreProjet(p, "smart");
    }));
  },

  message(p, corps) {
    const m = p.message;
    corps.innerHTML = `
      ${[["accroche", "Phrase d'accroche", "Un fait chiffré percutant fait souvent mouche"],
         ["probleme", "Le problème est que…", ""],
         ["important", "C'est important parce que…", ""],
         ["cible", "Nous voulons que… (cible)", "ex. le Collège communal"],
         ["action", "Fasse… (action demandée)", ""]].map(([k, label, ph]) =>
        `<label class="champ">${label}<input data-msg="${k}" value="${echap(m[k])}" placeholder="${echap(ph)}"></label>`).join("")}
      <div class="apercu"><h3>Ton message assemblé</h3><p id="msg-apercu">${apercuMessage(p)}</p>
        <button class="btn btn-mini" id="msg-copier">📋 Copier le message</button></div>`;
    $$("[data-msg]").forEach(el => el.addEventListener("input", () => {
      m[el.dataset.msg] = el.value;
      sauver();
      $("#msg-apercu").innerHTML = apercuMessage(p);
      if (Object.values(m).every(v => v.trim()) && !p._xpMsg) {
        p._xpMsg = true; S.stats.message++; gagnerXp(25, "Message de plaidoyer rédigé");
      }
    }));
    $("#msg-copier").addEventListener("click", () => {
      const txt = `${m.accroche}\nLe problème est que ${m.probleme}\nC'est important parce que ${m.important}\nNous voulons que ${m.cible} ${m.action}`.trim();
      navigator.clipboard?.writeText(txt).then(() => toast("Message copié ✓"), () => toast("Copie impossible dans ce navigateur."));
    });
  },

  rencontre(p, corps) {
    corps.innerHTML = `
    <p class="note">${p.checklist.filter(Boolean).length}/10 prêts.</p>
    <ul class="checklist">
      ${CHECKLIST_ITEMS.map((item, i) => `
        <li><label><input type="checkbox" data-chk="${i}" ${p.checklist[i] ? "checked" : ""}> ${item}</label></li>`).join("")}
    </ul>`;
    $$("[data-chk]").forEach(el => el.addEventListener("change", () => {
      p.checklist[+el.dataset.chk] = el.checked;
      sauver();
      if (p.checklist.every(Boolean) && !p._xpChk) { p._xpChk = true; gagnerXp(20, "Check-list de rencontre complète"); }
      rendreProjet(p, "rencontre");
    }));
  },

  kanban(p, corps) {
    const cols = [["todo", "À faire"], ["doing", "En cours"], ["done", "Fait ✓"]];
    corps.innerHTML = `
    <div class="ajout-tache">
      <input id="tache-titre" placeholder="Nouvelle tâche (ex. Rédiger la lettre au Collège)">
      <input type="date" id="tache-date" aria-label="Échéance (facultative)">
      <button class="btn" id="tache-ajouter">Ajouter</button>
    </div>
    <div class="kanban">
      ${cols.map(([id, nom]) => `
        <div class="kanban-col" data-col="${id}">
          <h3>${nom} <small>${p.taches.filter(t => t.col === id).length}</small></h3>
          ${p.taches.filter(t => t.col === id).map(t => `
            <div class="kanban-carte" draggable="true" data-tache="${t.id}">
              <span>${echap(t.titre)}</span>
              ${t.echeance ? `<small class="${new Date(t.echeance) < new Date() && t.col !== "done" ? "retard" : ""}">📅 ${new Date(t.echeance + "T00:00").toLocaleDateString("fr-BE")}</small>` : ""}
              <div class="kanban-boutons">
                ${id !== "todo" ? `<button class="btn btn-mini" data-bouge="${t.id}|-1" aria-label="Reculer">←</button>` : ""}
                ${id !== "done" ? `<button class="btn btn-mini" data-bouge="${t.id}|1" aria-label="Avancer">→</button>` : ""}
                <button class="btn btn-mini" data-tache-suppr="${t.id}" aria-label="Supprimer">✕</button>
              </div>
            </div>`).join("")}
        </div>`).join("")}
    </div>`;
    const ordre = ["todo", "doing", "done"];
    const bouger = (id, delta) => {
      const t = p.taches.find(x => x.id === id);
      const i = Math.max(0, Math.min(2, ordre.indexOf(t.col) + delta));
      const avant = t.col;
      t.col = ordre[i];
      sauver();
      if (t.col === "done" && avant !== "done") { S.stats.taches++; gagnerXp(10, "Tâche accomplie"); }
      rendreProjet(p, "kanban");
    };
    $("#tache-ajouter").addEventListener("click", () => {
      const titre = $("#tache-titre").value.trim();
      if (!titre) return toast("Décris la tâche.");
      p.taches.push({ id: "t" + Date.now(), titre, col: "todo", echeance: $("#tache-date").value });
      gagnerXp(3, "Tâche planifiée");
      rendreProjet(p, "kanban");
    });
    $$("[data-bouge]").forEach(b => b.addEventListener("click", () => {
      const [id, d] = b.dataset.bouge.split("|"); bouger(id, +d);
    }));
    $$("[data-tache-suppr]").forEach(b => b.addEventListener("click", () => {
      p.taches = p.taches.filter(t => t.id !== b.dataset.tacheSuppr); sauver(); rendreProjet(p, "kanban");
    }));
    // glisser-déposer
    $$(".kanban-carte").forEach(c => {
      c.addEventListener("dragstart", e => e.dataTransfer.setData("text/plain", c.dataset.tache));
    });
    $$(".kanban-col").forEach(col => {
      col.addEventListener("dragover", e => { e.preventDefault(); col.classList.add("survol"); });
      col.addEventListener("dragleave", () => col.classList.remove("survol"));
      col.addEventListener("drop", e => {
        e.preventDefault(); col.classList.remove("survol");
        const t = p.taches.find(x => x.id === e.dataTransfer.getData("text/plain"));
        if (!t) return;
        const avant = t.col;
        t.col = col.dataset.col;
        sauver();
        if (t.col === "done" && avant !== "done") { S.stats.taches++; gagnerXp(10, "Tâche accomplie"); }
        rendreProjet(p, "kanban");
      });
    });
  },

  frise(p, corps) {
    const jalons = [
      ...p.smarts.filter(s => s.temps).map(s => ({ d: s.temps, txt: s.decision, type: "smart", fait: s.statut === "done" })),
      ...p.taches.filter(t => t.echeance).map(t => ({ d: t.echeance, txt: t.titre, type: "tache", fait: t.col === "done" }))
    ].sort((a, b) => a.d.localeCompare(b.d));
    if (!jalons.length) {
      corps.innerHTML = `<p class="note vide">La frise se construit toute seule : ajoute des échéances à tes objectifs SMART (phase Agir) et à tes tâches (Kanban).</p>`;
      return;
    }
    const t0 = new Date(jalons[0].d).getTime(), t1 = new Date(jalons[jalons.length - 1].d).getTime();
    const plage = Math.max(t1 - t0, 864e5);
    const H = 90 + jalons.length * 46, W = 720, gauche = 110;
    const now = Date.now();
    const xNow = gauche + Math.max(0, Math.min(1, (now - t0) / plage)) * (W - gauche - 30);
    corps.innerHTML = `<svg class="frise" viewBox="0 0 ${W} ${H}" role="img" aria-label="Frise chronologique des échéances">
      <line x1="${gauche}" y1="30" x2="${W - 30}" y2="30" class="axe"/>
      ${now >= t0 - 864e5 * 15 && now <= t1 + 864e5 * 15 ? `<line x1="${xNow}" y1="16" x2="${xNow}" y2="${H - 16}" class="ligne-now"/><text x="${xNow + 4}" y="${H - 20}" class="axe-txt">aujourd'hui</text>` : ""}
      ${jalons.map((j, i) => {
        const x = gauche + ((new Date(j.d).getTime() - t0) / plage) * (W - gauche - 30);
        const y = 64 + i * 46;
        return `
        <line x1="${x}" y1="30" x2="${x}" y2="${y}" class="fil"/>
        <circle cx="${x}" cy="${y}" r="9" class="jalon ${j.type} ${j.fait ? "fait" : ""}"/>
        <text x="14" y="${y + 4}" class="date-txt">${new Date(j.d + "T00:00").toLocaleDateString("fr-BE", { day: "2-digit", month: "short", year: "2-digit" })}</text>
        <text x="${Math.min(x + 16, W - 240)}" y="${y + 4}" class="jalon-txt">${echap(j.txt).slice(0, 46)}${j.fait ? " ✓" : ""}</text>`;
      }).join("")}
    </svg>
    <p class="note">● bleu : objectifs SMART · ● jaune : tâches · plein : accompli. Export agenda (.ics) dans l'onglet Exporter.</p>`;
  },

  journalc(p, corps) {
    corps.innerHTML = `
    <div class="ajout-journal">
      <input type="date" id="jr-date" value="${aujourdHui()}">
      <textarea id="jr-txt" rows="2" placeholder="Rencontre, décision, rebondissement… (ex. RDV obtenu avec l'échevine le 12/09)"></textarea>
      <button class="btn" id="jr-ajouter">Consigner</button>
    </div>
    <ul class="journal">
      ${p.journalc.slice().sort((a, b) => b.t - a.t).map((j, i) => `
        <li><span>${new Date(j.t).toLocaleDateString("fr-BE", { day: "numeric", month: "short", year: "numeric" })}</span>
          ${echap(j.txt)} <button class="btn btn-mini" data-jr-suppr="${p.journalc.indexOf(j)}">✕</button></li>`).join("")
      || `<li class="note vide">Rien encore. La mémoire du collectif commence ici.</li>`}
    </ul>`;
    $("#jr-ajouter").addEventListener("click", () => {
      const txt = $("#jr-txt").value.trim();
      if (!txt) return toast("Écris d'abord quelque chose.");
      p.journalc.push({ t: Date.parse($("#jr-date").value) || Date.now(), txt });
      S.stats.journal++;
      gagnerXp(5, "Entrée au journal de campagne");
      rendreProjet(p, "journalc");
    });
    $$("[data-jr-suppr]").forEach(b => b.addEventListener("click", () => {
      p.journalc.splice(+b.dataset.jrSuppr, 1); sauver(); rendreProjet(p, "journalc");
    }));
  }
};

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
      <g><circle cx="${x(a.pos)}" cy="${y(a.inf)}" r="${8 + a.inf * 4}" class="pt ${a.pos < 0 ? "pt-opp" : a.pos > 0 ? "pt-sout" : "pt-neutre"}"/>
      <text x="${x(a.pos)}" y="${y(a.inf) - 14 - a.inf * 4}" class="pt-txt" text-anchor="middle">${echap(a.nom).slice(0, 22)}</text></g>`).join("")}
  </svg>`;
}

/* ============================================================
   EXPORTS DU PROJET
   ============================================================ */
function rendreExport(p) {
  $("#vue").innerHTML = `
  <div class="session-tete"><a href="#atelier" class="lien-retour">← Projets</a>
    <span>${avancementProjet(p)} % complété</span></div>
  <h1 class="titre-page">${echap(p.nom)}</h1>
  <nav class="phases" role="tablist" aria-label="Phases">
    ${PHASES_ATELIER.map(([id, nom]) => {
      const premier = id === "export" ? "export" : OUTILS.find(o => o.phase === id).id;
      return `<a role="tab" aria-selected="${id === "export"}" class="phase-onglet bandeau-${id} ${id === "export" ? "actif" : ""}" href="#atelier/${p.id}/${premier}">${nom}</a>`;
    }).join("")}
  </nav>
  <div class="panneau phase-export">
    <p class="note aide-outil">💡 Chaque format a son usage : Markdown pour retravailler, HTML pour partager en ligne, Word pour les partenaires, iCal pour l'agenda du collectif, Mermaid pour intégrer les schémas ailleurs.</p>
    <div class="grille-export">
      <button class="btn" id="ex-md">📝 Markdown (.md)<small>document structuré, réutilisable partout</small></button>
      <button class="btn" id="ex-txt">📄 Texte brut (.txt)<small>sans mise en forme</small></button>
      <button class="btn" id="ex-html">🌐 Page HTML autonome<small>rapport lisible dans tout navigateur</small></button>
      <button class="btn" id="ex-doc">📘 Word (.doc)<small>s'ouvre dans Word et LibreOffice</small></button>
      <button class="btn" id="ex-ical">📅 Agenda iCal (.ics)<small>échéances SMART et tâches datées</small></button>
      <button class="btn" id="ex-mermaid">🧜 Schémas Mermaid (.mmd)<small>carto acteurs + gantt, à coller dans GitLab/Notion/HackMD</small></button>
      <button class="btn" id="ex-csv-act">📊 Acteurs (.csv)<small>tableur : nom, type, position, influence</small></button>
      <button class="btn" id="ex-csv-taches">✅ Tâches (.csv)<small>tableur : titre, colonne, échéance</small></button>
      <button class="btn" id="ex-json">🧰 JSON du projet<small>ré-importable ici ou ailleurs</small></button>
      <button class="btn" id="ex-print">🖨 Imprimer / PDF<small>via la boîte d'impression</small></button>
    </div>
  </div>`;
  const nom = slug(p.nom);
  $("#ex-md").addEventListener("click", () => telecharger(`${nom}.md`, projetEnMarkdown(p), "text/markdown"));
  $("#ex-txt").addEventListener("click", () => telecharger(`${nom}.txt`, projetEnMarkdown(p).replace(/[#*_>`|]/g, "").replace(/\n{3,}/g, "\n\n"), "text/plain"));
  $("#ex-html").addEventListener("click", () => telecharger(`${nom}.html`, projetEnHtmlAutonome(p), "text/html"));
  $("#ex-doc").addEventListener("click", () => telecharger(`${nom}.doc`, projetEnDoc(p), "application/msword"));
  $("#ex-ical").addEventListener("click", () => {
    const ics = projetEnICal(p);
    if (!ics) return toast("Aucune échéance datée : ajoute des dates aux objectifs SMART ou aux tâches.");
    telecharger(`${nom}.ics`, ics, "text/calendar");
  });
  $("#ex-mermaid").addEventListener("click", () => telecharger(`${nom}.mmd`, projetEnMermaid(p), "text/plain"));
  $("#ex-csv-act").addEventListener("click", () => telecharger(`${nom}-acteurs.csv`,
    "nom;type;position;influence;notes\n" + p.acteurs.map(a => [a.nom, a.type, a.pos, a.inf, a.notes || ""].map(csvCellule).join(";")).join("\n"), "text/csv"));
  $("#ex-csv-taches").addEventListener("click", () => telecharger(`${nom}-taches.csv`,
    "titre;colonne;echeance\n" + p.taches.map(t => [t.titre, t.col, t.echeance || ""].map(csvCellule).join(";")).join("\n"), "text/csv"));
  $("#ex-json").addEventListener("click", () => telecharger(`${nom}.json`, JSON.stringify(p, null, 2), "application/json"));
  $("#ex-print").addEventListener("click", () => imprimerProjet(p));
}

function projetEnMarkdown(p) {
  const s = z => Object.entries(z).filter(([, v]) => String(v).trim());
  const zoneMd = (titre, obj, labels) => {
    const l = s(obj);
    if (!l.length) return "";
    return `\n## ${titre}\n` + l.map(([k, v]) => `**${labels?.[k] || k}**\n${v}\n`).join("\n");
  };
  const L = {
    vision: "Vision", ressources: "Ressources", obstacles: "Obstacles",
    competences: "Compétences", motivations: "Motivations", limites: "Limites", temps: "Temps disponible",
    identites: "Identités", privileges: "Privilèges", oppressions: "Discriminations possibles",
    actuelle: "Situation actuelle", visee: "Situation visée", ii: "Impact individuel-interne", ie: "Impact individuel-externe",
    ci: "Impact collectif-interne", ce: "Impact collectif-externe", hypotheses: "Hypothèses", chemin: "Chemin",
    forces: "Forces", faiblesses: "Faiblesses", opportunites: "Opportunités", menaces: "Menaces",
    politique: "Politique", economique: "Économique", socioculturel: "Socioculturel", technologique: "Technologique",
    environnemental: "Environnemental", legal: "Légal",
    causes: "Causes (racines)", probleme: "Problème central (tronc)", consequences: "Conséquences (branches)",
    moyens: "Moyens", objectif: "Objectif central", resultats: "Résultats attendus",
    avec: "Avec le pouvoir", sans: "Sans le pouvoir", contre: "Contre le pouvoir",
    principales: "Cibles principales", secondaires: "Cibles secondaires", allies: "Alliances",
    indicateurs: "Indicateurs", methodes: "Méthodes", calendrier: "Calendrier", lecons: "Leçons apprises"
  };
  const m = p.message;
  return `# ${p.nom}
*Stratégie de plaidoyer citoyen — exportée le ${new Date().toLocaleDateString("fr-BE")}${p.desc ? " — " + p.desc : ""}*

# PARTIE 1 — VOIR
${zoneMd("Domino du changement", p.domino, L)}${zoneMd("Mon profil", p.profil, L)}${zoneMd("Fleur de pouvoir", p.fleur, L)}
## Cartographie des acteur·rice·s
${p.acteurs.length ? p.acteurs.map(a => `- **${a.nom}** (${a.type}) — position ${a.pos > 0 ? "+" + a.pos : a.pos}, influence ${["faible", "moyenne", "forte"][a.inf]}${a.notes ? " — " + a.notes : ""}`).join("\n") : "—"}

# PARTIE 2 — JUGER
${zoneMd("Théorie du changement", p.tdc, L)}${zoneMd("Analyse SWOT", p.swot, L)}${zoneMd("Analyse PESTEL", p.pestel, L)}${zoneMd("Arbres à problèmes / objectifs", p.arbre, L)}
## Les 5 pourquoi
${p.pourquoi.map((v, i) => `${i + 1}. ${v || "—"}`).join("\n")}

# PARTIE 3 — AGIR
${zoneMd("Avec, sans et contre le pouvoir", p.pouvoir, L)}
## Objectifs SMART
${p.smarts.length ? p.smarts.map(o => `- [${o.statut === "done" ? "x" : " "}] D'ici **${o.temps || "…"}**, obtenir **${o.decision}**${o.action ? ` en faisant **${o.action}**` : ""}${o.moyen ? ` grâce à **${o.moyen}**` : ""}. *(${{ todo: "à faire", doing: "en cours", done: "atteint" }[o.statut]})*`).join("\n") : "—"}
${zoneMd("Cibles et alliances", p.cibles, L)}
## Message de plaidoyer
> ${m.accroche || "…"}
>
> Le problème est que ${m.probleme || "…"}
> C'est important parce que ${m.important || "…"}
> Nous voulons que **${m.cible || "…"}** ${m.action || "…"}

## Check-list de rencontre (${p.checklist.filter(Boolean).length}/10)
${CHECKLIST_ITEMS.map((t, i) => `- [${p.checklist[i] ? "x" : " "}] ${t}`).join("\n")}
${zoneMd("Suivi et évaluation", p.evaluation, L)}

# ORGANISATION
## Tâches (${p.taches.filter(t => t.col === "done").length}/${p.taches.length} faites)
${p.taches.length ? p.taches.map(t => `- [${t.col === "done" ? "x" : " "}] ${t.titre}${t.echeance ? ` *(échéance ${t.echeance})*` : ""}${t.col === "doing" ? " *(en cours)*" : ""}`).join("\n") : "—"}

## Journal de campagne
${p.journalc.length ? p.journalc.slice().sort((a, b) => a.t - b.t).map(j => `- **${new Date(j.t).toLocaleDateString("fr-BE")}** — ${j.txt}`).join("\n") : "—"}
`;
}

function projetEnHtmlAutonome(p) {
  return `<!doctype html><html lang="fr"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${echap(p.nom)} — stratégie de plaidoyer</title>
<style>
body{font:16px/1.6 Georgia,serif;max-width:760px;margin:2rem auto;padding:0 1.2rem;color:#22203F;background:#FBFAF5}
h1{font-family:Arial,sans-serif;text-transform:uppercase;border-bottom:4px solid #22203F;padding-bottom:.3rem}
h2{font-family:Arial,sans-serif;margin-top:2em;border-left:8px solid #2338BF;padding-left:.6rem;font-size:1.1rem;text-transform:uppercase;letter-spacing:.04em}
h3{font-family:Arial,sans-serif;font-size:.95rem}
blockquote{border-left:3px solid #F2408C;margin-left:0;padding:.4em 1em;background:#fdf0f6}
li{margin:.25em 0}b{color:#2338BF}
footer{margin-top:3rem;font-size:.8rem;color:#777;border-top:1px solid #ccc;padding-top:1rem}
@media print{body{background:#fff}}
</style></head><body>
${markdownVersHtml(projetEnMarkdown(p))}
<footer>Généré par le poste de travail « Plaidoyer citoyen » — d'après les manuels de Justice &amp; Paix et d'ULB-Coopération.</footer>
</body></html>`;
}

function projetEnDoc(p) {
  // HTML compatible Word : s'ouvre dans MS Word et LibreOffice comme un document
  return `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
<head><meta charset="utf-8"><title>${echap(p.nom)}</title>
<!--[if gte mso 9]><xml><w:WordDocument><w:View>Print</w:View><w:Zoom>100</w:Zoom></w:WordDocument></xml><![endif]-->
<style>body{font-family:Calibri,Arial,sans-serif;font-size:11pt;line-height:1.4}
h1{font-size:18pt;color:#22203F;border-bottom:2pt solid #22203F}
h2{font-size:13pt;color:#2338BF;margin-top:16pt}
blockquote{border-left:3pt solid #F2408C;padding-left:8pt;margin-left:0}
li{margin:2pt 0}</style></head>
<body>${markdownVersHtml(projetEnMarkdown(p))}</body></html>`;
}

function projetEnICal(p) {
  const evs = [
    ...p.smarts.filter(s => s.temps).map(s => ({ d: s.temps, titre: "🎯 Objectif : " + s.decision, desc: `Projet ${p.nom}. Statut : ${s.statut}.` })),
    ...p.taches.filter(t => t.echeance).map(t => ({ d: t.echeance, titre: "✅ Tâche : " + t.titre, desc: `Projet ${p.nom}.` }))
  ];
  if (!evs.length) return null;
  const echIcal = v => String(v).replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
  const dtstamp = new Date().toISOString().replace(/[-:]/g, "").slice(0, 15) + "Z";
  return ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//plaidoyer-citoyen//FR", "CALSCALE:GREGORIAN",
    ...evs.flatMap((e, i) => {
      const d = e.d.replace(/-/g, "");
      const fin = new Date(new Date(e.d).getTime() + 864e5).toISOString().slice(0, 10).replace(/-/g, "");
      return ["BEGIN:VEVENT", `UID:${p.id}-${i}@plaidoyer`, `DTSTAMP:${dtstamp}`,
        `DTSTART;VALUE=DATE:${d}`, `DTEND;VALUE=DATE:${fin}`,
        `SUMMARY:${echIcal(e.titre)}`, `DESCRIPTION:${echIcal(e.desc)}`, "END:VEVENT"];
    }), "END:VCALENDAR"].join("\r\n");
}

function projetEnMermaid(p) {
  const nid = s => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9]/g, "_").slice(0, 24) || "n";
  let out = `%% Schémas Mermaid — ${p.nom}\n%% À coller dans GitLab, Notion, HackMD, Obsidian ou https://mermaid.live\n\n`;
  out += "%% ── Cartographie des acteur·rice·s ──\nflowchart LR\n  PROJET[\"" + p.nom.replace(/"/g, "'") + "\"]\n";
  for (const a of p.acteurs) {
    const id = nid(a.nom) + "_" + Math.abs(a.pos) + a.inf;
    const forme = a.pos > 0 ? `(["${a.nom}"])` : a.pos < 0 ? `{{"${a.nom}"}}` : `["${a.nom}"]`;
    const lien = a.pos > 0 ? "-- soutien -->" : a.pos < 0 ? "-. opposition .->" : "---";
    out += `  ${id}${forme.replace(/"/g, "'").replace(/'/g, '"')} ${lien} PROJET\n`;
  }
  const dated = p.smarts.filter(s => s.temps && s.decision);
  if (dated.length) {
    out += `\n%% ── Gantt des objectifs SMART ──\ngantt\n  title Objectifs — ${p.nom.replace(/[:#]/g, " ")}\n  dateFormat YYYY-MM-DD\n  section Objectifs\n`;
    for (const s of dated) {
      const debut = new Date(Math.min(Date.now(), new Date(s.temps).getTime() - 30 * 864e5)).toISOString().slice(0, 10);
      out += `  ${s.decision.replace(/[:#;]/g, " ").slice(0, 40)} :${s.statut === "done" ? "done, " : s.statut === "doing" ? "active, " : ""}${debut}, ${s.temps}\n`;
    }
  }
  return out;
}

function imprimerProjet(p) {
  const w = window.open("", "_blank");
  w.document.write(projetEnHtmlAutonome(p).replace("</body>", "<script>window.onload=()=>window.print()<\/script></body>"));
  w.document.close();
}

function markdownVersHtml(mdTxt) {
  return mdTxt
    .replace(/&/g, "&amp;").replace(/</g, "&lt;")
    .replace(/^### (.*)$/gm, "<h3>$1</h3>")
    .replace(/^## (.*)$/gm, "<h2>$1</h2>")
    .replace(/^# (.*)$/gm, "<h1>$1</h1>")
    .replace(/^&gt; ?(.*)$/gm, "<blockquote>$1</blockquote>")
    .replace(/^- \[(x| )\] (.*)$/gm, (l, c, t) => `<li>${c === "x" ? "☑" : "☐"} ${t}</li>`)
    .replace(/^- (.*)$/gm, "<li>$1</li>")
    .replace(/^(\d+)\. (.*)$/gm, "<li>$1. $2</li>")
    .replace(/\*\*(.+?)\*\*/g, "<b>$1</b>")
    .replace(/\*(.+?)\*/g, "<i>$1</i>")
    .replace(/\n\n/g, "<br>");
}
