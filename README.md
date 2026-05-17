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
- **Notifications de proximité** — Reçois une alerte quand des toilettes sont à moins de 500m
- **Dark mode** — Support automatique du thème sombre

## 🛠 Stack technique

| Technologie                | Usage                                       |
| -------------------------- | ------------------------------------------- |
| **React Native** 0.81      | Framework mobile cross-platform             |
| **Expo** 54                | Toolchain & build                           |
| **TypeScript** 5.9         | Typage statique                             |
| **Expo Router** 6          | Navigation file-based                       |
| **React Query** (TanStack) | Cache & gestion d'état serveur              |
| **React Native Maps**      | Carte interactive                           |
| **AsyncStorage**           | Persistance locale (auth + cache toilettes) |
| **expo-notifications**     | Notifications locales                       |
| **expo-task-manager**      | Tâche de fond                               |
| **expo-location**          | Géolocalisation foreground & background     |

## 🚀 Installation

### Prérequis

- **Node.js** ≥ 18
- **npm** ou **yarn**
- **Expo Go** sur ton téléphone ([iOS](https://apps.apple.com/app/expo-go/id982107779) / [Android](https://play.google.com/store/apps/details?id=host.exp.exponent))
- Le [backend Peepal](https://github.com/peepal-org/peepal-backend) qui tourne en local

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

> 💡 En dev sur un appareil physique, remplace `localhost` par l'IP locale de ta machine.

4. **Démarrer l'app**

```bash
npx expo start
```

Scanner le QR code avec Expo Go sur ton téléphone.

---

## 🔔 Notifications de proximité (build natif requis)

Les notifications de proximité utilisent la géolocalisation en arrière-plan et ne fonctionnent pas dans Expo Go. Un build natif est nécessaire.

### Prérequis supplémentaires

- **Xcode** (iOS) ou **Android Studio** (Android)
- Un appareil physique ou un simulateur

### Build iOS

```bash
npx expo prebuild
npx expo run:ios --device
```

> ⚠️ Sur simulateur iOS, les tâches de fond ne se déclenchent pas. Tester sur un vrai device.

### Build Android

```bash
npx expo prebuild
npx expo run:android
```

### Fonctionnement

- L'app détecte les déplacements toutes les **100 mètres**
- Si des toilettes acceptées sont dans un rayon de **500m**, une notification est envoyée
- Un **cooldown de 5 minutes** évite le spam de notifications
- Les données sont mises en cache localement via AsyncStorage

---

## 👥 Équipe

Projet réalisé dans le cadre d'un projet annuel scolaire.

## 📄 Licence

Projet privé — Tous droits réservés.
