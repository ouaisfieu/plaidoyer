/* ==================================================================
   CONTENU DU GUIDE
   Sources : Commission Justice et Paix, « Le petit guide du plaidoyer
   citoyen — 15 outils vers le changement » (2020) ; ULB-Coopération,
   manuel de plaidoyer (2021), nourri des formations ACE Europe,
   CAP! et CNCD. Trame voir / juger / agir : Joseph Cardijn.
   ================================================================== */

export const PARTIES = {
  voir: {
    cle: 'voir', num: 1, titre: 'Voir', encre: 'voir', accroche: 'Poser des constats',
    intro: "Comprendre le terrain avant de s'y engager : les forces internes et externes qui pèsent sur le plaidoyer, les rapports de pouvoir, et notre propre place dans ces rapports.",
    bilan: "L'analyse du contexte et l'identification des parties prenantes rendent visibles les rapports de force. C'est la base sur laquelle tout le reste tient."
  },
  juger: {
    cle: 'juger', num: 2, titre: 'Juger', encre: 'juger', accroche: 'Analyser et trancher',
    intro: "Analyser les rapports de force, repérer les fenêtres d'opportunité, choisir sur quoi porter l'effort. C'est ici que le problème devient objectif.",
    bilan: "Le problème est décortiqué, le contexte lu, les axes hiérarchisés. Reste à agir — sur deux ou trois fronts, pas quinze."
  },
  agir: {
    cle: 'agir', num: 3, titre: 'Agir', encre: 'agir', accroche: 'Mettre en œuvre',
    intro: "Choisir son rapport au pouvoir et sa stratégie, formuler des objectifs tenables, cibler finement, construire un message, mobiliser, rencontrer, suivre.",
    bilan: "Le plaidoyer se construit dans la durée. Le cycle recommence, enrichi de ce que la première boucle vous a appris."
  }
};

export const PHASES = [
  { cle: 'analyse', nom: 'Analyse' },
  { cle: 'strategie', nom: 'Stratégie' },
  { cle: 'messages', nom: 'Messages' },
  { cle: 'oeuvre', nom: 'Mise en œuvre' },
  { cle: 'suivi', nom: 'Suivi' },
  { cle: 'evaluation', nom: 'Évaluation' }
];

export const OUTILS = [
  /* ---------------------------------------------------------- VOIR */
  {
    id: 1, partie: 'voir', phase: 'analyse', atelier: 'domino',
    titre: 'Domino du changement',
    resume: "Cadrer le projet : pourquoi et pour quoi je m'engage.",
    objectif: "Outil d'introduction pour cadrer le projet de plaidoyer. Il sert à réfléchir à notre rapport au monde, à déterminer le sujet du plaidoyer et à l'inscrire dans le cadre plus large du changement désiré dans la société.",
    methode: [
      "Le domino conduit à la finalité de l'engagement : il répond aux questions <em>pourquoi</em> et <em>pour quoi</em> je veux m'engager.",
      "Chaque réponse fait tomber la suivante : les raisons, puis les valeurs, puis le changement visé, puis les actions.",
      "Utilisable seul ou en groupe. Sa configuration en dominos permet de comparer facilement ses réponses avec celles d'autres personnes."
    ],
    pointcle: "Comparer son domino avec celui d'autres collectifs fait apparaître les valeurs communes : c'est le point de départ d'une convergence des luttes.",
    questions: [
      "Pourquoi voulons-nous nous engager ?",
      "Quelles valeurs portons-nous via cet engagement ?",
      "Quels changements souhaitons-nous voir dans la société ?",
      "Quelles actions pourrions-nous mener pour y arriver ?"
    ]
  },
  {
    id: 2, partie: 'voir', phase: 'analyse', atelier: 'profil',
    titre: 'Quel est mon profil ?',
    resume: "Repérer son profil dominant et composer une équipe complémentaire.",
    objectif: "Une équipe de plaidoyer a besoin de profils différents pour couvrir toutes ses fonctions. Se connaître et connaître celles et ceux qui nous entourent est une première étape pour trouver l'équilibre du groupe.",
    methode: [
      "Sept questions, trois tendances : planificateur·trice, communicant·e, chercheur·euse.",
      "Le test donne une tendance dominante, pas une étiquette : les frontières entre catégories sont poreuses.",
      "L'intérêt est collectif : cartographier les profils du groupe pour repérer ce qui manque."
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
    id: 3, partie: 'voir', phase: 'analyse', atelier: 'fleur',
    titre: 'Fleur de pouvoir',
    resume: "Situer son identité face à celle des personnes qui détiennent le pouvoir.",
    objectif: "L'analyse du pouvoir doit commencer par les personnes qui la mènent. Genre, classe sociale, âge, origine, niveau d'étude : ces facteurs influencent nos points de vue et déterminent les dynamiques de pouvoir avec nos partenaires comme dans l'environnement politique.",
    methode: [
      "Chaque pétale représente une catégorie : genre, origine, classe sociale, religion, niveau d'étude, âge — la liste peut s'allonger (langue, validité, statut de séjour…).",
      "On note pour chaque pétale sa propre caractéristique, puis celle de la personne cible ou de la classe dominante du champ visé.",
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
    id: 4, partie: 'voir', phase: 'analyse', atelier: 'acteurs',
    titre: 'Cartographie des acteur·trice·s',
    resume: "Qui détient quel pouvoir, qui est allié, qui est cible.",
    objectif: "Déterminer qui détient le pouvoir et répartir les parties prenantes entre cibles (visées par le plaidoyer) et partenaires (qui travaillent au même objectif). Cette carte alimente ensuite le ciblage, les alliances et le message.",
    methode: [
      "Recenser les cibles potentielles, leur degré d'intérêt pour la thématique et leur capacité d'influence.",
      "Estimer le niveau d'influence que nous pouvons avoir sur elles.",
      "Évaluer leur position par rapport à nos objectifs : soutien, indécision, opposition.",
      "Penser large sur les <em>types</em> de pouvoir : politique, législatif, juridique, religieux, coutumier, scientifique, économique, familial, culturel, médiatique, citoyen.",
      "Distinguer cibles <strong>principales</strong> (dernier mot sur la décision) et <strong>secondaires</strong> (qui influencent les premières)."
    ],
    pointcle: "Beaucoup de campagnes échouent parce que la cible est mal identifiée. Sur un plaidoyer santé, le bon interlocuteur est souvent le ministère du Budget, pas celui de la Santé. Et « le grand public » ne veut rien dire : précisez toujours de qui vous parlez.",
    questions: [
      "Qui dispose de quel type de pouvoir ?",
      "Qui a le dernier mot, qui influence celui ou celle qui l'a ?",
      "Comment le déséquilibre est-il maintenu ? Comment peut-on le modifier ?",
      "Qui est moteur, qui est bloqueur, qui est indécis ?"
    ]
  },

  /* --------------------------------------------------------- JUGER */
  {
    id: 5, partie: 'juger', phase: 'strategie', atelier: 'toc',
    titre: 'Théorie du changement',
    resume: "Des valeurs à la vision, puis le chemin et ses conditions.",
    objectif: "Expliciter ce en quoi nous croyons, le futur que nous visons, et le chemin qui relie les deux. La théorie du changement devient aussi un excellent outil de présentation du collectif.",
    methode: [
      "<strong>Valeurs</strong> — les grands principes dont on part (solidarité, action collective…).",
      "<strong>Hypothèses</strong> — « s'il se passe telle chose, alors le résultat sera celui-là ».",
      "<strong>Vision</strong> — le futur idéal sur la thématique, à long terme.",
      "<strong>Missions</strong> — ce que le groupe fait concrètement pour y contribuer. Ce ne sont pas encore les objectifs de court terme.",
      "Puis : déterminer la voie du changement et examiner les conditions nécessaires à court, moyen et long terme."
    ],
    pointcle: "Le changement se joue à trois niveaux : les <em>événements</em> et façons de faire (1er ordre), les <em>modèles</em> et façons de penser (2e ordre), les <em>structures</em> et façons de comprendre (3e ordre). Un plaidoyer qui ne touche que le premier ordre produit des victoires réversibles.",
    questions: [
      "Distinguons-nous bien les valeurs (principes) de la vision (futur idéal) ?",
      "Nos hypothèses sont-elles explicites — et vérifiables ?",
      "Quelles conditions doivent être réunies pour que le changement se produise ?",
      "À quel ordre de changement notre action s'attaque-t-elle ?"
    ],
    exemple: "Vision : pas de déforestation. Hypothèse : si les consommateur·trices cessent d'acheter et les entreprises d'importer du bois tropical, la déforestation recule. Valeurs : coopération Nord-Sud, responsabilisation des politiques. Mission : pousser l'UE à arrêter l'importation de bois tropical.",
    source: "D'après ITECO, « La théorie du changement », Antipodes n°17, 2016 ; ACE Europe et al., Guide TdC, 2020."
  },
  {
    id: 6, partie: 'juger', phase: 'strategie', atelier: 'swot',
    titre: 'Analyse SWOT',
    resume: "Forces, faiblesses, opportunités, menaces (FFOM).",
    objectif: "Évaluer les éléments internes et externes pertinents pour la conduite du plaidoyer. Les forces internes déterminent notre capacité à mettre en œuvre une stratégie ; les forces externes favoriseront ou entraveront l'action.",
    methode: [
      "<strong>Interne</strong> — forces et faiblesses : ce sur quoi le groupe a prise.",
      "<strong>Externe</strong> — opportunités et menaces : l'environnement du plaidoyer.",
      "À faire en équipe : l'exercice sert autant à aligner les représentations du groupe qu'à produire le tableau."
    ],
    pointcle: "Une faiblesse honnête vaut mieux qu'une force inventée. Une stratégie tient quand elle utilise une force pour saisir une opportunité, ou pour couvrir une faiblesse face à une menace.",
    questions: [
      "En quoi excellons-nous ? Quelles activités sont efficaces ?",
      "Quelles sont nos principales compétences — et celles de nos allié·e·s ?",
      "Que manque-t-il dans notre groupe ? Quelles ont été les raisons de nos échecs passés ?",
      "Quelles évolutions sont favorables à notre cause ?",
      "Quelles forces peuvent nous empêcher d'agir ? Quels sont les problèmes cachés ?"
    ]
  },
  {
    id: 7, partie: 'juger', phase: 'analyse', atelier: 'pestel',
    titre: 'Analyse PESTEL',
    resume: "Le contexte en six axes.",
    objectif: "Comprendre systématiquement l'environnement dans lequel s'inscrit le plaidoyer, identifier de nouvelles opportunités ou problématiques, construire des scénarios et développer une vision cohérente.",
    methode: [
      "Passer la problématique au filtre des six axes, sans se censurer au premier tour.",
      "Toutes les catégories ne sont pas pertinentes partout : ratisser large d'abord, trier ensuite.",
      "Comme le SWOT, à faire en équipe pour partir d'une représentation commune."
    ],
    pointcle: "Plus on connaît le contexte, plus on trouve la solution adéquate. Sans cette lecture, on ne sait pas où l'on peut agir.",
    questions: [
      "Quels facteurs externes peuvent influencer les causes ou les conséquences du problème ?",
      "Quels groupes de pression peuvent exercer une influence ?",
      "Quelles normes nationales et internationales sont en vigueur ?",
      "Quelles sont les tendances économiques ? Sociales ?"
    ]
  },
  {
    id: 16, complement: true, partie: 'juger', phase: 'analyse', atelier: 'fenetres',
    titre: "Fenêtres d'opportunité",
    resume: "L'agenda politique décide du moment. Autant le connaître.",
    objectif: "Le changement se produit souvent grâce à une opportunité : un basculement de l'opinion, une échéance électorale, un scandale, un vote en commission. Encore faut-il l'avoir vue venir et être prêt·e quand elle s'ouvre.",
    methode: [
      "Recenser les échéances connues : élections, votes, budgets, accords de majorité, rapports attendus, journées internationales, procès.",
      "Trois conditions rendent une fenêtre exploitable : une <strong>bonne définition du problème</strong>, des <strong>propositions faisables</strong>, un <strong>contexte politique</strong> porteur. Quand les trois sont réunies, la probabilité de succès grimpe.",
      "Certaines opportunités sont prévisibles, d'autres non — et certaines se créent par nos propres interventions.",
      "Situer où l'on est dans le cycle politique : l'influence est forte au moment de la formulation, retombe pendant l'analyse, remonte à l'exécution quand les failles apparaissent."
    ],
    pointcle: "Un message excellent envoyé trois semaines après le vote ne vaut rien. Caler le calendrier du plaidoyer sur celui du pouvoir n'est pas de l'opportunisme, c'est la condition de l'écoute.",
    questions: [
      "Quelle décision est en cours ou à venir sur notre sujet ?",
      "Sommes-nous prêts — problème défini, solution formulée — si la fenêtre s'ouvre demain ?",
      "Quel événement pourrions-nous provoquer nous-mêmes ?",
      "Où en est-on dans le cycle : formulation, analyse, exécution ?"
    ],
    source: "Théorie des <em>policy windows</em>, manuel ULB-Coopération."
  },
  {
    id: 8, partie: 'juger', phase: 'strategie', atelier: 'arbre',
    titre: 'Arbre à problème et arbre à objectif',
    resume: "Racines, tronc, branches — puis on positive.",
    objectif: "Analyser les causes profondes d'un problème et en identifier les principales conséquences. Le succès du plaidoyer dépend de la manière dont le problème est posé : on s'attaque aux causes, pas aux manifestations visibles.",
    methode: [
      "<strong>Le tronc</strong> = le problème. <strong>Les racines</strong> = ses causes profondes. <strong>Les branches</strong> = ses conséquences.",
      "Étape 1 : identifier causes et effets. Étape 2 : « positiver » chaque élément — l'arbre à problème devient arbre à objectif, c'est-à-dire des pistes de propositions.",
      "L'approche peut être circulaire : les problèmes sont multidimensionnels, les causes interconnectées, parfois contradictoires. Ce n'est pas un défaut de l'outil."
    ],
    pointcle: "Chaque cause identifiée ici devient un axe stratégique possible. C'est le matériau brut de l'outil 17.",
    questions: [
      "Quelles causes ou conséquences peuvent être regroupées ?",
      "Quelles conséquences sont les plus graves ?",
      "Quelles causes seront plus faciles à traiter ? Plus difficiles ? Pourquoi ?",
      "Que peut faire le gouvernement ? Les institutions internationales ? Les citoyen·ne·s ?"
    ]
  },
  {
    id: 9, partie: 'juger', phase: 'strategie', atelier: 'cinq',
    titre: 'Les 5 pourquoi',
    resume: "Cinq fois « pourquoi » pour atteindre la cause profonde.",
    objectif: "Complément de l'arbre à problème : décortiquer un problème jusqu'à sa cause profonde, celle sur laquelle il est nécessaire d'agir.",
    methode: [
      "Partir du problème et se demander cinq fois de suite « pourquoi est-ce ainsi ? ».",
      "Chaque réponse devient la question suivante.",
      "Le dernier élément de réponse constitue la cause profonde."
    ],
    pointcle: "L'exercice finit souvent sur des catégories très générales — « la faute du capitalisme », « l'héritage colonial ». On ne travaille pas là-dessus directement : il faut redescendre d'un cran vers une cause sur laquelle le collectif a prise.",
    questions: [
      "Sommes-nous descendus jusqu'à une cause structurelle, ou arrêtés à une cause de surface ?",
      "À quel niveau d'action correspond chaque étage de la chaîne ?",
      "Une autre chaîne partant du même problème mènerait-elle ailleurs ?"
    ]
  },
  {
    id: 17, complement: true, partie: 'juger', phase: 'strategie', atelier: 'axes',
    titre: 'Axes stratégiques et priorisation',
    resume: "Une cause, un axe. Puis on n'en garde que deux ou trois.",
    objectif: "Transformer les causes identifiées en axes stratégiques, puis les hiérarchiser. Un axe stratégique égale un plaidoyer : une organisation ne peut en mener plusieurs de front. Deux ou trois au maximum, un seul si les ressources sont limitées.",
    methode: [
      "Pour chaque cause du problème, formuler la solution que l'on pourrait proposer : c'est un axe possible.",
      "Les axes doivent concourir à la même mission, renforcer les valeurs et la crédibilité du groupe, avoir un impact potentiel fort, et être <strong>réalisables</strong>.",
      "Noter chaque axe sur une série de critères, avec pondération : l'outil calcule le classement.",
      "Réalisable n'est pas réaliste. Les décideur·euses diront toujours que la demande n'est pas réaliste — la vraie question est : le collectif a-t-il les moyens de mener l'action ?"
    ],
    pointcle: "Toujours faire le lien avec les valeurs, sinon on dérive, on perd en pertinence et on délégitime le combat.",
    questions: [
      "Cela améliore-t-il réellement la vie des personnes concernées ?",
      "Est-il possible de gagner ?",
      "Une décision politique est-elle en cours sur ce sujet ?",
      "Les personnes concernées peuvent-elles s'impliquer dans cette action ?",
      "Avons-nous les ressources et la légitimité pour porter cet axe ?"
    ],
    source: "D'après Pathfinder International, « Déterminer les priorités du plaidoyer » (2014), via ULB-Coopération."
  },

  /* ---------------------------------------------------------- AGIR */
  {
    id: 10, partie: 'agir', phase: 'oeuvre', atelier: 'rapport',
    titre: 'Avec, sans et contre le pouvoir',
    resume: "Trois rapports au pouvoir, complémentaires.",
    objectif: "Situer ses actions dans une dynamique <em>avec</em>, <em>contre</em> ou <em>sans</em> le pouvoir. Le plaidoyer s'inscrit dans la stratégie « avec » — les autres lui sont complémentaires.",
    methode: [
      "<strong>Agir avec</strong> — le pouvoir est perçu comme un allié : dialogue, négociation, co-construction dans un rapport de force équilibré. <em>Ex. : une rencontre de plaidoyer.</em>",
      "<strong>Agir contre</strong> — participation non conventionnelle : le changement naît du conflit. <em>Ex. : des agriculteurs qui versent du lait dans la rue.</em>",
      "<strong>Agir sans</strong> — création d'un espace d'autonomie, alternatives citoyennes. <em>Ex. : héberger des personnes migrantes.</em>"
    ],
    pointcle: "Ces leviers ne s'excluent pas, ils se renforcent. Beaucoup de collectifs en pratiquent plusieurs sans l'avoir décidé — nommer ce qu'on fait permet de le doser.",
    questions: [
      "Quel est notre rapport dominant au pouvoir, aujourd'hui ?",
      "Est-il choisi ou subi ?",
      "Quelle action d'un autre registre renforcerait notre plaidoyer ?"
    ],
    source: "D'après Quinoa, « Potentia. La puissance de l'agir collectif », 2016."
  },
  {
    id: 18, complement: true, partie: 'agir', phase: 'strategie', atelier: 'strategie',
    titre: 'Choix de la stratégie',
    resume: "Du rôle de conseiller à l'activisme : où se placer, et pourquoi.",
    objectif: "Choisir une posture stratégique cohérente avec sa théorie du changement, et enchaîner les registres en connaissance de cause.",
    methode: [
      "Les stratégies se positionnent sur deux axes : de la <strong>coopération</strong> à la <strong>confrontation</strong>, et du <strong>formel</strong> à l'<strong>informel</strong>. Quatre grandes zones en découlent : rôle de conseiller, plaidoyer formel, lobby, activisme.",
      "Aucune n'est supérieure : trois ONG peuvent viser la même vision avec des stratégies opposées, et se renforcer sans le vouloir.",
      "Les stratégies s'enchaînent : action A ; si la cible accepte de nous recevoir, action B ; si elle refuse, action C.",
      "Sur un plaidoyer long, on peut commencer par l'opposition pour être entendu·e, puis passer à la coopération une fois l'écoute obtenue — l'inverse est beaucoup plus difficile."
    ],
    pointcle: "Sur la déforestation : Greenpeace attaque une marque emblématique et ne propose pas de solution ; TFT vend son expertise à l'entreprise visée ; FERN fournit des propositions de réforme à la Commission. Même vision, trois métiers. Choisir le sien, c'est aussi accepter ce qu'il interdit.",
    questions: [
      "Notre stratégie découle-t-elle de notre théorie du changement, ou de nos habitudes ?",
      "Ce registre est-il compatible avec la relation que nous voulons garder avec la cible ?",
      "Quelle action de repli si celle-ci échoue ?",
      "Quelle stratégie nos allié·e·s occupent-ils déjà ?"
    ],
    source: "Manuel ULB-Coopération, chapitre « Choix de la stratégie »."
  },
  {
    id: 11, partie: 'agir', phase: 'oeuvre', atelier: 'smart',
    titre: 'Objectifs SMART',
    resume: "Spécifique, mesurable, atteignable, réaliste, temporel.",
    objectif: "La vision se décline en objectif général puis en sous-objectifs. L'axe stratégique est de long terme ; les objectifs sont de court terme et se formulent précisément.",
    methode: [
      "<strong>S</strong>pécifique — porte sur un élément précis, délimité géographiquement par exemple.",
      "<strong>M</strong>esurable — quantifiable, ou suivi par des indicateurs de résultat pour le qualitatif.",
      "<strong>A</strong>tteignable — ambitieux mais réaliste, tenant compte de vos capacités et de vos valeurs.",
      "<strong>R</strong>éaliste — réalisable avec les moyens disponibles (temps, personnes).",
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
    id: 12, partie: 'agir', phase: 'oeuvre', atelier: 'cibles',
    titre: 'Cibles et alliances',
    resume: "Viser les indécis·es, choisir ses allié·e·s.",
    objectif: "Identifier les personnes qui peuvent opérer le changement, puis celles qui peuvent nous aider à les atteindre.",
    methode: [
      "Les <strong>indécis·es</strong> sont les cibles les plus intéressantes : c'est sur elles que nous avons prise, et les convaincre peut faire basculer l'issue.",
      "Anticiper ce que la cible <em>gagne</em> ou <em>perd</em> en se ralliant : c'est la matière de l'argumentaire.",
      "Cibles de 1<sup>er</sup> niveau : celles qui décident. De 2<sup>e</sup> niveau : celles par qui il faut passer pour les influencer.",
      "Les allié·e·s s'identifient par une analyse des avantages et des risques de la collaboration."
    ],
    pointcle: "Les allié·e·s ne partagent pas forcément toutes nos valeurs. Au Botswana, des organisations LGBT se sont alliées à des pasteurs évangélistes contre les violences homophobes : désaccord total sur le mariage, accord sur les poursuites judiciaires. C'est sur ce point-là qu'on s'allie.",
    questions: [
      "Qui a le pouvoir d'opérer le changement visé ? Par qui faut-il passer ?",
      "Que gagne cette personne à nous suivre ? Que risque-t-elle ?",
      "Quel allié apporte ce qui nous manque — expertise, réseau, nombre, argent ?",
      "Quels risques la collaboration fait-elle courir à notre message ?"
    ],
    exemple: "Plaidoyer communal pour des pistes cyclables. Cibles : l'échevin·e de la mobilité (niveau 1), les cyclistes de la commune (niveau 2). Allié·e·s : un collectif d'habitant·e·s, le GRACQ."
  },
  {
    id: 19, complement: true, partie: 'agir', phase: 'oeuvre', atelier: 'ciblage',
    titre: 'Fiche de ciblage',
    resume: "Tout savoir d'une cible avant de la rencontrer.",
    objectif: "Connaissance des objectifs d'une cible + compréhension de ses codes de communication = capacité d'influence. Cette fiche se remplit pour chaque cible prioritaire et se partage avec l'équipe et les partenaires.",
    methode: [
      "Une fiche par cible, aussi complète que possible : objectifs généraux, intérêt pour le problème, niveau de soutien, influence, niveau de connaissance du sujet.",
      "<strong>Action souhaitée</strong> — qu'attend-on précisément d'elle ? C'est ce qui servira au suivi.",
      "<strong>Niveau d'accès</strong> — est-elle joignable ? Sinon, par quelle voie ?",
      "<strong>Détonateur</strong> — à quel type d'argument est-elle réceptive ?",
      "<strong>Langage et canaux</strong> — comment s'exprime-t-elle, par où la contacter ?",
      "<strong>À qui rend-elle des comptes</strong> — la pression utile passe souvent par là."
    ],
    pointcle: "Personnalisez au maximum. « Le ministère de la Santé » n'est pas une cible : qui, dans quel département, est responsable de ce dossier ? LinkedIn est utile pour reconstituer un parcours et deviner un positionnement. Ayez plusieurs contacts dans l'institution — le jour où la personne change, tout est à refaire.",
    questions: [
      "Quel argument fait mouche sur cette personne précisément ?",
      "Parle-t-elle chiffres, droit, terrain, fiscalité ?",
      "Qui, dans notre réseau, a déjà un lien avec elle ?",
      "Qu'a-t-elle dit ou fait publiquement sur ce sujet ?"
    ],
    source: "Outil de ciblage, manuel ULB-Coopération."
  },
  {
    id: 20, complement: true, partie: 'agir', phase: 'oeuvre', atelier: 'reseau',
    titre: 'Alliances et réseau',
    resume: "Construire une coalition, et l'empêcher de s'essouffler.",
    objectif: "Rassembler des forces complémentaires et faire vivre l'alliance dans la durée — c'est là que la plupart échouent, par manque de temps et d'énergie.",
    methode: [
      "<strong>Allié·e·s principaux</strong> : valeurs communes, alliance formelle, long terme. <strong>Secondaires</strong> : accord sur la cause, soutien ponctuel, appui spécifique.",
      "<strong>Réseaux</strong> (espaces libres, partage d'information) → <strong>alliances</strong> (question commune, temporaires) → <strong>coalitions</strong> (structurées, ressources mises en commun).",
      "À la création : sélectionner des acteurs capables de peser sur des cibles différentes, obtenir l'engagement dès le début, aller au-delà des partenaires traditionnels, être clair sur les critères d'adhésion, prévoir un point de contact par organisation, former un comité directeur.",
      "En fonctionnement : vision et mission communes, planification partagée, messages définis ensemble, répartition entre actions communes et actions propres."
    ],
    pointcle: "Prévoyez un statut pour les organisations qui veulent être informées sans être membres : elles n'ont ni le temps ni les moyens, mais leur soutien compte le jour venu.",
    questions: [
      "Nos allié·e·s pèsent-ils sur les mêmes cibles que nous, ou sur d'autres ?",
      "Qui est le point de contact chez chacun ?",
      "Qu'est-ce qui fait tenir l'alliance quand l'actualité retombe ?",
      "Quels sont les critères pour entrer — et pour sortir ?"
    ],
    source: "Manuel ULB-Coopération, « Mobiliser et former des alliances »."
  },
  {
    id: 13, partie: 'agir', phase: 'messages', atelier: 'message',
    titre: 'Construire un message',
    resume: "Accroche, problème, importance, cible, action demandée.",
    objectif: "Pour avoir un impact, le message doit être clair, simple et adapté à l'interlocuteur·trice. Il décrit le changement visé et présente concrètement ce que vous voulez obtenir.",
    methode: [
      "<strong>Une accroche</strong> — donner envie d'écouter. Le plus petit dénominateur commun : « chaque seconde… », « le prix d'un café… », une statistique proche des gens.",
      "<strong>Un problème</strong> — expliqué simplement.",
      "<strong>Pourquoi c'est important</strong> — pour la cible, et pourquoi maintenant.",
      "<strong>La cible</strong> — à qui on parle.",
      "<strong>L'action demandée</strong> — sans demande d'action, on fait de la sensibilisation, pas du plaidoyer.",
      "Préparer plusieurs messages en réserve : sur une affiche c'est l'accroche qui compte, en rencontre c'est le « pourquoi maintenant »."
    ],
    pointcle: "Le moment de diffusion compte autant que le contenu : caler le message sur l'agenda politique ou un événement externe.",
    questions: [
      "Un enfant de douze ans comprendrait-il notre accroche ?",
      "Avons-nous formulé une demande précise, adressée à quelqu'un ?",
      "Le message tient-il sans jargon ni acronyme ?"
    ],
    exemple: "720 millions de GSM sont jetés chaque année. Les minerais qu'ils contiennent viennent de l'Est du Congo, région riche en ressources et traversée par des conflits liés à ces mêmes ressources. Responsables politiques et citoyen·ne·s : mettons en place des mesures pour un approvisionnement responsable."
  },
  {
    id: 21, complement: true, partie: 'agir', phase: 'messages', atelier: 'medias',
    titre: 'Médias et interview',
    resume: "Choisir ses supports, pitcher en 30 secondes, tenir face aux stéréotypes.",
    objectif: "Le plaidoyer médiatique met l'enjeu sur l'agenda politique, le rend crédible, trouve des allié·e·s et touche les décideur·euses — les cabinets font tous de la veille média.",
    methode: [
      "Avant de solliciter un média : qui l'écoute ? qui le finance ? quelles opinions ? quelle position passée sur notre sujet ? notre message risque-t-il d'être déformé ?",
      "Dresser une liste de journalistes ayant déjà couvert le sujet, la hiérarchiser selon ce que lit <em>notre cible</em>, et établir la relation avant d'avoir besoin de quelque chose.",
      "Ce qui accroche un·e journaliste : controverse, injustice à grande échelle, faits inhabituels, témoins qui racontent eux-mêmes, images fortes, porte-parole reconnu·e.",
      "En interview : préparer deux messages prioritaires et les répéter ; savoir dire « cette information doit être vérifiée » ; ne jamais s'énerver ; ne pas dévier ; pas de jargon."
    ],
    pointcle: "La technique du pont. Si la question véhicule un stéréotype, ne le répétez pas, même pour le nier — « non, les migrants n'apportent pas de maladies » réassocie les deux mots. Prenez un mot neutre de la question et repartez ailleurs : « ce que les migrants apportent, ce sont des compétences que nous pourrions valoriser ».",
    questions: [
      "Que lit, écoute ou regarde notre cible ?",
      "Quels sont nos deux messages prioritaires — ceux qu'on répétera quoi qu'il arrive ?",
      "Quelle est l'information nouvelle qui justifie qu'on en parle maintenant ?",
      "Qui témoigne, et l'avons-nous préparé·e ?"
    ],
    source: "Manuel ULB-Coopération, « S'adresser aux médias »."
  },
  {
    id: 22, complement: true, partie: 'agir', phase: 'oeuvre', atelier: 'mobilisation',
    titre: 'Mobilisation et pétition',
    resume: "La force de la société civile, c'est le nombre. Encore faut-il l'organiser.",
    objectif: "La mobilisation légitime le combat, fait pression sur les décideur·euses, récolte des fonds et encourage le bénévolat. Le plaidoyer doit répondre aux besoins de la communauté pour laquelle il existe — associer directement les personnes concernées le renforce.",
    methode: [
      "Outils : l'événement (atelier, réunion) pour maintenir le lien ; la planification participative ; les pétitions ; les manifestations ; la participation aux réunions publiques et l'accompagnement lors des rencontres avec les décideur·euses.",
      "Une pétition en ligne, c'est quatre étapes : trouver un cas fort → rédiger → diffuser → remettre les signatures au décideur.",
      "Le titre doit être court, clair, attractif ; le message positif et axé sur la solution ; l'urgence visible ; le décideur nommé et atteignable ; le problème et la solution expliqués.",
      "La pétition crée une base de contacts pour d'autres actions — demandez le consentement (RGPD)."
    ],
    pointcle: "Sur change.org, sur 25 000 pétitions, une soixantaine dépassent 15 000 signatures. Une pétition ne s'improvise pas : c'est la campagne autour qui la fait vivre. Et méfiez-vous de l'astroturfing, ces mobilisations « spontanées » organisées depuis des mois.",
    questions: [
      "Les personnes concernées sont-elles associées, ou seulement représentées ?",
      "Notre cible est-elle atteignable et nommée ?",
      "Qu'est-ce qui donne envie de signer maintenant plutôt que demain ?",
      "Que faisons-nous des signatures une fois remises ?"
    ],
    source: "Manuel ULB-Coopération, « Mobiliser et former des alliances »."
  },
  {
    id: 14, partie: 'agir', phase: 'oeuvre', atelier: 'rencontre',
    titre: 'Check-list de la rencontre',
    resume: "Avant, pendant, après l'interpellation.",
    objectif: "Porter le message auprès des responsables politiques, à distance ou en présentiel. La préparation augmente nettement les chances d'être entendu·e.",
    methode: [
      "<strong>Avant</strong> — se familiariser avec les sphères du pouvoir ; attirer l'attention (lettres, pétition, événement) ; bâtir des relations de confiance ; choisir ses représentant·e·s selon la cible et les profils ; préparer la rencontre en groupe.",
      "<strong>Pendant</strong> — remercier, présenter le groupe, exposer problème / solutions / demandes, faire le lien avec ce que la personne a déjà dit ou fait, obtenir un engagement, laisser des documents écrits.",
      "<strong>Après</strong> — compte-rendu, points de suivi et prochaine échéance, évaluation et retour à l'équipe."
    ],
    pointcle: "Approchez les décideur·euses <em>avant</em> d'avoir quelque chose à leur demander : il est bien plus facile de demander ensuite. Et ne dévoilez pas toutes vos stratégies pour les atteindre.",
    questions: [
      "Qui dit quoi, dans quel ordre ?",
      "Quelle est la seule chose que nous voulons obtenir en sortant ?",
      "Qu'est-ce qu'on laisse par écrit ?",
      "Quelle est la prochaine échéance proposée ?"
    ],
    source: "D'après la formation plaidoyer CAP! (juin 2019)."
  },
  {
    id: 15, partie: 'agir', phase: 'suivi', atelier: 'suivi',
    titre: 'Suivi et évaluation',
    resume: "Journal de bord, indicateurs, évolution des cibles.",
    objectif: "Le suivi récolte en continu l'information qui permet d'adapter la stratégie. L'évaluation juge le travail mené : points positifs, négatifs, pistes d'amélioration.",
    methode: [
      "Tenir un <strong>journal de bord</strong> : objectifs, actions, résultats, personnes impliquées.",
      "Suivre à la fois les <strong>actions entreprises</strong> et l'<strong>évolution du positionnement des cibles</strong>.",
      "Découper chaque objectif en indicateurs, puis en étapes les plus petites possibles.",
      "Trois niveaux d'engagement chez une cible : <strong>conscientisation</strong> (elle est informée), <strong>volonté</strong> (elle contribue au débat), <strong>action</strong> (elle décide).",
      "Ré-évaluer le contexte en permanence : une élection ou un fait d'actualité peut tout changer."
    ],
    pointcle: "En plaidoyer, on ne démontre pas que le résultat est le nôtre : on démontre qu'on y a <em>contribué</em>. Les calendriers dépendent de l'agenda politique — d'où l'importance des petites victoires pour tenir la motivation, et d'un plan B permanent.",
    questions: [
      "L'approche fonctionne-t-elle ?",
      "Le message est-il adressé aux bonnes personnes, par le bon canal ?",
      "Nos allié·e·s sont-ils/elles les bonnes personnes ? Et nos cibles ?",
      "Ce changement est-il porteur de sens ? Sera-t-il durable ?",
      "Partenaires et cibles ont-ils respecté leurs engagements ?"
    ]
  }
];

/* Ordre d'affichage : progression pédagogique, compléments intercalés */
export const ORDRE = [1, 2, 3, 4, 5, 6, 7, 16, 8, 9, 17, 10, 18, 11, 12, 19, 20, 13, 21, 22, 14, 15];

/* ------------------------------------------------------ référentiels */

export const QUIZ = [
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
        "Vous rassemblez toutes les informations et préparez des fiches de données précises"] },
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
        "Faire connaître l'événement, inviter les journalistes, prévoir les interviews",
        "Formuler le programme et trouver les intervenant·e·s pertinent·e·s"] },
  { q: "Vous vous décririez plutôt comme une personne…",
    r: ["Consciencieuse et réaliste", "Ouverte et diplomate", "Observatrice et créative"] }
];

export const PROFILS = {
  a: { cle: 'a', nom: 'Planificateur·trice',
       txt: "Vous aimez prévoir. L'organisation est votre point fort et vous analysez rapidement une situation. Rigoureux·se, vous vous préparez à toute éventualité et tenez la liste détaillée des tâches.",
       role: "Tient le calendrier, la logistique des rencontres, le suivi des engagements." },
  b: { cle: 'b', nom: 'Communicant·e',
       txt: "La communication n'a pas de secret pour vous. Sociable, vous faites le premier pas pour comprendre votre interlocuteur·trice et diffusez les informations nécessaires au projet.",
       role: "Porte le message, tient les relations presse, anime le réseau d'allié·e·s." },
  c: { cle: 'c', nom: 'Chercheur·euse',
       txt: "Votre sens de l'observation fait de vous un·e chercheur·euse hors pair. Vous vous appropriez une thématique et l'approfondissez en posant les bonnes questions.",
       role: "Construit l'expertise, documente les arguments, prépare les fiches techniques." }
};

export const PETALES = ['Genre', 'Origine', 'Classe sociale', 'Religion', "Niveau d'étude", 'Âge'];

export const POUVOIRS = ['politique', 'législatif', 'juridique', 'religieux', 'coutumier', 'scientifique',
  'économique', 'familial', 'culturel', 'médiatique', 'citoyen'];

export const NIVEAUX_POUVOIR = ['communal', 'provincial', 'régional', 'communautaire', 'fédéral', 'européen', 'international'];

export const POSITIONS = [
  { cle: 'allie', nom: 'Allié·e' },
  { cle: 'indecis', nom: 'Indécis·e' },
  { cle: 'adversaire', nom: 'Adversaire' }
];

export const PESTEL_AXES = [
  { cle: 'P', nom: 'Politique', aide: "Majorités, agenda, groupes de pression." },
  { cle: 'E', nom: 'Économique', aide: "Conjoncture, financements, intérêts en jeu." },
  { cle: 'S', nom: 'Social', aide: "Opinion, démographie, mouvements, culture." },
  { cle: 'T', nom: 'Technique', aide: "Technologies, innovations, moyens disponibles." },
  { cle: 'V', nom: 'Environnement / santé', aide: "Enjeux écologiques et sanitaires." },
  { cle: 'L', nom: 'Légal', aide: "Normes, jurisprudence, réglementation." }
];

export const CHECKLIST = {
  avant: [
    "Veille sur l'agenda politique : quelle fenêtre d'opportunité ?",
    "Cible identifiée et vérifiée (mandat, compétence réelle sur le sujet)",
    "Attention attirée en amont (lettre, pétition, événement, soutien public)",
    "Demande officielle d'être reçu·e envoyée",
    "Représentant·e·s choisi·e·s selon la cible et les profils du groupe",
    "Répartition des prises de parole décidée",
    "Documents à laisser préparés (fiche d'information, note de position)",
    "Aspects pratiques calés : lieu, heure, durée, qui prend note",
    "Réponses préparées aux objections attendues, et chronométrées"
  ],
  pendant: [
    "Remercier de l'accueil, établir le lien",
    "Présenter le groupe et sa légitimité",
    "Exposer le problème, les solutions, les demandes d'action",
    "Faire le lien avec ce que la personne a déjà dit ou fait",
    "Écouter attentivement les résistances, poser des questions",
    "Rester clair et bref, sans jargon, sans accuser",
    "Tenter d'obtenir un engagement concret",
    "Remettre les documents écrits"
  ],
  apres: [
    "Compte-rendu rédigé",
    "Points de suivi transmis (prochaines étapes, échéance)",
    "Évaluation faite avec le groupe",
    "Retour à l'équipe et aux allié·e·s",
    "Positionnement de la cible mis à jour dans la cartographie"
  ]
};

/* Outil 17 — critères de priorisation, regroupés et pondérables */
export const CRITERES = [
  { cle: 'impact', nom: 'Impact réel', aide: "Amélioration concrète dans la vie des personnes concernées, y compris les plus vulnérables." },
  { cle: 'racine', nom: 'Traite les causes', aide: "Règle un problème sous-jacent plutôt qu'un symptôme." },
  { cle: 'ampleur', nom: 'Ampleur et intensité', aide: "Touche beaucoup de monde, et le problème est ressenti profondément." },
  { cle: 'gagnable', nom: 'Possible de gagner', aide: "Des décideur·euses peuvent manifestement faire bouger les choses." },
  { cle: 'moment', nom: 'Bon moment', aide: "Une décision politique est en cours ou à venir sur ce sujet." },
  { cle: 'lisible', nom: 'Facile à expliquer', aide: "On peut faire comprendre l'enjeu simplement." },
  { cle: 'ressources', nom: 'Ressources disponibles', aide: "Le groupe a le temps, les moyens et la compétence." },
  { cle: 'coherence', nom: 'Cohérence et légitimité', aide: "Correspond à notre mission, nos valeurs, nos partenariats et notre stratégie longue." },
  { cle: 'participation', nom: 'Participation possible', aide: "Les personnes concernées peuvent s'impliquer dans l'action." }
];

/* Outil 18 — panel des stratégies */
export const STRATEGIES = [
  { nom: "Recherche et expertise", txt: "Mobiliser la recherche, se construire une expertise pour appuyer ses arguments.", x: 20, y: 20 },
  { nom: "Droit et médiatisation juridique", txt: "Soutenir un dépôt de plainte, médiatiser un procès — avec le consentement des personnes concernées.", x: 78, y: 32 },
  { nom: "Communication participative", txt: "Faire parler les personnes concernées elles-mêmes, témoignages à l'appui.", x: 52, y: 74 },
  { nom: "Opposition, désigner un adversaire", txt: "Le sommet de l'iceberg : viser une entreprise ou un cas qui symbolise le problème.", x: 92, y: 62 },
  { nom: "Appel au boycott", txt: "Efficace à grande échelle sur des entreprises privées : on joue sur l'enjeu économique.", x: 90, y: 84 },
  { nom: "Campagne d'affichage", txt: "Occuper l'espace public et aller chercher des soutiens hors de sa base habituelle.", x: 62, y: 80 },
  { nom: "Négociation", txt: "Fonctionne si la cible est atteignable et qu'on a quelque chose à lui proposer.", x: 14, y: 42 },
  { nom: "Programme pilote", txt: "Montrer l'exemple — coûteux, et risque de prendre la place du décideur.", x: 22, y: 62 },
  { nom: "Pétition", txt: "Beaucoup de pétitions, peu de réussites, mais un outil légal qui oblige parfois à se prononcer.", x: 66, y: 46 },
  { nom: "Rencontres et lobbying", txt: "Moments formels et informels avec la cible. Gourmand en ressources humaines.", x: 26, y: 88 },
  { nom: "Alliances", txt: "Mise en commun structurée, sur le modèle des initiatives citoyennes européennes.", x: 44, y: 36 },
  { nom: "Porte-voix", txt: "Une personnalité connue s'exprime pour la cause.", x: 58, y: 60 },
  { nom: "Mobilisation de rue", txt: "Manifestations, actions symboliques, occupation.", x: 88, y: 90 }
];

export const THEORIES = [
  { nom: "Large leaps", txt: "Le changement arrive par sauts brusques, quand un thème est traité autrement, reçoit plus d'attention ou que de nouveaux acteurs arrivent au pouvoir. Les médias y jouent un rôle central." },
  { nom: "Théorie des coalitions", txt: "Très présente en Belgique : le changement résulte de l'action collective d'individus partageant les mêmes analyses. Les convictions des décideur·euses ne bougent que sous pression de conditions externes." },
  { nom: "Fenêtres d'opportunité", txt: "Le changement passe par une opportunité. Trois conditions : problème bien défini, solutions faisables, contexte politique favorable." },
  { nom: "Élites du pouvoir (Mills)", txt: "Un groupe restreint détient le pouvoir de changer la politique. Une bonne cartographie permet d'identifier et d'atteindre les bonnes personnes." },
  { nom: "Community organizing", txt: "Le changement advient quand les personnes concernées se mobilisent elles-mêmes pour leurs droits. Il faut d'abord les renforcer." },
  { nom: "Processus linéaire", txt: "Les politiques se construiraient rationnellement sur base des connaissances scientifiques. L'influence est forte à la formulation, faible pendant l'analyse, et remonte à l'exécution." }
];

export const TYPO_ALLIES = [
  { cle: 'principal', nom: 'Allié·e principal·e', txt: "Valeurs communes, alliance formelle, long terme." },
  { cle: 'secondaire', nom: 'Allié·e secondaire', txt: "Accord sur la cause, soutien ponctuel, appui spécifique." },
  { cle: 'reseau', nom: 'Réseau', txt: "Espace libre, partage d'information." },
  { cle: 'alliance', nom: 'Alliance', txt: "Question commune, temporaire." },
  { cle: 'coalition', nom: 'Coalition', txt: "Structurée, ressources mises en commun." },
  { cle: 'informe', nom: 'Tenu·e informé·e', txt: "Pas membre, mais gardé·e dans la boucle." }
];

export const VIE_ALLIANCE = {
  creation: [
    "Des acteurs capables de peser sur des cibles différentes",
    "Un engagement obtenu dès le départ",
    "Des partenaires au-delà du cercle habituel",
    "Des critères d'adhésion explicites",
    "Un point de contact identifié par organisation",
    "Un système de communication clair",
    "Un comité directeur constitué"
  ],
  vie: [
    "Vision et mission communes formulées",
    "Planification d'activités partagée (même minimale)",
    "Messages définis ensemble",
    "Répartition claire entre actions communes et actions propres",
    "Plans d'action partagés au-delà de la coalition"
  ]
};

export const MEDIA_QUESTIONS = [
  "Qui est à l'écoute de ce média ?",
  "Quelles sont ses orientations politiques ?",
  "Qui le finance ?",
  "Quelle position a-t-il tenue par le passé sur notre sujet ?",
  "Comment accède-t-on à ce support ?",
  "Notre message risque-t-il d'être déformé ?",
  "Sous quelle forme peut-il nous couvrir ?"
];

export const ACCROCHES_MEDIA = [
  "Controverse, conflit ou scandale",
  "Injustice à grande échelle",
  "Intérêt commun d'un grand nombre",
  "Faits mystérieux ou inhabituels",
  "Porte-parole reconnu·e",
  "Témoin qui raconte lui-même son histoire",
  "Images extraordinaires"
];

export const INTERVIEW = [
  "Deux messages prioritaires identifiés — et répétés",
  "Faits et exemples concrets préparés",
  "Images mentales plutôt que concepts",
  "« Cette information doit être vérifiée » plutôt que « je ne sais pas »",
  "Ponts préparés pour les questions à stéréotype",
  "Ne jamais s'énerver, ne pas dévier, pas de jargon",
  "Trois quarts de seconde avant chaque réponse"
];

export const PETITION_CRITERES = [
  "Titre court, clair et attractif",
  "Message positif, axé sur la solution",
  "Urgence mise en avant",
  "Décideur·euse nommé·e et atteignable",
  "Problème expliqué, solution expliquée",
  "Connexion émotionnelle : en quoi on se sent concerné·e",
  "Consentement demandé pour recontacter (RGPD)"
];

export const MOBILISATION_OUTILS = [
  { nom: "L'événement", txt: "Atelier, réunion : maintenir un lien constant avec la base." },
  { nom: "La planification participative", txt: "Associer membres et bénévoles à la préparation des actions." },
  { nom: "La pétition", txt: "Faire signer un texte au groupe le plus large possible." },
  { nom: "La manifestation", txt: "Demander un investissement physique et public." },
  { nom: "Les réunions publiques", txt: "Faire venir des citoyen·ne·s témoigner, y compris en rencontre de lobbying." }
];

export const NIVEAUX_ENGAGEMENT = [
  { cle: 'aucun', nom: 'Pas touchée' },
  { cle: 'conscience', nom: 'Conscientisation' },
  { cle: 'volonte', nom: 'Volonté' },
  { cle: 'action', nom: 'Action' }
];
