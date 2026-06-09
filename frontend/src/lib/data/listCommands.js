export const commandsList = [
  {
    id: 1,
    commandName: "/login",
    description: "Permet à un utilisateur de se connecter à son compte.",
    required_fields: true,
    fields_required: [
      {
        username:
          "nom d'utilisateur (est généralement le même que le nom de personnage)",
      },
    ],
    optional_fields: "",
  },
  {
    id: 2,
    commandName: "/register",
    description:
      "Permet de créer un nouveau compte utilisateur, un personnage et sa fiche.",
    required_fields: false,
    fields_required: "",
    optional_fields: "",
  },
  {
    id: 3,
    commandName: "/logout",
    description: "Déconnecte l'utilisateur actuel.",
    required_fields: false,
    fields_required: "",
    optional_fields: "",
  },
  {
    id: 4,
    commandName: "/update",
    description: "Met à jour une statistique ou une information du personnage.",
    required_fields: true,
    fields_required: [
      {
        champ: "Nom du champ (ex: corps ou corps-combat à distance)",
        valeur: "Nouvelle valeur à attribuer au champ (ex: 12)",
      },
    ],
    optional_fields: "",
  },
  {
    id: 5,
    commandName: "/sheet",
    description: "Affiche la fiche de personnage de l'utilisateur.",
    required_fields: false,
    fields_required: "",
    optional_fields: [
      {
        stat: "nom de la statistique",
        stats:
          "nom des statistiques d'un personnage (force, dexterité, intelligence, etc.) séparées par des virgules",
        user: "nom du personnage d'un utilisateur (commande accéssible seulement pour le maitre de jeu)",
        query:
          " nom du perssone suivi d'une statistique spécifique. Ex: nom_utilisateur:stat",
      },
    ],
  },
  {
    id: 6,
    commandName: "/roll",
    description:
      "Fait un jet de compétence ou de caractéristique ou lance un dé à X faces.",
    required_fields: true,
    fields_required: [
      {
        x: "Jet libre, nombre de faces du dé (ex: 6, 20, 100...)",
        d: "Nombre de faces du dé (ex: 6, 20, 100...)",
        competence:
          "Nom de la compétence ou de la caractéristique à tester (ex: force, dexterité, intelligence, etc.)",
        mod: "Bonus ou malus à appliquer (ex: -3 ou +2)",
      },
    ],
    optional_fields: "",
  },
  {
    id: 7,
    commandName: "/clear",
    description:
      "Efface tout les messages des utilisateurs dans le canal. (Cette commande est réservée au maitre de jeu)",
    required_fields: false,
    fields_required: "",
    optional_fields: "",
  },
];
