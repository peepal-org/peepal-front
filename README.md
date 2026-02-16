<p align="center">
  <img src="assets/images/peepal-logo.png" alt="Peepal Logo" width="150" />
</p>

<h1 align="center">Peepal</h1>

<p align="center">
  <strong>Trouve des toilettes proches de toi 🚻</strong>
</p>

<p align="center">
  Application mobile collaborative permettant de localiser, ajouter et noter des toilettes publiques à proximité.
</p>

---

## 📱 Fonctionnalités

- **Carte interactive** — Visualise les toilettes autour de toi en temps réel
- **Filtres** — Gratuit, accessible PMR, ouvert maintenant
- **Navigation** — Lance l'itinéraire vers les toilettes depuis l'app
- **Contributions** — Ajoute de nouvelles toilettes pour la communauté
- **Avis & notes** — Partage ton expérience et consulte celles des autres
- **Profil & gamification** — Gagne des points et des badges en contribuant
- **Dark mode** — Support automatique du thème sombre

## 🛠 Stack technique

| Technologie                | Usage                           |
| -------------------------- | ------------------------------- |
| **React Native** 0.81      | Framework mobile cross-platform |
| **Expo** 54                | Toolchain & build               |
| **TypeScript** 5.9         | Typage statique                 |
| **Expo Router** 6          | Navigation file-based           |
| **React Query** (TanStack) | Cache & gestion d'état serveur  |
| **React Native Maps**      | Carte interactive               |
| **AsyncStorage**           | Persistance locale (auth)       |

## 🚀 Installation

### Prérequis

- **Node.js** ≥ 18
- **npm** ou **yarn**
- **Expo Go** sur ton téléphone ([iOS](https://apps.apple.com/app/expo-go/id982107779) / [Android](https://play.google.com/store/apps/details?id=host.exp.exponent))
- Le [backend Peepal](https://github.com/votre-org/peepal-backend) qui tourne en local

### Lancer le projet

1. **Cloner le repo**

```bash
git clone https://github.com/votre-org/peepal-front.git
cd peepal-front
```

2. **Installer les dépendances**

```bash
npm install
```

3. **Configurer l'environnement**

Créer un fichier `.env` à la racine :

```env
EXPO_PUBLIC_API_URL=http://localhost:3000
EXPO_PUBLIC_API_URL_ANDROID=http://10.0.2.2:3000
EXPO_PUBLIC_TOKEN_KEY=token
EXPO_PUBLIC_USER_KEY=userProfile
```

> 💡 En dev sur un appareil physique, l'IP du serveur est détectée automatiquement via Expo. Pas besoin de la modifier.

4. **Démarrer l'app**

```bash
npx expo start
```

Scanner le QR code avec Expo Go sur ton téléphone.

## 👥 Équipe

Projet réalisé dans le cadre d'un projet annuel scolaire.

## 📄 Licence

Projet privé — Tous droits réservés.
