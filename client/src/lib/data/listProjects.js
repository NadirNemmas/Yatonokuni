import GMAIntro from "../../../../docs/images/gamemaster/GMA-Introduction.png";
import YatoKuniIntro from "../../../../docs/images/yatonokuni-project/yatonokuni-project-intro.png";

export const projects = [
  {
    id: 1,
    title: "Yatonokuni",
    route: "/",
    description:
      "Une application web créé afin d'approfondir mes compétences en développement full-stack, apprendre React.js, Vite.js, et Supabase. " +
      "\nL'application permet aux utilisateurs de créer un compte, se connecter." +
      "\nLe but principal est de montrer mes projets personnels et compétences en développement web. " +
      "\nL'application à des fonctionnalités cachées accessibles uniquement aux utilisateurs connectés. Ces fonctionnalités sont principalement prévues pour moi-même.",
    image: YatoKuniIntro,
    techs: ["React.js", "Node.js", "Express", "SupabaseSQL"],
  },
  {
    id: 2,
    title: "GameMasterArtefact",
    route: "/projects/gamemasterartefact",
    description:
      "Ce projet est un bot Discord pour gérer des personnages de jeu de rôle : comptes, sessions (ID Discord), " +
      "fiches de personnages, jets de compétences et commandes d'administration. Stockage simple via fichiers JSON, mot de passe hashé (bcrypt) et commandes slash pour consulter/metre à jour les fiches.",
    image: GMAIntro,
    techs: ["JavaScript", "Discord.js", "bcrypt", "JSON", "Node.js"],
  },
];
