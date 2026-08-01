# Plaidoyer citoyen — poste de travail gamifié

PWA Jamstack (HTML/CSS/JS vanilla, zéro dépendance, zéro build) pour apprendre
et pratiquer le plaidoyer citoyen, d'après « Le petit guide du plaidoyer
citoyen » (Justice & Paix) et le « Manuel Plaidoyer » (ULB-Coopération).

## Fonctionnalités

- **Flashcards à répétition espacée** (SM-2 simplifié) : 38 cartes réparties en
  5 paquets (Fondamentaux, Voir, Juger, Agir, Stratégies & théories)
  + création de cartes personnelles.
- **Quiz** : 10 questions tirées au sort parmi 18, avec explications.
- **Atelier** : projets de plaidoyer complets — objectif SMART guidé, message en
  5 temps, SWOT, PESTEL, 5 pourquoi, cartographie des acteur·rice·s avec
  quadrant SVG (position × influence), check-list de rencontre (10 points),
  journal de suivi-évaluation.
- **Bibliothèque** : les 15 outils des manuels en fiches résumées.
- **Gamification** : XP, 10 niveaux, série quotidienne (streak), 12 tampons
  (badges), journal de bord.
- **Import/export multiformat** :
  - sauvegarde complète JSON (tout l'état) ;
  - flashcards CSV (`question;réponse;paquet`, compatible tableur, import/export) ;
  - projets en Markdown, texte brut, JSON, et impression → PDF.
- **PWA** : installable, hors ligne (service worker cache-first), données 100 %
  locales (localStorage), aucun compte, aucun serveur.

## Déploiement sur GitHub Pages (https://ouaisfieu.github.io/plaidoyer/2/)

Dans le dépôt `ouaisfieu/plaidoyer`, copier tout le contenu de ce dossier dans
le sous-dossier `2/` :

```
plaidoyer/
└── 2/
    ├── index.html
    ├── manifest.webmanifest
    ├── sw.js
    ├── css/styles.css
    ├── js/data.js
    ├── js/app.js
    └── icons/icon-192.png, icon-512.png
```

Tous les chemins sont relatifs (`./`) : aucun réglage nécessaire, l'app
fonctionne dans n'importe quel sous-dossier. Puis `git add 2 && git commit &&
git push` — GitHub Pages sert le reste.

## Mise à jour

Après toute modification des fichiers, incrémenter la version du cache dans
`sw.js` (`plaidoyer2-v1` → `v2`) pour que les visiteurs reçoivent la nouvelle
version.

## Développement local

`python3 -m http.server` dans le dossier, puis http://localhost:8000
(le service worker exige http(s), pas file://).
