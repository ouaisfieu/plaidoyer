/* ============================================================
   PLAIDOYER CITOYEN — Données pédagogiques
   Contenu dérivé des manuels : "Le petit guide du plaidoyer
   citoyen" (Justice & Paix) et "Manuel Plaidoyer" (ULB-Coopération)
   ============================================================ */

const DECKS = [
  { id: "fond",  nom: "Fondamentaux",            phase: "socle", couleur: "bleu"  },
  { id: "voir",  nom: "Voir — constater",         phase: "voir",  couleur: "bleu"  },
  { id: "juger", nom: "Juger — analyser",         phase: "juger", couleur: "rose"  },
  { id: "agir",  nom: "Agir — interpeller",       phase: "agir",  couleur: "vert"  },
  { id: "strat", nom: "Stratégies & théories",    phase: "juger", couleur: "jaune" }
];

const CARTES = [
  // ---------- FONDAMENTAUX ----------
  { id: "f1", deck: "fond", q: "Qu'est-ce que le plaidoyer citoyen ?",
    r: "Un processus planifié qui vise à obtenir un changement concret (modification d'une loi, d'une pratique, d'une politique) en formulant des revendications et des solutions auprès des responsables politiques — au niveau local, national ou international." },
  { id: "f2", deck: "fond", q: "Quelles sont les étapes du cycle du plaidoyer ?",
    r: "Analyse → Stratégie → Messages → Mise en œuvre → Suivi → Évaluation. Un processus continu : les résultats de l'analyse nourrissent le message et le plan d'action, et le suivi-évaluation permet de réajuster en permanence." },
  { id: "f3", deck: "fond", q: "Que signifie la méthodologie « Voir, Juger, Agir » ?",
    r: "Méthode de Joseph Cardijn : VOIR pose des constats sur la société ; JUGER analyse le contexte en détail et propose une réflexion critique ; AGIR met en place des actions concrètes de plaidoyer vers le changement." },
  { id: "f4", deck: "fond", q: "Quelles questions se poser au début d'une stratégie de plaidoyer ?",
    r: "Quel est mon objectif ? Quel changement je souhaite atteindre ? À qui adresser mon plaidoyer ? Avec qui m'associer ? Quelle fenêtre d'opportunité ? En résumé : pourquoi, quand, qui et comment." },
  { id: "f5", deck: "fond", q: "Pourquoi faire du plaidoyer ?",
    r: "Pour formuler des revendications, les faire connaître aux responsables politiques, proposer des solutions et obtenir un impact sur la société. Il peut aussi renforcer le travail de terrain d'une organisation." },
  { id: "f6", deck: "fond", q: "Pourquoi agir collectivement dans un plaidoyer ?",
    r: "Le travail en réseau est la clé : rassembler les forces dans un collectif favorise le partage d'expériences et de ressources, et augmente les chances d'impact." },

  // ---------- VOIR ----------
  { id: "v1", deck: "voir", q: "À quoi sert l'outil « Domino du changement » ?",
    r: "À visualiser les effets en chaîne d'un changement : un premier basculement en entraîne d'autres. Il aide à poser des constats et à identifier par où commencer." },
  { id: "v2", deck: "voir", q: "À quoi sert l'outil « Quel est mon profil ? » ?",
    r: "À se situer soi-même avant d'agir : identifier ses compétences, ses envies, son rôle possible dans un collectif de plaidoyer." },
  { id: "v3", deck: "voir", q: "Qu'est-ce que la « Fleur de pouvoir » ?",
    r: "Un outil d'auto-positionnement qui fait prendre conscience de ses forces, privilèges et biais personnels (genre, origine, classe, niveau d'étude…) afin d'anticiper les rapports de domination qui peuvent influencer une rencontre de plaidoyer." },
  { id: "v4", deck: "voir", q: "Quels sont les 3 objectifs de la cartographie des acteur·rice·s ?",
    r: "1. Recenser les cibles potentielles, leur intérêt et leur capacité d'influence. 2. Évaluer notre influence possible sur elles. 3. Situer leur position par rapport à nos objectifs (soutien ou opposition)." },
  { id: "v5", deck: "voir", q: "Dans une cartographie, quelles sont les deux grandes catégories d'acteur·rice·s ?",
    r: "Les CIBLES, qui détiennent le pouvoir et seront visées par le plaidoyer, et les PARTENAIRES, qui poursuivent le même objectif et avec qui construire alliances et réseaux." },
  { id: "v6", deck: "voir", q: "Citez plusieurs types de pouvoir à considérer dans un power mapping.",
    r: "Politique, législatif, juridique, religieux, coutumier, scientifique, économique, familial, culturel, médiatique et citoyen. Le pouvoir ne se limite jamais au seul pouvoir politique." },
  { id: "v7", deck: "voir", q: "Quelles questions guident l'analyse des pouvoirs en présence ?",
    r: "Qui dispose de quel type de pouvoir ? Qui en a le plus / le moins ? Comment le déséquilibre est-il maintenu ? Comment peut-on le modifier ?" },

  // ---------- JUGER ----------
  { id: "j1", deck: "juger", q: "Qu'est-ce que la théorie du changement (ToC) ?",
    r: "Un outil qui schématise le chemin vers le changement souhaité : il rassemble acteurs, rapports de force, changements visés et manières d'y parvenir. Il explicite les liens entre actions et résultats espérés, et sert aussi d'outil de suivi." },
  { id: "j2", deck: "juger", q: "Quelles sont les 4 dimensions de l'impact dans la théorie du changement ?",
    r: "Individuel-interne : transformation personnelle. Individuel-externe : transformer les relations. Collectif-interne : transformer les modèles collectifs d'action et de pensée. Collectif-externe : transformer les structures et procédures." },
  { id: "j3", deck: "juger", q: "Que signifie SWOT ?",
    r: "Strengths (forces), Weaknesses (faiblesses), Opportunities (opportunités), Threats (menaces). Les forces et faiblesses sont internes ; les opportunités et menaces sont externes." },
  { id: "j4", deck: "juger", q: "Que signifie PESTEL ?",
    r: "Analyse du contexte externe selon 6 dimensions : Politique, Économique, Socioculturel, Technologique, Environnemental, Légal." },
  { id: "j5", deck: "juger", q: "Comment fonctionne l'arbre à problèmes / arbre à objectifs ?",
    r: "Le tronc est le problème central, les racines sont ses causes, les branches ses conséquences. En inversant chaque élément en positif, on obtient l'arbre à objectifs : le chemin de solutions." },
  { id: "j6", deck: "juger", q: "En quoi consiste l'outil des « 5 pourquoi » ?",
    r: "Poser successivement la question « pourquoi ? » (environ cinq fois) face à un problème pour remonter des symptômes jusqu'à la cause racine." },
  { id: "j7", deck: "juger", q: "Pourquoi viser des changements « plus profonds » que les événements visibles ?",
    r: "On ne voit souvent que la partie émergée de l'iceberg (événements, habitudes). Un plaidoyer ambitieux vise aussi les façons de faire, de penser et de comprendre : mentalités, croyances, préjugés, structures." },

  // ---------- STRATÉGIES & THÉORIES ----------
  { id: "s1", deck: "strat", q: "Théorie « Large Leaps » : comment le changement se produit-il ?",
    r: "Par sauts brusques, quand les conditions sont réunies : un thème est abordé différemment, reçoit plus d'attention médiatique, ou de nouveaux acteurs arrivent au pouvoir. On peut mobiliser des faits mais aussi des émotions." },
  { id: "s2", deck: "strat", q: "Théorie des coalitions (Coalition Theory) : quel moteur du changement ?",
    r: "L'action collective d'individus qui partagent les mêmes idées et solutions. Les convictions des décideurs ne changent que sous la pression de conditions externes (socio-économiques, opinion publique). Cas très présent en Belgique." },
  { id: "s3", deck: "strat", q: "« Policy Windows » : quelles sont les 3 conditions du succès ?",
    r: "1. Une bonne définition du problème. 2. Des propositions/solutions faisables. 3. Un contexte politique favorable. Il faut connaître l'agenda politique et être capable d'agir quand la fenêtre s'ouvre." },
  { id: "s4", deck: "strat", q: "Théorie des élites (Power Elites, Mills) : quelle conséquence pratique ?",
    r: "Seul un groupe restreint a le pouvoir de changer la politique. Une bonne cartographie des acteurs permet d'identifier ces personnes et d'établir des relations avec elles." },
  { id: "s5", deck: "strat", q: "« Community organizing » : d'où vient le changement ?",
    r: "De la mobilisation des bénéficiaires du plaidoyer eux-mêmes pour leurs droits. Le changement suit les actions des communautés de base, qu'il faut renforcer pour qu'elles passent à l'action." },
  { id: "s6", deck: "strat", q: "Quelles sont les 4 grandes postures stratégiques du plaidoyer ?",
    r: "Sur deux axes (coopération ↔ confrontation ; formel ↔ informel) : 1. le rôle de conseiller, 2. le plaidoyer formel, 3. le lobby, 4. l'activisme." },
  { id: "s7", deck: "strat", q: "La mobilisation de rue est-elle toujours opportune en début de plaidoyer ?",
    r: "Non. Elle peut être contre-productive dans un premier temps ; c'est plutôt un outil de pression si les premières rencontres n'aboutissent pas. La recherche et l'expertise constituent souvent une meilleure première phase." },
  { id: "s8", deck: "strat", q: "Comment choisir ses partenaires stratégiquement ?",
    r: "Cartographier les partenaires possibles puis croiser deux dimensions : leur proximité avec nos positions (forte, moyenne, faible) et le niveau d'opposition avec les décideurs (collaboration, dialogue/négociation, protestation, confrontation)." },

  // ---------- AGIR ----------
  { id: "a1", deck: "agir", q: "Que recouvrent les dynamiques « avec, sans et contre » le pouvoir ?",
    r: "AVEC : coopérer avec les institutions. CONTRE : s'opposer au pouvoir perçu comme obstacle (ex. manifestation d'agriculteurs). SANS : créer un espace d'autonomie et d'alternatives citoyennes sans passer par le pouvoir conventionnel (ex. héberger des personnes migrantes)." },
  { id: "a2", deck: "agir", q: "Que signifie l'acronyme SMART ?",
    r: "Spécifique, Mesurable, Atteignable, Réaliste, défini dans le Temps. Les objectifs (court terme) déclinent concrètement les axes stratégiques (long terme)." },
  { id: "a3", deck: "agir", q: "Quelle formulation type pour un objectif SMART de plaidoyer ?",
    r: "« D'ici (temps)…, obtenir (décision spécifique et mesurable)…, en faisant (action atteignable)…, grâce à (moyen réaliste)… »" },
  { id: "a4", deck: "agir", q: "Quelles sont les 5 caractéristiques d'un message de plaidoyer ?",
    r: "1. Une accroche (ex. un fait chiffré percutant). 2. Le problème. 3. Pourquoi c'est important. 4. La cible. 5. L'action demandée. Le message doit être clair, simple et adapté à l'interlocuteur·rice." },
  { id: "a5", deck: "agir", q: "Quelles sont les 5 étapes clés avant une rencontre de plaidoyer ?",
    r: "1. Se familiariser avec les sphères du pouvoir (veille, ciblage). 2. Attirer l'attention (lettres, pétition, événement). 3. Bâtir des relations de confiance. 4. Choisir ses représentant·e·s selon la cible. 5. Préparer la rencontre en groupe (stratégie, documents, rôles)." },
  { id: "a6", deck: "agir", q: "Quels outils pour le suivi-évaluation d'un plaidoyer ?",
    r: "Réunions stratégiques régulières, veille médiatique (alertes), veille politique (programmes, positions), évolution de la cartographie des acteurs, suivi des incidents critiques, statistiques et données chiffrées." },
  { id: "a7", deck: "agir", q: "Pourquoi l'apparition d'adversaires peut-elle être bon signe ?",
    r: "Quand on devient visible médiatiquement, les opposants se manifestent : l'évolution et le déplacement des acteurs témoignent des progrès du plaidoyer." },
  { id: "a8", deck: "agir", q: "Comment suivre les actions attendues des cibles ?",
    r: "Pour chaque cible, définir trois niveaux d'action : ce qu'on s'attend à voir, ce qu'on aimerait voir, et ce qu'on adorerait voir réaliser." },
  { id: "a9", deck: "agir", q: "À quoi penser pendant la rencontre avec un·e responsable politique ?",
    r: "Établir un lien avec son interlocuteur·rice, le·la remercier de son accueil, dérouler les rôles préparés (introduction, objectifs, actions, messages clés) et transmettre les documents prévus." },
  { id: "a10", deck: "agir", q: "Comment relier le message à l'actualité ?",
    r: "Préparer le moment de diffusion et la personne qui le porte, en le mettant en relation avec l'agenda politique ou un événement externe (conseil communal, manifestation…)." }
];

const QUIZ = [
  { q: "Dans la méthode de Cardijn, la phase qui « pose des constats sur la société » est…",
    o: ["Voir", "Juger", "Agir", "Évaluer"], b: 0,
    e: "VOIR = constats ; JUGER = analyse critique ; AGIR = actions concrètes." },
  { q: "Le « S » de SMART signifie…",
    o: ["Stratégique", "Spécifique", "Solidaire", "Structuré"], b: 1,
    e: "Spécifique, Mesurable, Atteignable, Réaliste, défini dans le Temps." },
  { q: "Un message de plaidoyer commence idéalement par…",
    o: ["La liste des partenaires", "Une accroche, par exemple un fait chiffré percutant", "Le budget", "Un rappel historique complet"], b: 1,
    e: "Accroche → problème → pourquoi c'est important → cible → action demandée." },
  { q: "Dans la théorie « Policy Windows », combien de conditions augmentent la probabilité de succès ?",
    o: ["2", "3", "5", "7"], b: 1,
    e: "Définition du problème, solutions faisables, contexte politique favorable." },
  { q: "Héberger des personnes migrantes sans passer par les institutions illustre la dynamique…",
    o: ["Avec le pouvoir", "Contre le pouvoir", "Sans le pouvoir", "Sous le pouvoir"], b: 2,
    e: "Agir SANS : créer un espace d'autonomie propice aux alternatives citoyennes." },
  { q: "Dans un SWOT, les « opportunités » sont…",
    o: ["Internes", "Externes", "Toujours financières", "Des faiblesses inversées"], b: 1,
    e: "Forces/faiblesses = interne ; opportunités/menaces = externe." },
  { q: "La « fleur de pouvoir » sert d'abord à…",
    o: ["Compter ses soutiens politiques", "Prendre conscience de ses privilèges et biais", "Choisir un logo", "Mesurer l'audience médiatique"], b: 1,
    e: "Se situer soi-même pour anticiper les rapports de domination dans les rencontres." },
  { q: "Dans une cartographie d'acteurs, les « cibles » sont…",
    o: ["Nos bénévoles", "Ceux qui détiennent le pouvoir visé par le plaidoyer", "Les journalistes uniquement", "Nos donateurs"], b: 1,
    e: "Cibles = détiennent le pouvoir ; partenaires = partagent nos objectifs." },
  { q: "Selon les manuels, manifester dès le début d'un plaidoyer est…",
    o: ["Toujours indispensable", "Parfois contre-productif", "Interdit", "La seule stratégie efficace"], b: 1,
    e: "La mobilisation est plutôt un outil de pression si les rencontres n'aboutissent pas." },
  { q: "La théorie du changement (ToC) sert notamment à…",
    o: ["Remplacer l'évaluation", "Schématiser le chemin vers le changement et suivre ses hypothèses", "Rédiger les statuts d'une ASBL", "Calculer un budget"], b: 1,
    e: "Elle explicite les liens actions ↔ résultats et se réévalue en continu." },
  { q: "Les « 5 pourquoi » permettent de…",
    o: ["Trouver 5 partenaires", "Remonter à la cause racine d'un problème", "Écrire 5 slogans", "Choisir 5 cibles"], b: 1,
    e: "On répète « pourquoi ? » pour dépasser les symptômes." },
  { q: "PESTEL analyse le contexte selon…",
    o: ["6 dimensions externes", "4 forces internes", "Les seuls aspects légaux", "Le profil des militants"], b: 0,
    e: "Politique, Économique, Socioculturel, Technologique, Environnemental, Légal." },
  { q: "Voir apparaître de nouveaux adversaires en début de campagne est…",
    o: ["Un signe d'échec certain", "Souvent bon signe : on devient visible", "Sans importance", "Une raison d'arrêter"], b: 1,
    e: "Le déplacement des acteurs témoigne des progrès du plaidoyer." },
  { q: "L'axe stratégique et les objectifs se distinguent ainsi :",
    o: ["Axe = court terme, objectifs = long terme", "Axe = long terme, objectifs = court terme", "Ce sont des synonymes", "Les objectifs précèdent toujours l'analyse"], b: 1,
    e: "Les objectifs SMART déclinent concrètement les axes stratégiques." },
  { q: "Selon la théorie des élites (Mills), il faut surtout…",
    o: ["Toucher tout le monde en même temps", "Identifier et approcher le petit groupe qui a le pouvoir de décider", "Éviter tout contact avec les décideurs", "Ne compter que sur les médias"], b: 1,
    e: "D'où l'importance d'une bonne cartographie des acteurs." },
  { q: "Le suivi-évaluation d'un plaidoyer inclut…",
    o: ["Uniquement le comptage des tracts", "Veilles médiatique et politique, évolution de la cartographie, incidents critiques", "Le tirage au sort des actions", "Rien : on évalue seulement à la fin"], b: 1,
    e: "C'est un processus continu qui permet d'adapter la stratégie." },
  { q: "Les 4 postures stratégiques se placent sur les axes…",
    o: ["Riche ↔ pauvre / vieux ↔ jeune", "Coopération ↔ confrontation / formel ↔ informel", "Local ↔ mondial / oral ↔ écrit", "Public ↔ privé / long ↔ court"], b: 1,
    e: "Conseiller, plaidoyer formel, lobby, activisme." },
  { q: "Avant une rencontre politique, il faut notamment…",
    o: ["Improviser pour rester naturel", "Décider qui présente quelle partie et préparer les documents", "Venir le plus nombreux possible sans prévenir", "Éviter de connaître l'agenda politique"], b: 1,
    e: "5 étapes clés, dont la préparation en groupe et le choix des représentant·e·s." }
];

/* Fiches outils de la bibliothèque (résumés opérationnels) */
const FICHES = [
  { phase: "voir", nom: "Domino du changement", txt: "Visualiser les effets en chaîne : un basculement en entraîne d'autres. Utile pour poser les constats et choisir par où commencer." },
  { phase: "voir", nom: "Quel est mon profil ?", txt: "Identifier ses compétences, envies et son rôle possible dans le collectif avant d'agir." },
  { phase: "voir", nom: "Fleur de pouvoir", txt: "Prendre conscience de ses forces, privilèges et biais pour anticiper les rapports de domination dans les rencontres de plaidoyer." },
  { phase: "voir", nom: "Cartographie & power mapping", txt: "Recenser cibles et partenaires, leur influence et leur position (soutien/opposition). Penser à tous les types de pouvoir : politique, économique, médiatique, religieux, scientifique, citoyen…" },
  { phase: "juger", nom: "Théorie du changement", txt: "Schématiser le chemin vers le changement : impact visé (individuel/collectif × interne/externe), hypothèses, activités. Réévaluer en continu." },
  { phase: "juger", nom: "Analyse SWOT", txt: "Forces et faiblesses (interne), opportunités et menaces (externe) : l'état des lieux de départ." },
  { phase: "juger", nom: "Analyse PESTEL", txt: "Balayer le contexte : Politique, Économique, Socioculturel, Technologique, Environnemental, Légal." },
  { phase: "juger", nom: "Arbres à problèmes / objectifs", txt: "Tronc = problème central, racines = causes, branches = conséquences. Inverser en positif pour obtenir l'arbre à objectifs." },
  { phase: "juger", nom: "Les 5 pourquoi", txt: "Répéter « pourquoi ? » pour remonter des symptômes à la cause racine." },
  { phase: "agir", nom: "Avec, sans et contre le pouvoir", txt: "Trois dynamiques d'action : coopérer avec les institutions, s'y opposer, ou construire des alternatives autonomes." },
  { phase: "agir", nom: "Objectifs SMART", txt: "« D'ici (temps), obtenir (décision spécifique et mesurable) en faisant (action atteignable) grâce à (moyen réaliste). »" },
  { phase: "agir", nom: "Cibles et alliances", txt: "Croiser proximité de positions et niveau d'opposition aux décideurs pour choisir : collaboration, dialogue, protestation ou confrontation." },
  { phase: "agir", nom: "Construire un message", txt: "Accroche → problème → pourquoi c'est important → cible → action demandée. Clair, simple, adapté, relié à l'agenda politique." },
  { phase: "agir", nom: "Check-list de rencontre", txt: "Veille et ciblage, attirer l'attention, bâtir la confiance, choisir ses représentant·e·s, préparer les rôles et documents." },
  { phase: "agir", nom: "Suivi et évaluation", txt: "Réunions stratégiques, veilles médiatique et politique, évolution de la cartographie, incidents critiques, données chiffrées." }
];

const BADGES = [
  { id: "premierpas",  nom: "Premier pas",      cond: "Première session d'étude",            test: s => s.stats.revues >= 1 },
  { id: "dix",         nom: "Dix sur dix",      cond: "10 cartes revues",                    test: s => s.stats.revues >= 10 },
  { id: "cinquante",   nom: "Militant·e",       cond: "50 cartes revues",                    test: s => s.stats.revues >= 50 },
  { id: "assidu",      nom: "Assidu·e",         cond: "Série de 3 jours",                    test: s => s.streak.best >= 3 },
  { id: "semaine",     nom: "Une semaine !",    cond: "Série de 7 jours",                    test: s => s.streak.best >= 7 },
  { id: "quizeur",     nom: "Sur le gril",      cond: "Premier quiz terminé",                test: s => s.stats.quiz >= 1 },
  { id: "sansfaute",   nom: "Sans faute",       cond: "Un quiz 100 % correct",               test: s => s.stats.parfait >= 1 },
  { id: "architecte",  nom: "Architecte",       cond: "Premier projet créé dans l'atelier",  test: s => (s.projets || []).length >= 1 },
  { id: "smart",       nom: "Objectif SMART",   cond: "Un objectif SMART complété",          test: s => s.stats.smart >= 1 },
  { id: "orateur",     nom: "Porte-voix",       cond: "Un message de plaidoyer rédigé",      test: s => s.stats.message >= 1 },
  { id: "cartographe", nom: "Cartographe",      cond: "5 acteur·rice·s cartographié·e·s",    test: s => s.stats.acteurs >= 5 },
  { id: "niveau5",     nom: "Stratège",         cond: "Atteindre le niveau 5",               test: s => niveauDepuisXp(s.xp).n >= 5 }
];

const NIVEAUX = ["Curieux·se", "Éveillé·e", "Engagé·e", "Mobilisé·e", "Stratège", "Porte-parole", "Bâtisseur·se d'alliances", "Fin·e négociateur·rice", "Architecte du changement", "Légende du plaidoyer"];

function niveauDepuisXp(xp) {
  // 100 XP par niveau, progression douce : seuil n = 60*n + 20*n²
  let n = 1;
  while (seuilNiveau(n + 1) <= xp && n < 99) n++;
  return { n, nom: NIVEAUX[Math.min(n - 1, NIVEAUX.length - 1)], base: seuilNiveau(n), next: seuilNiveau(n + 1) };
}
function seuilNiveau(n) { return (n - 1) * 60 + (n - 1) * (n - 1) * 20; }
