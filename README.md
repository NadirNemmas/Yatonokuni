# Yato no kuni

Site utilitaire personnel regroupant plusieurs outils / démos et projets personnels, construit avec React (frontend) et Node.js (backend). Le but est de centraliser des petites applications et démonstrations (auth, projets, bot Discord, etc.) pour un usage personnel et comme portfolio technique.

---

## Fonctionnalités principales

- Page d'accueil avec sections (À propos, Fonctionnalités, Contact)
- Authentification (inscription / connexion) avec gestion de sessions
- Page "Projects" listant les projets (titre, description, image, technologies)
- Page détaillée "GameMasterArtefact" : diaporama d'images, liste de commandes et documentation
- Composants réutilisables (Navbar, Header, Footer, Layout)
- Slider d'images avec navigation (prev/next) et dots
- UI responsive et quelques effets glassmorphism pour la navbar/auth

---

## Structure du dépôt (extrait)

- views/client/ — code React (pages et composants)
  - components/ : Navbar, Header, Footer, Layout, etc.
  - Home.jsx, Projects.jsx, GameMasterArtefact.jsx, Login.jsx, Signup.jsx
- src/api/ — backend (endpoints d'auth, etc.)
- public/docs/images/ — images statiques accessibles depuis le frontend
- public/css/style.css — styles globaux
- README.md — ce fichier

---

## Prérequis

- Node.js (>= 16)
- npm ou yarn
- (Optionnel) Base de données / service d'auth (ex : Supabase) si vous utilisez les fonctionnalités backend complètes

---

## Installation & exécution (local)

1. Cloner le dépôt

   ```bash
   git clone https://github.com/NadirNemmas/Yatonokuni.git
   cd Yatonokuni
   ```

2. Installer les dépendances (frontend)

   ```bash
   npm install
   # ou
   yarn
   ```

3. Variables d'environnement

   - Créez un fichier `.env` à la racine (ou configurez côté backend) avec les variables nécessaires, par exemple :
     ```
     SUPABASE_JWT_SECRET=...
     SUPABASE_JWT_EXPIRY_TIME=3600
     NODE_ENV=development
     ```
   - Vérifiez les READMEs des dossiers backend pour d'autres variables éventuelles.

4. Lancer en développement

   - Frontend (React/Vite):
     ```bash
     npm run dev
     ```
   - Backend (si présent et séparé) :
     ```bash
     cd src/api
     npm install
     npm run dev # ou npm start selon config
     ```

5. Accéder à l'app :
   - Ouvrir `http://localhost:5173` (ou le port configuré)

---

## Déploiement

- Construire le frontend :
  ```bash
  npm run build
  ```
- Déployer les fichiers statiques sur votre hôte (Netlify / Vercel / Render / etc.) et déployer le backend séparément si nécessaire.
- Pour les cookies cross-origin et les tokens : configurer `SameSite`, `Secure`, `path: "/"` et envoyer les requêtes avec `credentials: "include"`.

---

## Personnalisation rapide

- Ajouter/Modifier un projet :

  - Éditer `views/client/Projects.jsx` -> tableau `projects`
  - Images : placer dans `public/docs/images/` et référencer par `/docs/images/nom.jpg` ou importer depuis `src` si vous voulez que le bundler les gère.

- Page détaillée `GameMasterArtefact` :

  - Slider : images dans `imageSlider` (GameMasterArtefact.jsx)
  - Commandes : `commandsList` (format attendu : objets avec `id`, `commandName`, `description`, `fields_required`, `optional_fields`)

- Navbar → sections de la home :
  - Les liens vers les sections (about/features/contact) utilisent l'id des sections dans `Home.jsx` : vérifiez `id="about"`, `id="features"`, `id="contact"`.

---

## Accessibilité & UX

- Les toggles utilisent `aria-expanded` pour indiquer l'état (ouvert / fermé).
- Le slider contient des `aria` labels pour les slides et le contrôle par dots.
- Les boutons fixes (navbar / auth) ont un `z-index` élevé pour rester visibles.

---

## Contribuer

Ce projet est principalement personnel. Pour contributions :

- Ouvrir une issue pour discuter d'un changement.
- Fork -> branche -> PR si besoin.

---

## Licence

Par défaut, pas de licence explicite fournie ici. Ajoutez une licence (ex : MIT) si vous souhaitez autoriser la réutilisation.

---

## Contact

Pour toute question : nadirne91@gmail.com
