# Atelier plaidoyer — v2

Poste de travail du plaidoyer citoyen. **22 outils**, chacun avec sa fiche méthodologique
et son atelier interactif. Application web installable, fonctionne hors-ligne, sans compte
et sans serveur.

Sources : Commission Justice et Paix, *Le petit guide du plaidoyer citoyen — 15 outils vers
le changement* (2020) ; ULB-Coopération, manuel de plaidoyer (2021). Trame voir / juger / agir :
Joseph Cardijn.

## Ce qui change par rapport à la v1

**Interface**
- Deux volets côte à côte au-dessus de 1180 px : le guide à gauche reste visible pendant qu'on
  remplit l'atelier à droite. En dessous, bascule par onglets.
- Thème clair / sombre / automatique.
- Polices embarquées (Bricolage Grotesque, Public Sans, JetBrains Mono) — aucun appel réseau,
  donc rien ne casse hors-ligne.
- Barre de navigation basse sur mobile, tiroir latéral, cibles tactiles agrandies.

**Navigation et confort**
- Palette de commandes (`Ctrl`/`⌘` + `K`) : cherche dans les outils, dans **vos propres notes**,
  et déclenche les actions (export, impression, nouveau dossier).
- Flèches `←` `→` pour passer d'un outil à l'autre, `G` pour basculer guide / atelier.
- Avancement calculé au pourcentage, par outil, par partie et par phase du cycle.
  L'accueil indique la prochaine étape conseillée.
- Annulation d'une suppression (« Annuler » dans la notification).
- Réordonnancement des éléments de liste.
- Indicateur d'enregistrement, et avertissement si le navigateur bloque le stockage local.

**Dossiers**
- Plusieurs dossiers en parallèle, avec bascule, duplication, suppression.
- Import : ajouter à côté ou remplacer. Export d'un dossier, de tous, ou en Markdown.
- Reprise automatique d'un dossier créé avec la v1.

**Les 7 outils ajoutés** (marqués `+`, tirés du manuel ULB-Coopération)

| N° | Outil | Ce que fait l'atelier |
|---|---|---|
| 16 | Fenêtres d'opportunité | Agenda des échéances politiques + les 3 conditions d'exploitabilité |
| 17 | Axes stratégiques et priorisation | Reprend les causes de l'arbre, note chaque axe sur 9 critères pondérables, classe automatiquement et alerte au-delà de 3 axes |
| 18 | Choix de la stratégie | Positionnement sur le plan coopération ↔ confrontation / formel ↔ informel, 13 stratégies, 6 théories du changement politique, plan de repli |
| 19 | Fiche de ciblage | Les 12 champs du ciblage ULB : détonateur, langage, canaux, à qui la cible rend des comptes… |
| 20 | Alliances et réseau | Typologie des allié·e·s, check-lists de création et de vie de la coalition |
| 21 | Médias et interview | Grille d'analyse par média, pitch de 30 s, deux messages prioritaires, technique du pont |
| 22 | Mobilisation et pétition | Plan d'actions + rédacteur de pétition avec aperçu en direct et critères |

Les outils existants ont aussi été enrichis : niveaux de pouvoir belges et rang principal/secondaire
dans la cartographie, cibles de 1er et 2e niveau, suivi de l'évolution des cibles
(conscientisation → volonté → action) dans l'outil 15.

## Circulation des données entre outils

- Arbre à problème (8) → **axes stratégiques** (17)
- Cartographie (4) → **cibles** (12) → **fiches de ciblage** (19) → **suivi** (15)
- Cibles et acteurs principaux → **échelle d'engagement** de l'outil 15

## Installation

Dépôt statique, aucune configuration. Sur GitHub Pages, le dossier `1/` à la racine du dépôt
est servi tel quel.

En local :

```bash
python3 -m http.server 8000
# http://localhost:8000/1/
```

Le navigateur proposera ensuite « Installer l'application » (ou « Ajouter à l'écran d'accueil »
sur iPhone, via le bouton Partager).

> L'application utilise des modules ES et un service worker : elle doit être servie en `http(s)`.
> Ouverte en `file://`, elle ne démarrera pas.

## Vos données

Tout est stocké dans le navigateur, sur l'appareil. Rien n'est transmis. Conséquence :
effacer les données de site supprime les dossiers — **exportez régulièrement**.

## Structure

```
1/
├── index.html
├── manifest.webmanifest
├── sw.js                    ← changez VERSION à chaque modification
├── css/app.css              ← jetons de design, thèmes clair/sombre
├── js/
│   ├── content.js           ← tout le texte du guide et les référentiels
│   ├── store.js             ← état, dossiers, persistance, avancement
│   ├── ui.js                ← fabriques de composants
│   ├── ateliers.js          ← les 22 ateliers
│   ├── views.js             ← tableau de bord, page d'outil, dossier, réglages
│   └── app.js               ← routage, interactions, palette, import/export
├── assets/fonts/            ← 3 polices variables, licence SIL OFL
└── icons/
```

Pour modifier un texte de fiche ou ajouter un critère, tout est dans `content.js` — sans toucher
au code. Pour ajouter un outil : une entrée dans `OUTILS`, son id dans `ORDRE`, une fonction
dans `ateliers.js`, une mesure d'avancement dans `MESURES`.

## Tests

Le rendu des 22 outils, la saisie, la persistance, l'annulation, la priorisation, la palette
et les exports sont couverts par un banc d'essai en navigateur simulé (jsdom) — 117 assertions.
