# [`Yato no Kuni`](https://yatonokuni.onrender.com)

Site utilitaire personnel regroupant plusieurs outils et projets, construit avec **React + Vite** (frontend) et **Node.js / Express** (backend), avec **Supabase** comme base de données et service d'authentification.

---

## Fonctionnalités

### Général
- Authentification complète (inscription / connexion / déconnexion) via JWT stocké en cookie HttpOnly
- Cache `sessionStorage` pour éviter un rechargement blanc au reload
- Interface multilingue : **Français, English, Español, 日本語, 한국어**
- Navbar responsive avec menu drawer mobile, sélecteur de langue, et menu utilisateur
- Backgrounds dynamiques par route
- Routes protégées (`ProtectedRoute`) et routes conditionnelles par jeu (`GameRoute`)

### Pages
- **Accueil** — présentation du site (À propos, Fonctionnalités, Contact)
- **Projets** — liste des projets personnels (titre, description, images, technologies, lien Git)
- **GameMasterArtefact** — documentation du bot Discord (slider d'images, liste de commandes)
- **Profil** — édition des informations personnelles (nom, username, date de naissance, avatar)
- **Lost Ark Tracker** — outil de suivi des dailies/weeklies Lost Ark (voir ci-dessous)

### Lost Ark Tracker
- Gestion de plusieurs accounts par région
- Ajout / modification / suppression de personnages (nom, niveau, ilvl, CP actuel, CP objectif, barre de progression)
- Sélection des **Main 6** (1 à 6 personnages principaux)
- Tableau de dailies/weeklies avec algorithme automatique :
  - Raids fixes (Guardian, Kurzan Front, Hell ×3) : toujours affichés et activés
  - Timeglass : affiché en permanence, activé si `ilvl ≥ 1730`
  - Autres raids hebdo : top-3 par personnage selon l'ilvl (raids les plus proches du niveau du personnage)
  - Colonnes affichées = union de tous les top-3 sans répétition
- Tri par CP ou ilvl (mutuellement exclusifs), filtre Main 6
- Ordre par défaut : Main 6 en tête, autres personnages en dessous
- Moyenne CP calculée sur les Main 6 (ou sur tous si aucun Main 6 défini)

---

## Stack technique

| Couche | Technologies |
|---|---|
| Frontend | React 18, Vite, React Router, react-i18next, Bootstrap, SCSS |
| Backend | Node.js, Express, jsonwebtoken, cookie-parser |
| Base de données | Supabase (PostgreSQL) |
| Auth | Supabase Auth + JWT HttpOnly cookie |
| Doc API | Swagger UI (`swagger-jsdoc` + `swagger-ui-express`) |
| Déploiement | Render (backend + frontend servi en statique) |

---

## Structure du dépôt

```
Yatonokuni/
├── frontend/                  # Application React/Vite
│   ├── src/
│   │   ├── components/        # Composants réutilisables
│   │   │   ├── Lostark/       # Table, formulaires, modals Lost Ark
│   │   │   ├── NavBar/
│   │   │   ├── Layout/
│   │   │   └── ...
│   │   ├── context/           # AuthContext, ProtectedRoute, GameRoute
│   │   ├── data/              # JSON statiques (raids, régions)
│   │   ├── i18n/locales/      # Traductions (fr, en, es, jp, ko)
│   │   ├── lib/               # Helpers (lostark.js, routeBackgrounds.js)
│   │   ├── pages/             # Pages React
│   │   └── styles/            # global.scss
│   └── vite.config.js
│
├── backend/                   # API Express
│   └── src/
│       ├── api/
│       │   ├── auth/          # Login, logout, signup, /auth/user
│       │   ├── lostark/       # Accounts, characters, Main 6, raids
│       │   └── projets/       # Liste des projets
│       ├── swagger.js         # Configuration OpenAPI 3.0
│       └── server.js
│
└── README.md
```

---

## Prérequis

- Node.js ≥ 18
- npm
- Compte Supabase avec une base de données configurée

---

## Installation & exécution locale

### 1. Cloner le dépôt

```bash
git clone https://github.com/NadirNemmas/Yatonokuni.git
cd Yatonokuni
```

### 2. Backend

```bash
cd backend
npm install
```

Créer un fichier `.env` dans `backend/` :

```env
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=...
SUPABASE_JWT_SECRET=...
NODE_ENV=development
PORT=8000
```

Lancer le serveur :

```bash
npm start
```

L'API est disponible sur `http://localhost:8000`.  
La documentation Swagger est accessible sur `http://localhost:8000/api-docs`.

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

L'application est disponible sur `http://localhost:5173`.

Le proxy Vite redirige automatiquement `/api`, `/auth`, `/lostark`, `/projets`, `/characters` vers `http://localhost:8000`.

---

## Documentation API

La documentation complète de l'API est générée automatiquement via **Swagger UI** :

- **Local** : `http://localhost:8000/api-docs`
- **Production** : `https://yatonokuni.onrender.com/api-docs`

### Endpoints principaux

| Méthode | Route | Description |
|---|---|---|
| POST | `/auth/signup` | Créer un compte |
| POST | `/auth/login` | Connexion |
| POST | `/auth/logout` | Déconnexion |
| GET | `/auth/user` | Utilisateur courant |
| GET | `/lostark/accounts` | Liste des accounts Lost Ark |
| POST | `/lostark/accounts` | Créer un account |
| GET | `/lostark/accounts/:id` | Account + personnages |
| DELETE | `/lostark/accounts/:id` | Supprimer un account |
| PUT | `/lostark/accounts/:id/main6` | Définir les Main 6 |
| POST | `/lostark/accounts/:id/characters` | Ajouter un personnage |
| PUT | `/lostark/accounts/:id/characters/:charId` | Modifier un personnage |
| DELETE | `/lostark/accounts/:id/characters/:charId` | Supprimer un personnage |
| PATCH | `/lostark/accounts/:id/characters/:charId/raid` | Toggle raid fait/non fait |

Tous les endpoints nécessitent un cookie JWT `access_token_jwt` (authentification via `cookieAuth`).

---

## Déploiement

Le projet est déployé sur **Render** :

- Le backend sert l'API et les fichiers statiques du frontend buildé
- Build frontend :
  ```bash
  cd frontend && npm run build
  ```
- Le dossier `frontend/dist` est servi en statique par Express

Variables d'environnement à configurer sur Render :
```
SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
SUPABASE_JWT_SECRET
NODE_ENV=production
```

---

## Contribuer

Ce projet est strictement personnel.  
Aucune contribution, modification ou redistribution n'est acceptée sans autorisation préalable de l'auteur.

---

## Licence

Voir le fichier [`LICENCE`](./LICENCE) pour le texte complet.

- **Auteur :** Ahmed Nadir Nemmas (2025)
- **Autorisé :** lecture et téléchargement du code à des fins personnelles ou éducatives
- **Interdit :** modification, revente ou redistribution sans autorisation écrite préalable de l'auteur
- **Garantie :** aucune — le logiciel est fourni _"tel quel"_

---

## Contact

Émail personnel : nadirne91@gmail.com  
Émail ÉTS : ahmed-nadir.nemmas.1@ens.etsmtl.ca
