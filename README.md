# Atelier plaidoyer — poste de travail du plaidoyer citoyen

Application web installable (PWA) reprenant les **15 outils** du *Petit guide du plaidoyer
citoyen* (Commission Justice et Paix, 2020), complétés par le manuel de plaidoyer
d'ULB-Coopération (2021).

Chaque outil a deux faces :
- **Le guide** — objectif, méthode, point clé, questions à se poser, exemple.
- **L'atelier** — l'espace où vous remplissez l'outil sur votre propre cause.

## Ce qu'elle fait

| Outil | Atelier |
|---|---|
| 1 · Domino du changement | quatre dominos enchaînés |
| 2 · Quel est mon profil ? | test à 7 questions + composition de l'équipe et repérage des profils manquants |
| 3 · Fleur de pouvoir | fleur dessinée en direct, nous / la cible, pétale par pétale |
| 4 · Cartographie des acteur·trice·s | tableau + power mapping influence × intérêt |
| 5 · Théorie du changement | valeurs, hypothèses, vision, missions, conditions à 3 horizons, ordres de changement |
| 6 · SWOT | quatre quadrants interne / externe |
| 7 · PESTEL | six axes |
| 8 · Arbre à problème | racines / tronc / branches, avec bascule vers l'arbre à objectif |
| 9 · Les 5 pourquoi | chaîne causale, cause profonde mise en évidence |
| 10 · Avec, sans, contre | tri des actions en trois registres |
| 11 · Objectifs SMART | phrase type qui se compose en direct + les 5 critères |
| 12 · Cibles et alliances | reprise automatique des indécis·es de la cartographie |
| 13 · Construire un message | les 5 blocs, rendu en fiche, copiable |
| 14 · Check-list de la rencontre | avant / pendant / après + comptes rendus |
| 15 · Suivi et évaluation | journal de bord, indicateurs découpés en petites étapes, questions d'évaluation |

Le **dossier complet** rassemble tout et s'imprime en PDF. Export et import en `.json`
pour partager le travail avec le collectif.

## Installer

**Sur un serveur** (recommandé — c'est ce qui active le mode hors-ligne) :
déposez le dossier tel quel sur n'importe quel hébergement statique
(Netlify, GitHub Pages, un sous-dossier d'un site associatif…). Aucune configuration,
aucun compte, aucune base de données.

Pour essayer en local :

```bash
cd plaidoyer
python3 -m http.server 8000
# puis ouvrir http://localhost:8000
```

Une fois la page ouverte, le navigateur propose « Installer l'application »
(ou « Ajouter à l'écran d'accueil » sur iPhone, via le bouton Partager).

## Vos données

Tout reste sur l'appareil, dans le stockage local du navigateur. Rien n'est envoyé
nulle part, il n'y a pas de serveur. Conséquence : videz l'historique du navigateur
« données de site comprises » et le dossier disparaît — **exportez régulièrement**.

Ouvrir `index.html` par double-clic (`file://`) fonctionne, mais certains navigateurs
y bloquent le stockage local et le mode hors-ligne. Passez par un serveur pour un usage réel.

## Adapter

- `data.js` — tout le contenu du guide (fiches, questions du test, check-lists). Modifiable sans toucher au code.
- `styles.css` — la charte : trois encres pour les trois mouvements (voir / juger / agir).
- `app.js` — l'état, les ateliers, l'export.
- `sw.js` — cache hors-ligne. **Si vous modifiez un fichier, changez `VERSION`** pour forcer la mise à jour chez les personnes qui ont déjà installé l'application.

## Crédits

Outils et méthode : Commission Justice et Paix francophone de Belgique,
*Le petit guide du plaidoyer citoyen — 15 outils vers le changement* (2020) ;
ULB-Coopération, manuel de plaidoyer (2021), lui-même nourri des formations
ACE Europe et CAP Impact. La trame voir / juger / agir vient de Joseph Cardijn.
