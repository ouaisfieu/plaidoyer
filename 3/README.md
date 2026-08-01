# Plaidoyer citoyen — poste de travail ULTIME

Fusion des trois versions du poste de travail :

| Héritage | Ce qui a été repris |
|---|---|
| **/1/** « Atelier plaidoyer » | Palette de commande `Ctrl K`, navigation clavier, logique « à lire et à remplir », double thème clair/sombre |
| **/2/** version gamifiée | Flashcards à répétition espacée (38 cartes, 5 paquets), quiz (18 questions), XP / 10 niveaux / série / 15 tampons, esthétique risographie |
| **#B!Mi v4.4** (annexe) | Atelier complet : 15 outils + kanban + frise + journal, multi-projets, modèles pré-remplis, exports Word / iCal / Mermaid / HTML |

Jamstack pur : HTML/CSS/JS vanilla, **zéro dépendance, zéro build**, données
100 % locales (localStorage), aucun compte, aucun serveur.

## L'atelier — 19 espaces de travail par projet

- **Voir** : Domino du changement · Mon profil · Fleur de pouvoir ·
  Cartographie des acteur·rice·s (quadrant SVG position × influence, notes par acteur)
- **Juger** : Théorie du changement (matrice d'impact 4 quadrants) · SWOT ·
  PESTEL · Arbres à problèmes/objectifs · 5 pourquoi
- **Agir** : Avec/sans/contre le pouvoir · Objectifs SMART **multiples** avec
  échéances et statuts · Cibles et alliances · Message en 5 temps (+ copier) ·
  Check-list de rencontre (10 points) · Suivi-évaluation
- **Organiser** : Kanban avec glisser-déposer et échéances (retards signalés) ·
  Frise chronologique auto-générée (SMART + tâches) · Journal de campagne
- **Exporter** : voir ci-dessous

Modèles de départ : projet vierge, cantines durables, droit au logement,
mobilité douce. Duplication de projets en un clic.

## Import / export

**Par projet** : Markdown, texte brut, page HTML autonome, Word (.doc),
agenda iCal (.ics — échéances SMART + tâches datées), schémas Mermaid (.mmd —
flowchart des acteurs + gantt), CSV acteurs, CSV tâches, JSON, impression → PDF.

**Global** : sauvegarde/restauration JSON complète, flashcards CSV
(`question;réponse;paquet`, import et export).

**Import universel de projets** : accepte les JSON de la version /2/, de la
version #B!Mi (annexe, conversion automatique du schéma : `pestel.p→politique`,
acteurs `position/power`, `smart.text/deadline/status`, journal…) et de
celle-ci. La progression localStorage de /2/ est reprise automatiquement si
l'app est servie depuis la même origine.

## Interface

- `Ctrl K` (ou `⌘ K`) : palette de commande — navigation, projets, outils, actions.
- 🌙 / ☀️ : thème « papier riso » (clair) ou « rétro geek » (sombre, scanlines),
  suit le système par défaut.
- Gamification transverse : chaque action nourrit XP, niveaux, tampons et série.
- PWA installable, hors ligne (service worker cache-first), accessible au clavier.

## Déploiement (GitHub Pages)

Copier le contenu du dossier tel quel dans le sous-dossier voulu du dépôt
`ouaisfieu/plaidoyer` — par exemple `3/` pour
`https://ouaisfieu.github.io/plaidoyer/3/`, ou à la racine pour en faire la
version principale. Tous les chemins sont relatifs : aucun réglage.

Après toute modification, incrémenter la version du cache dans `sw.js`
(`plaidoyer-ultime-v1` → `v2`).

## Développement local

`python3 -m http.server` dans le dossier, puis http://localhost:8000
(le service worker exige http(s), pas file://).
