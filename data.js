/* ================================================================
   ATELIER PLAIDOYER — contenu du guide
   D'après « Le petit guide du plaidoyer citoyen — 15 outils vers le
   changement » (Commission Justice et Paix, 2020) et le manuel de
   plaidoyer d'ULB-Coopération (2021).
   ================================================================ */

const PARTIES = {
  voir: {
    cle: 'voir',
    num: '1',
    titre: 'Voir',
    encre: 'bleu',
    accroche: 'Poser des constats',
    intro: "Avant de se lancer, comprendre le terrain. Cette partie couvre l'analyse du contexte : les forces internes et externes qui pèsent sur le plaidoyer, les rapports de pouvoir, et notre propre place dans ces rapports. On ne cible bien que ce qu'on a pris le temps de regarder.",
    bilan: "L'analyse du contexte et l'identification des parties prenantes ont mis en évidence les dynamiques entre acteur·trice·s et situé le cadre de l'action. C'est cette étape qui rend visibles les rapports de force et fixe les bases du plaidoyer."
  },
  juger: {
    cle: 'juger',
    num: '2',
    titre: 'Juger',
    encre: 'rose',
    accroche: 'Analyser et trancher',
    intro: "Analyser les rapports de force à partir des constats posés, identifier les fenêtres d'opportunité, et fixer le cœur de la stratégie : les solutions à proposer. C'est ici que le problème se transforme en objectif.",
    bilan: "Les points d'appui de la stratégie sont posés : le problème et ses causes profondes, la lecture critique du contexte, la voie du changement. Reste à passer à l'action."
  },
  agir: {
    cle: 'agir',
    num: '3',
    titre: 'Agir',
    encre: 'jaune',
    accroche: 'Mettre en œuvre',
    intro: "Les actions concrètes : choisir son rapport au pouvoir, formuler des objectifs tenables, cibler, construire un message, préparer la rencontre, suivre et évaluer. Le plaidoyer se joue ici, mais il ne tient que sur les deux parties précédentes.",
    bilan: "Le message existe, les rencontres se préparent, le suivi est en place. Le plaidoyer se construit dans la durée : le cycle recommence, enrichi de ce que vous venez d'apprendre."
  }
};

const CYCLE = ['Analyse', 'Stratégie', 'Messages', 'Mise en œuvre', 'Suivi', 'Évaluation'];

/* Chaque outil : fiche (guide) + type d'atelier (outil) */
const OUTILS = [
  {
    id: 1, partie: 'voir', titre: 'Domino du changement', atelier: 'domino',
    etape: 'Analyse',
    resume: "Cadrer le projet : pourquoi et pour quoi je m'engage.",
    objectif: "Outil d'introduction pour cadrer le projet de plaidoyer. Il sert à réfléchir à notre rapport au monde, à déterminer le sujet du plaidoyer et à l'inscrire dans le cadre plus large du changement désiré dans la société.",
    methode: [
      "Le domino conduit à la finalité de l'engagement : il répond aux questions <em>pourquoi</em> et <em>pour quoi</em> je veux m'engager.",
      "Chaque réponse fait tomber la suivante : les raisons, puis les valeurs, puis le changement visé, puis les actions.",
      "Utilisable seul ou en groupe. Sa configuration en dominos permet de comparer facilement ses réponses avec celles d'autres personnes."
    ],
    pointcle: "Comparer son domino avec celui d'autres collectifs met en évidence les valeurs communes : c'est le point de départ d'une convergence des luttes.",
    questions: [
      "Pourquoi voulons-nous nous engager ?",
      "Quelles valeurs portons-nous via cet engagement ?",
      "Quels changements souhaitons-nous voir dans la société ?",
      "Quelles actions pourrions-nous mener pour y arriver ?"
    ]
  },
  {
    id: 2, partie: 'voir', titre: 'Quel est mon profil ?', atelier: 'profil',
    etape: 'Analyse',
    resume: "Repérer son profil dominant et composer une équipe complémentaire.",
    objectif: "Une équipe de plaidoyer a besoin de profils différents pour couvrir toutes ses fonctions. Se connaître et connaître celles et ceux qui nous entourent est une première étape pour trouver l'équilibre du groupe.",
    methode: [
      "Sept questions, trois tendances : planificateur·trice, communicant·e, chercheur·euse.",
      "Le test donne une tendance dominante, pas une étiquette : les frontières entre catégories sont poreuses et demandent à être nuancées.",
      "L'intérêt est collectif : cartographier les profils du groupe pour repérer ce qui manque et créer des alliances complémentaires."
    ],
    pointcle: "Un collectif composé uniquement de chercheur·euses produira d'excellents dossiers que personne n'entendra.",
    questions: [
      "Quels profils sont déjà présents dans le groupe ?",
      "Quelle fonction n'est portée par personne ?",
      "Qui pourrait rejoindre le collectif pour combler ce manque ?"
    ],
    source: "Adapté de la formation plaidoyer CAP! (juin 2019)."
  },
  {
    id: 3, partie: 'voir', titre: 'Fleur de pouvoir', atelier: 'fleur',
    etape: 'Analyse',
    resume: "Situer son identité face à celle des personnes qui détiennent le pouvoir.",
    objectif: "L'analyse du pouvoir doit commencer par les personnes qui la mènent. Genre, classe sociale, âge, origine, niveau d'étude : ces facteurs influencent nos points de vue et déterminent les dynamiques de pouvoir avec nos partenaires comme dans l'environnement politique.",
    methode: [
      "Chaque pétale représente une catégorie : genre, ethnie, classe sociale, religion, niveau d'étude, âge — la liste peut s'allonger (langue, validité, statut de séjour…).",
      "On note pour chaque pétale sa propre caractéristique, puis celle de la personne cible ou de la « classe dominante » du champ visé.",
      "L'écart entre les deux se lit d'un coup d'œil : c'est la mesure des privilèges dont on dispose, ou dont on ne dispose pas, dans la rencontre."
    ],
    pointcle: "Une rencontre entre deux hommes blancs du même âge, de la même classe et du même niveau d'étude ne se déroule pas comme une rencontre entre ce même élu et une jeune femme racisée dont c'est le premier emploi. Anticiper cet écart fait partie de la préparation.",
    questions: [
      "Sommes-nous proches ou éloignés de la classe qui décide ?",
      "Parlons-nous au nom d'une communauté minorisée dont nous ne faisons pas partie ?",
      "Quels biais personnels ces critères introduisent-ils dans notre plaidoyer ?",
      "Quels appuis extérieurs peuvent compenser un déséquilibre de légitimité ?"
    ],
    source: "Voir les 19 critères de discrimination repris par Unia."
  },
  {
    id: 4, partie: 'voir', titre: 'Cartographie des acteur·trice·s et power mapping', atelier: 'acteurs',
    etape: 'Analyse',
    resume: "Qui détient quel pouvoir, qui est allié, qui est cible.",
    objectif: "Déterminer qui détient le pouvoir et répartir les parties prenantes entre cibles (visées par le plaidoyer) et partenaires (qui travaillent au même objectif). Cette carte est la matière première des outils « Cibles et alliances » et « Construire un message ».",
    methode: [
      "Recenser les cibles potentielles, leur degré d'intérêt pour la thématique et leur capacité d'influence.",
      "Estimer le niveau d'influence que nous pouvons avoir sur elles.",
      "Évaluer leur position par rapport à nos objectifs : soutien, indécision, opposition.",
      "Penser large sur les <em>types</em> de pouvoir : politique, législatif, juridique, religieux, coutumier, scientifique, économique, familial, culturel, médiatique, citoyen."
    ],
    pointcle: "On pense d'abord au pouvoir politique, mais selon le contexte le pouvoir religieux, économique ou médiatique pèse davantage. Le power mapping consiste aussi à comprendre comment le déséquilibre se maintient — et par où il peut bouger.",
    questions: [
      "Qui dispose de quel type de pouvoir ?",
      "Qui en a le plus, qui en a le moins ?",
      "Comment le déséquilibre est-il maintenu ?",
      "Comment peut-on le modifier ?"
    ]
  },
  {
    id: 5, partie: 'juger', titre: 'Théorie du changement', atelier: 'toc',
    etape: 'Stratégie',
    resume: "Des valeurs à la vision, puis le chemin et ses conditions.",
    objectif: "Expliciter ce en quoi nous croyons, le futur que nous visons, et le chemin qui relie les deux. La théorie du changement devient aussi un excellent outil de présentation du collectif.",
    methode: [
      "<strong>Valeurs</strong> — les grands principes dont on part (solidarité, action collective…).",
      "<strong>Hypothèses</strong> — « s'il se passe telle chose, alors le résultat sera celui-là ».",
      "<strong>Vision</strong> — le futur idéal sur la thématique, à long terme.",
      "<strong>Missions</strong> — ce que le groupe fait concrètement pour contribuer à cette vision. Ce ne sont pas encore les objectifs de plaidoyer à court terme.",
      "Puis : déterminer la voie du changement (les domaines d'action) et examiner les conditions nécessaires à court, moyen et long terme."
    ],
    pointcle: "Le changement se joue à trois niveaux : les <em>événements</em> et façons de faire (1er ordre), les <em>modèles</em> et façons de penser (2e ordre), les <em>structures</em> et façons de comprendre (3e ordre). Un plaidoyer qui ne touche que le premier ordre ne tient pas dans la durée.",
    questions: [
      "Distinguons-nous bien les valeurs (principes) de la vision (futur idéal) ?",
      "Nos hypothèses sont-elles explicites — et vérifiables ?",
      "Quelles conditions doivent être réunies pour que le changement se produise ?",
      "À quel ordre de changement notre action s'attaque-t-elle ?"
    ],
    source: "D'après ITECO, « La théorie du changement », Antipodes n°17, 2016 ; ACE Europe et al., Guide TdC, 2020."
  },
  {
    id: 6, partie: 'juger', titre: 'Analyse SWOT', atelier: 'swot',
    etape: 'Stratégie',
    resume: "Forces, faiblesses, opportunités, menaces (FFOM).",
    objectif: "Évaluer les éléments internes et externes pertinents pour la conduite du plaidoyer. Les forces internes déterminent notre capacité à mettre en œuvre une stratégie ; les forces externes favoriseront ou entraveront l'action.",
    methode: [
      "<strong>Interne</strong> — forces et faiblesses : ce sur quoi le groupe a prise.",
      "<strong>Externe</strong> — opportunités et menaces : l'environnement du plaidoyer.",
      "À faire en équipe : l'exercice sert autant à aligner les représentations du groupe qu'à produire le tableau."
    ],
    pointcle: "Une faiblesse honnête vaut mieux qu'une force inventée : le SWOT ne sert qu'à celles et ceux qui acceptent d'y écrire ce qui manque.",
    questions: [
      "En quoi excellons-nous ? Quelles activités sont efficaces ?",
      "Quelles sont nos principales compétences et qualités — et celles de nos allié·e·s ?",
      "Que manque-t-il dans notre groupe ? Quelles ont été les raisons de nos échecs passés ?",
      "Quelles évolutions sont favorables à notre cause ? Quelles actions autour de nous peuvent nous soutenir ?",
      "Quelles forces peuvent nous empêcher d'agir ? Quels sont les problèmes cachés, les risques ?"
    ]
  },
  {
    id: 7, partie: 'juger', titre: 'Analyse PESTEL', atelier: 'pestel',
    etape: 'Stratégie',
    resume: "Le contexte en six axes : politique, économique, social, technique, environnemental, légal.",
    objectif: "Comprendre systématiquement l'environnement dans lequel s'inscrit le plaidoyer, identifier de nouvelles opportunités ou problématiques, construire des scénarios et développer une vision cohérente.",
    methode: [
      "Passer la problématique au filtre des six axes, sans se censurer au premier tour.",
      "Toutes les catégories ne sont pas pertinentes pour toutes les problématiques : ratisser large d'abord, trier ensuite.",
      "Comme le SWOT, à faire en équipe pour que chacun·e parte de la même représentation du cas."
    ],
    pointcle: "Plus on connaît le contexte, plus on trouve la solution adéquate. Sans cette lecture, on ne sait pas où l'on peut agir.",
    questions: [
      "Quels facteurs externes peuvent influencer les causes ou les conséquences du problème ?",
      "Quels facteurs et tendances politiques sont pertinents ?",
      "Quels groupes de pression peuvent exercer une influence ?",
      "Quelles normes nationales et internationales sont en vigueur ?",
      "Quelles sont les tendances économiques ? Sociales ?"
    ]
  },
  {
    id: 8, partie: 'juger', titre: 'Arbre à problème et arbre à objectif', atelier: 'arbre',
    etape: 'Stratégie',
    resume: "Racines, tronc, branches — puis on positive.",
    objectif: "Analyser les causes profondes d'un problème et en identifier les principales conséquences. Le succès du plaidoyer dépend de la manière dont le problème est posé : on s'attaque aux causes, pas aux manifestations visibles.",
    methode: [
      "<strong>Le tronc</strong> = le problème. <strong>Les racines</strong> = ses causes profondes. <strong>Les branches</strong> = ses conséquences.",
      "Étape 1 : identifier causes et effets. Étape 2 : « positiver » chaque élément — l'arbre à problème devient arbre à objectif, c'est-à-dire des pistes de propositions de plaidoyer.",
      "L'approche peut être circulaire : les problèmes sont multidimensionnels, les causes interconnectées, parfois contradictoires. Ce n'est pas un défaut de l'outil."
    ],
    pointcle: "Le passage à l'arbre à objectif n'est pas cosmétique : c'est là que naissent les demandes concrètes qu'on adressera aux décideur·euses.",
    questions: [
      "Quelles causes ou conséquences peuvent être regroupées ?",
      "Quelles conséquences sont les plus graves, les plus préoccupantes ?",
      "Quelles causes seront plus faciles à traiter ? Plus difficiles ? Pourquoi ?",
      "Que peut faire le gouvernement ? Les institutions internationales ? Les citoyen·ne·s ?",
      "Quelles causes et conséquences s'améliorent, lesquelles empirent, lesquelles restent inchangées ?"
    ]
  },
  {
    id: 9, partie: 'juger', titre: 'Les 5 pourquoi', atelier: 'cinq',
    etape: 'Stratégie',
    resume: "Cinq fois « pourquoi » pour atteindre la cause profonde.",
    objectif: "Complément de l'arbre à problème : décortiquer un problème jusqu'à sa cause profonde, celle sur laquelle il est nécessaire d'agir.",
    methode: [
      "Partir du problème et se demander cinq fois de suite « pourquoi est-ce ainsi ? ».",
      "Chaque réponse devient la question suivante.",
      "Le dernier élément de réponse constitue la cause profonde."
    ],
    pointcle: "L'outil donne une vision linéaire et mono-causale : c'est sa limite. Assumée, elle force l'esprit à pousser le raisonnement causal plus loin et à identifier des niveaux d'action différents.",
    questions: [
      "Sommes-nous descendus jusqu'à une cause structurelle, ou arrêtés à une cause de surface ?",
      "À quel niveau d'action correspond chaque étage de la chaîne ?",
      "Une autre chaîne partant du même problème mènerait-elle ailleurs ?"
    ]
  },
  {
    id: 10, partie: 'agir', titre: 'Avec, sans et contre le pouvoir', atelier: 'rapport',
    etape: 'Mise en œuvre',
    resume: "Trois rapports au pouvoir, complémentaires.",
    objectif: "Une fois le contexte et les objectifs identifiés, situer ses actions dans une dynamique <em>avec</em>, <em>contre</em> ou <em>sans</em> le pouvoir. Le plaidoyer s'inscrit dans la stratégie « avec » — les autres lui sont complémentaires.",
    methode: [
      "<strong>Agir avec</strong> — le pouvoir est perçu comme un allié : dialogue, négociation, co-construction avec l'État dans un rapport de force équilibré. <em>Ex. : une rencontre de plaidoyer.</em>",
      "<strong>Agir contre</strong> — participation non conventionnelle : le changement naît du conflit avec les sphères du pouvoir. <em>Ex. : des agriculteurs qui versent du lait dans la rue.</em>",
      "<strong>Agir sans</strong> — création d'un espace d'autonomie, foisonnement d'alternatives citoyennes, le pouvoir conventionnel est mis de côté. <em>Ex. : héberger des personnes migrantes.</em>"
    ],
    pointcle: "Ces leviers ne s'excluent pas : ils se renforcent mutuellement. Beaucoup de collectifs en pratiquent plusieurs sans l'avoir décidé — nommer ce qu'on fait permet de le doser.",
    questions: [
      "Quel est notre rapport dominant au pouvoir, aujourd'hui ?",
      "Est-il choisi ou subi ?",
      "Quelle action d'un autre registre renforcerait notre plaidoyer ?"
    ],
    source: "D'après Quinoa, « Potentia. La puissance de l'agir collectif », 2016."
  },
  {
    id: 11, partie: 'agir', titre: 'Objectifs SMART', atelier: 'smart',
    etape: 'Mise en œuvre',
    resume: "Spécifique, mesurable, atteignable, réaliste, temporel.",
    objectif: "La vision se décline en un objectif général puis en sous-objectifs. Pour augmenter les chances de les atteindre, il faut les formuler de façon précise et méthodologique. L'axe stratégique est de long terme ; les objectifs sont de court terme.",
    methode: [
      "<strong>S</strong>pécifique — l'objectif porte sur un élément précis, délimité (géographiquement par exemple).",
      "<strong>M</strong>esurable — quantifiable, ou suivi par des indicateurs de résultat pour le qualitatif.",
      "<strong>A</strong>tteignable — ambitieux mais réaliste, tenant compte de vos capacités et de vos valeurs.",
      "<strong>R</strong>éaliste — réalisable avec les moyens et ressources disponibles (temps, personnes).",
      "<strong>T</strong>emporel — sans échéance, l'objectif perd son caractère concret."
    ],
    pointcle: "Formulation type : « D'ici <em>(temps)</em>, obtenir <em>(décision spécifique et mesurable)</em> en faisant <em>(action atteignable)</em> grâce à <em>(moyen réaliste)</em>. »",
    questions: [
      "Quel changement est visé ? (Quoi ?)",
      "Quelle solution est proposée ? (Comment ?)",
      "Qui peut opérer le changement ? (Qui ?)",
      "Quelle échéance ? (Quand ?)"
    ],
    exemple: "D'ici décembre 2020, Justice et Paix rencontrera 20 responsables politiques belges et européens afin d'obtenir une révision du processus de Kimberley pour implémenter les recommandations de la société civile."
  },
  {
    id: 12, partie: 'agir', titre: 'Cibles et alliances', atelier: 'cibles',
    etape: 'Mise en œuvre',
    resume: "Viser les indécis·es, choisir ses allié·e·s.",
    objectif: "Identifier les personnes qui peuvent avoir une influence sur le changement souhaité, puis celles qui peuvent nous aider à les atteindre.",
    methode: [
      "Les <strong>indécis·es</strong> sont les cibles les plus intéressantes : c'est sur elles que nous avons une influence, et les convaincre peut faire basculer l'issue du plaidoyer.",
      "Anticiper ce que la cible <em>gagne</em> ou <em>perd</em> en se ralliant : c'est la matière de l'argumentaire.",
      "Convaincre un adversaire dont l'avis est tranché est une tâche bien plus coûteuse — à arbitrer.",
      "Les <strong>allié·e·s</strong> s'identifient par une analyse des avantages et des risques de la collaboration : soutien humain, matériel, financier, en légitimité."
    ],
    pointcle: "S'adresser à celles et ceux qui adhèrent déjà est utile pour consolider ; ce n'est pas là que le rapport de force se déplace.",
    questions: [
      "Qui peut décider du changement que nous demandons ?",
      "Que gagne cette personne à nous suivre ? Que risque-t-elle ?",
      "Quel allié apporte ce qui nous manque — expertise, réseau, nombre, argent ?",
      "Quels risques la collaboration fait-elle courir à notre message ?"
    ]
  },
  {
    id: 13, partie: 'agir', titre: 'Construire un message', atelier: 'message',
    etape: 'Messages',
    resume: "Accroche, problème, importance, cible, action demandée.",
    objectif: "Pour avoir un impact, le message doit être clair, simple et adapté à l'interlocuteur·trice. Il décrit le changement visé et présente concrètement ce que vous voulez obtenir.",
    methode: [
      "<strong>Une accroche</strong> — donner envie d'écouter. Le plus petit dénominateur commun : « chaque seconde… », « le prix d'un café… », une statistique proche des gens, une histoire dans laquelle on se reconnaît.",
      "<strong>Un problème</strong> — expliqué simplement.",
      "<strong>Pourquoi c'est important</strong> — pour la cible, et pourquoi maintenant.",
      "<strong>La cible</strong> — à qui on parle.",
      "<strong>L'action demandée</strong> — sans demande d'action, on fait de la sensibilisation, pas du plaidoyer.",
      "Préparer plusieurs messages en réserve : selon l'usage, on n'utilise pas le même morceau. Sur une affiche, c'est l'accroche ; en rencontre lobby, c'est le « pourquoi maintenant » pour le décideur."
    ],
    pointcle: "Le moment de diffusion compte autant que le contenu : caler le message sur l'agenda politique ou un événement externe (conseil communal, manifestation, vote en commission).",
    questions: [
      "Un enfant de douze ans comprendrait-il notre accroche ?",
      "Avons-nous formulé une demande d'action précise, adressée à quelqu'un ?",
      "Le message tient-il sans jargon ni acronyme ?"
    ],
    exemple: "720 millions de GSM sont jetés chaque année. Les minerais qu'ils contiennent viennent de l'Est du Congo, une région riche en ressources naturelles touchée par des conflits liés à ces mêmes ressources. Responsables politiques et citoyen·ne·s : mettons en place des mesures pour un approvisionnement responsable."
  },
  {
    id: 14, partie: 'agir', titre: 'Check-list de la rencontre', atelier: 'rencontre',
    etape: 'Mise en œuvre',
    resume: "Avant, pendant, après l'interpellation.",
    objectif: "Porter le message auprès des responsables politiques, à distance ou en présentiel. La préparation augmente nettement les chances de faire passer le message.",
    methode: [
      "<strong>Avant</strong> — cinq étapes clés : se familiariser avec les sphères du pouvoir (veille sur l'agenda politique, ciblage) ; attirer l'attention (lettres, pétition, déclaration de soutien, événement) ; bâtir des relations de confiance (demande officielle d'être reçu, réunions d'information régulières, expertise fournie, contacts personnels) ; choisir ses représentant·e·s selon la cible et les profils ; préparer la rencontre en groupe (stratégie, documents, aspects pratiques, répartition des prises de parole).",
      "<strong>Pendant</strong> — établir le lien, remercier de l'accueil, présenter le groupe, exposer problème / solutions / demandes, tenter d'obtenir un engagement, laisser des documents écrits.",
      "<strong>Après</strong> — compte-rendu, points de suivi et prochaine échéance, évaluation et retour à l'équipe."
    ],
    pointcle: "Écouter attentivement pendant la rencontre sert à repérer les résistances : elles vous donnent les arguments de la prochaine fois. Être clair et bref reste la meilleure posture.",
    questions: [
      "Qui dit quoi, dans quel ordre ?",
      "Quelle est la seule chose que nous voulons obtenir en sortant ?",
      "Qu'est-ce qu'on laisse par écrit ?",
      "Quelle est la prochaine échéance proposée ?"
    ],
    source: "D'après la formation plaidoyer CAP! (juin 2019)."
  },
  {
    id: 15, partie: 'agir', titre: 'Suivi et évaluation', atelier: 'suivi',
    etape: 'Suivi',
    resume: "Journal de bord, indicateurs, remise en question.",
    objectif: "Le suivi est un processus continu de récolte d'informations qui permet d'adapter la stratégie. L'évaluation juge le travail mené et les résultats atteints : points positifs, négatifs, pistes d'amélioration.",
    methode: [
      "Tenir un <strong>journal de bord</strong> : objectifs, actions, résultats, personnes impliquées.",
      "Suivre à la fois <strong>les actions entreprises</strong> et <strong>l'évolution du positionnement des cibles</strong>.",
      "Découper chaque objectif en indicateurs, puis en étapes les plus petites possibles — c'est ce qui rend les progrès visibles.",
      "Ré-évaluer le contexte en permanence : une élection, un fait d'actualité ou une manifestation peuvent changer le cadre du jour au lendemain."
    ],
    pointcle: "En plaidoyer, on ne démontre pas que le résultat est le nôtre : on démontre qu'on y a <em>contribué</em>. Les calendriers dépendent de l'agenda politique, donc restent imprévisibles — d'où l'importance des petites victoires pour tenir la motivation, et d'un plan B permanent.",
    questions: [
      "L'approche fonctionne-t-elle ?",
      "Le message est-il adressé aux bonnes personnes ?",
      "Le canal de communication est-il adapté à la cible ?",
      "Nos allié·e·s sont-ils/elles les bonnes personnes ? Et nos cibles ?",
      "Le travail porte-t-il ses fruits ? Allons-nous atteindre nos résultats ?",
      "Ce changement est-il porteur de sens ? Sera-t-il durable ?",
      "Partenaires et cibles ont-ils respecté leurs engagements ?"
    ]
  }
];

/* Test de profil — outil 2 */
const QUIZ = [
  { q: "Au quotidien, si vous ne deviez en choisir qu'une, quelle tâche choisiriez-vous ?",
    r: ["Organiser les activités, prendre des rendez-vous, s'assurer que la logistique est en place",
        "Créer des outils de communication, échanger avec vos collègues",
        "Vous documenter sur un sujet, produire un rapport"] },
  { q: "Vous devez analyser un problème. Quel est votre premier réflexe ?",
    r: ["Vous faites un bilan de la situation actuelle",
        "Vous interrogez les personnes sur les solutions qu'elles aimeraient mettre en place",
        "Vous recherchez ce qui est à l'origine de ce problème"] },
  { q: "Vous êtes en charge d'une négociation difficile. Comment réagissez-vous ?",
    r: ["Vous vous renseignez sur le contexte et la partie adverse, préparez des fiches et vous entraînez aux réponses types",
        "Vous cherchez qui est votre interlocuteur·trice et préparez un argumentaire montrant que votre position arrange tout le monde",
        "Vous rassemblez toutes les informations, préparez vos arguments et des fiches de données précises"] },
  { q: "Quelle est votre devise sur la communication ?",
    r: ["« Un message concis, travaillé, est un message percutant ! »",
        "« Un message spontané et affirmé est un message gagnant ! »",
        "« L'important, c'est de donner le maximum d'informations ! »"] },
  { q: "Quels sont vos meilleurs atouts professionnels ?",
    r: ["Votre sens de l'organisation et votre précision",
        "Votre sens du concret et du relationnel",
        "Votre esprit d'analyse et votre capacité à aller au bout des sujets"] },
  { q: "Votre organisation lance un grand événement. Quelle tâche prenez-vous ?",
    r: ["Trouver le lieu, dresser la liste des invités, s'assurer de la présence des décideur·euse·s",
        "Faire connaître l'événement sur les réseaux, inviter les journalistes, prévoir les interviews",
        "Formuler le programme et trouver les intervenant·e·s pertinent·e·s"] },
  { q: "Vous vous décririez plutôt comme une personne…",
    r: ["Consciencieuse et réaliste", "Ouverte et diplomate", "Observatrice et créative"] }
];

const PROFILS = {
  a: { cle: 'a', nom: 'Planificateur·trice',
       txt: "Vous aimez prévoir. L'organisation est votre point fort et vous analysez rapidement une situation. Rigoureux·se et précis·e, vous vous préparez à toute éventualité et tenez la liste détaillée des tâches.",
       role: "Tient le calendrier, la logistique des rencontres, le suivi des engagements." },
  b: { cle: 'b', nom: 'Communicant·e',
       txt: "La communication n'a pas de secret pour vous. Sociable, vous faites le premier pas pour comprendre votre interlocuteur·trice. Vos compétences diffusent les informations nécessaires au bon déroulement du projet.",
       role: "Porte le message, tient les relations presse, anime le réseau d'allié·e·s." },
  c: { cle: 'c', nom: 'Chercheur·euse',
       txt: "Votre sens de l'observation fait de vous un·e chercheur·euse hors pair. Vous vous appropriez une thématique et l'approfondissez en posant les bonnes questions. Votre analyse cible les informations utiles.",
       role: "Construit l'expertise, documente les arguments, prépare les fiches techniques." }
};

const PETALES = ['Genre', 'Origine / ethnie', 'Classe sociale', 'Religion', "Niveau d'étude", 'Âge'];

const POUVOIRS = ['politique', 'législatif', 'juridique', 'religieux', 'coutumier', 'scientifique',
                  'économique', 'familial', 'culturel', 'médiatique', 'citoyen'];

const PESTEL_AXES = [
  { cle: 'P', nom: 'Politique', aide: "Tendances politiques, majorités, agenda, groupes de pression." },
  { cle: 'E', nom: 'Économique', aide: "Conjoncture, financements, intérêts économiques en jeu." },
  { cle: 'S', nom: 'Social', aide: "Opinion publique, démographie, mouvements sociaux, culture." },
  { cle: 'T', nom: 'Technique', aide: "Technologies, innovations, moyens techniques disponibles." },
  { cle: 'V', nom: 'Environnement / santé', aide: "Enjeux écologiques et sanitaires liés à la problématique." },
  { cle: 'L', nom: 'Légal', aide: "Normes nationales et internationales, jurisprudence, réglementation." }
];

const CHECKLIST = {
  avant: [
    "Veille sur l'agenda politique : quelle fenêtre d'opportunité ?",
    "Cible identifiée et vérifiée (mandat, compétence réelle sur le sujet)",
    "Attention attirée en amont (lettre, pétition, événement, déclaration de soutien)",
    "Demande officielle d'être reçu·e envoyée",
    "Représentant·e·s choisi·e·s selon la cible et les profils du groupe",
    "Répartition des prises de parole décidée (intro, objectifs, actions, messages clés)",
    "Documents à laisser préparés (fiche d'information, brochure, note de position)",
    "Aspects pratiques calés : lieu, heure, durée, trajet, qui note",
    "Rappel de la stratégie fait avec le groupe"
  ],
  pendant: [
    "Remercier de l'accueil, établir le lien",
    "Présenter le groupe et sa légitimité",
    "Exposer le problème, les solutions, les demandes d'action",
    "Écouter attentivement les résistances",
    "Rester clair et bref, sans jargon",
    "Tenter d'obtenir un engagement concret",
    "Remettre les documents écrits"
  ],
  apres: [
    "Compte-rendu rédigé",
    "Points de suivi transmis (prochaines étapes, échéance, nouveau rendez-vous)",
    "Évaluation faite avec le groupe",
    "Retour à l'équipe et aux allié·e·s",
    "Positionnement de la cible mis à jour dans la cartographie"
  ]
};

const POSITIONS = [
  { cle: 'allie', nom: 'Allié·e' },
  { cle: 'indecis', nom: 'Indécis·e' },
  { cle: 'adversaire', nom: 'Adversaire' }
];
