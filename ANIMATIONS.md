# Animations avec Motion : le processus complet

Ce document explique comment fonctionnent les animations du projet, de la première ligne de code jusqu'à l'animation qui tourne en boucle.

Le projet utilise **Motion** (`motion`, anciennement « Framer Motion ») avec React, TypeScript et Tailwind CSS.

---

## 1. Installation et import

```bash
npm install motion
```

```tsx
import { motion } from "motion/react"
```

`motion` fournit une version animable de chaque balise HTML :

| HTML classique | Version Motion   |
| -------------- | ---------------- |
| `<div>`        | `<motion.div>`   |
| `<button>`     | `<motion.button>`|
| `<span>`       | `<motion.span>`  |

Une balise `motion.xxx` se comporte comme la balise normale (on garde `className`, `onClick`, etc.). Elle accepte en plus les props d'animation : `initial`, `animate`, `transition`…

---

## 2. Les trois props de base

```tsx
<motion.div
  initial={{ x: 0 }}          // état de départ
  animate={{ x: 200 }}        // état d'arrivée
  transition={{ duration: 5 }} // comment on y va
/>
```

| Prop         | Rôle                                                              |
| ------------ | ----------------------------------------------------------------- |
| `initial`    | Valeurs de l'élément **au montage** (avant l'animation)           |
| `animate`    | Valeurs **cibles** vers lesquelles Motion anime                   |
| `transition` | **Comment** animer : durée, courbe (`ease`), répétition, délai…   |

### Le déroulement

1. React affiche l'élément avec les valeurs de `initial` (ici `x: 0`).
2. Motion compare `initial` et `animate`.
3. Il calcule les valeurs intermédiaires image par image (environ 60 fois par seconde).
4. Au bout de `duration` secondes, l'élément est à `x: 200`.

> Si `initial` est absent, Motion part de la valeur actuelle de l'élément (souvent celle définie par le CSS).

### Propriétés souvent animées

- `x`, `y` : déplacement en pixels
- `scale` : taille (`1` = 100 %, `1.1` = 110 %)
- `rotate` : rotation en degrés
- `opacity` : transparence (`0` à `1`)
- `backgroundColor`, `borderRadius`, `width`, `height`…

---

## 3. Les keyframes (images clés)

Au lieu d'une seule valeur, on peut donner un **tableau**. L'élément passe alors par chaque valeur, dans l'ordre.

```tsx
animate={{ scale: [1, 1.1, 1] }}
```

→ taille normale, puis il grossit de 10 %, puis il revient à sa taille normale.

### Plusieurs propriétés en même temps

Exemple tiré de `src/App.tsx` :

```tsx
animate={{
  rotate:       [0,     0,     270,   270,   0],
  borderRadius: ["20%", "20%", "50%", "50%", "20%"]
}}
transition={{ duration: 5 }}
```

Les tableaux avancent **ensemble** : l'élément n°1 de `rotate` va avec l'élément n°1 de `borderRadius`, et ainsi de suite.

| Étape | Moment (sur 5 s) | rotate | borderRadius | Ce qu'on voit                    |
| ----- | ---------------- | ------ | ------------ | -------------------------------- |
| 1     | 0 s              | 0°     | 20 %         | Carré aux coins arrondis         |
| 2     | 1,25 s           | 0°     | 20 %         | **Pause**                        |
| 3     | 2,5 s            | 270°   | 50 %         | Il tourne et devient un cercle   |
| 4     | 3,75 s           | 270°   | 50 %         | **Pause** sous forme de cercle   |
| 5     | 5 s              | 0°     | 20 %         | Il revient en arrière, en carré  |

### Les règles à retenir

- **Une valeur répétée crée une pause** : `0, 0` ou `270, 270` → rien ne bouge pendant ce segment.
- Les tableaux devraient avoir **le même nombre de valeurs**, pour que les étapes restent synchronisées.
- Par défaut, les étapes sont **réparties de façon égale** sur `duration`. Avec 5 valeurs, il y a 4 segments de 1,25 s chacun.

### Contrôler le timing avec `times`

```tsx
transition={{
  duration: 5,
  times: [0, 0.1, 0.5, 0.9, 1] // position de chaque étape, entre 0 et 1
}}
```

`times` doit avoir **autant de valeurs** que les keyframes.

### Attention

```tsx
// scale: [1, 2, 3, 4, 5, 6, 7]
```

Avec ce tableau, l'élément grossit jusqu'à 7 fois sa taille et ne revient jamais à la normale. Pour une animation qui boucle proprement, **la dernière valeur doit être égale à la première**.

---

## 4. La prop `transition` en détail

| Option        | Exemple                | Effet                                              |
| ------------- | ---------------------- | -------------------------------------------------- |
| `duration`    | `0.8`                  | Durée en secondes                                  |
| `ease`        | `"linear"`, `"easeInOut"` | Courbe de vitesse                               |
| `delay`       | `0.5`                  | Attente avant de démarrer                          |
| `repeat`      | `Infinity`, `3`        | Nombre de répétitions                              |
| `repeatType`  | `"loop"`, `"reverse"`, `"mirror"` | Manière de répéter                      |
| `repeatDelay` | `1`                    | Pause entre deux répétitions                       |
| `times`       | `[0, 0.5, 1]`          | Timing des keyframes                               |

### Les courbes `ease`

- `"linear"` : vitesse constante. Utile pour une rotation continue.
- `"easeIn"` : démarre lentement, finit vite.
- `"easeOut"` : démarre vite, finit lentement.
- `"easeInOut"` : lent au début et à la fin, rapide au milieu. C'est le plus naturel pour une pulsation.

---

## 5. Cas pratique : `PulsingButton`

Fichier : `src/components/PulsingButton.tsx`

```tsx
import { motion } from "motion/react"

const PulsingButton = () => {
  return (
    <motion.button
      className="cursor-pointer rounded-full bg-blue-500 px-6 py-3 font-semibold text-white shadow-lg shadow-blue-500/40"
      animate={{
        scale: [1, 1.1, 1],
        backgroundColor: ["#3b82f6", "#60a5fa", "#3b82f6"],
      }}
      transition={{ duration: 0.8, ease: "easeInOut", repeat: Infinity }}
    >
      Cliquer moi
    </motion.button>
  )
}

export default PulsingButton
```

### Ce qui se passe, étape par étape

1. **`motion.button`** : un bouton normal, mais animable.
2. **`className`** : Tailwind définit le style de base (bleu, arrondi, ombre).
3. **`animate`** : deux animations en parallèle, chacune avec 3 keyframes.
   - `scale` : `1` → `1.1` → `1` (il grossit puis revient)
   - `backgroundColor` : bleu `#3b82f6` → bleu clair `#60a5fa` → bleu `#3b82f6`
4. **`transition`** :
   - `duration: 0.8` : un cycle complet dure 0,8 s (0,4 s pour grossir, 0,4 s pour revenir)
   - `ease: "easeInOut"` : le mouvement est doux
   - `repeat: Infinity` : ça recommence sans fin

Résultat : le bouton « respire », il grossit et s'éclaircit en même temps, en boucle. La boucle est fluide parce que la première et la dernière valeur sont identiques.

---

## 6. Cas pratique : `BouncingLoader`

Fichier : `src/components/BouncingLoader.tsx`

```tsx
import { motion } from "motion/react"

const BouncingLoader = () => {
  return (
    <div className="flex items-center justify-center space-x-2">
      {[...Array(5)].map((_, index) => (
        <motion.div
          key={index}
          className="h-4 w-4 rounded-full bg-teal-500"
          animate={{ y: [0, -15, 0] }}
          transition={{
            duration: 0.6,
            ease: "easeInOut",
            repeat: Infinity,
            repeatDelay: index * 0.2,
          }}
        />
      ))}
    </div>
  )
}

export default BouncingLoader
```

### Ce qui se passe, étape par étape

1. **`[...Array(5)].map(...)`** crée 5 éléments à partir d'un tableau vide de 5 cases. On n'utilise que l'`index` (0, 1, 2, 3, 4).
2. **`key={index}`** : React l'exige dans une liste.
3. **`className`** : chaque élément est un petit rond turquoise de 16 px. `space-x-2` les espace horizontalement.
4. **`animate={{ y: [0, -15, 0] }}`** : chaque rond monte de 15 px puis redescend (`y` négatif = vers le haut).
5. **`transition`** : un rebond dure 0,6 s, avec un mouvement doux, en boucle.
6. **`repeatDelay: index * 0.2`** : la pause entre deux rebonds dépend de la position du rond.

| Rond | index | repeatDelay | Durée d'un cycle (0,6 s + pause) |
| ---- | ----- | ----------- | -------------------------------- |
| 1    | 0     | 0 s         | 0,6 s                            |
| 2    | 1     | 0,2 s       | 0,8 s                            |
| 3    | 2     | 0,4 s       | 1,0 s                            |
| 4    | 3     | 0,6 s       | 1,2 s                            |
| 5    | 4     | 0,8 s       | 1,4 s                            |

### `repeatDelay` ou `delay` ?

Les deux options ne font pas la même chose :

- **`repeatDelay`** : pause **entre chaque répétition**. Le premier rebond démarre tout de suite pour tous les ronds.
- **`delay`** : attente **avant le tout premier démarrage**. Les répétitions suivantes s'enchaînent ensuite sans pause supplémentaire.

Avec `repeatDelay: index * 0.2`, les 5 ronds sautent **ensemble** au premier cycle. Ensuite, comme chaque rond a un cycle de durée différente, ils se décalent de plus en plus. Le résultat est un rebond **désordonné**, pas une vague régulière.

Pour obtenir une **vague** (les ronds sautent l'un après l'autre, toujours dans le même ordre), on décale le départ avec `delay`. On garde alors la même durée de cycle pour tous :

```tsx
transition={{
  duration: 0.6,
  ease: "easeInOut",
  repeat: Infinity,
  delay: index * 0.2, // chaque rond démarre 0,2 s après le précédent
}}
```

Ce principe s'appelle le **stagger** (échelonnement) : on décale dans le temps la même animation appliquée à plusieurs éléments.

---

## 7. Cas pratique : `FlippingCard` (variants + état React)

Fichier : `src/components/FlippingCard.tsx`

```tsx
import { useState } from 'react'
import { motion } from 'motion/react'

const FlippingCard = () => {
  const [isFlipped, setIsFlipped] = useState(false)

  const handleFlip = () => {
    setIsFlipped(!isFlipped)
  }

  const cardVariants = {
    front: { rotateY: 0 },
    back: { rotateY: 180 },
  }

  return (
    <div className="perspective-[1000px]">
      <motion.div
        onClick={handleFlip}
        variants={cardVariants}
        initial="front"
        animate={isFlipped ? "back" : "front"}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        className="relative w-64 h-40 transform-3d cursor-pointer"
      >
        <div className="absolute inset-0 backface-hidden rounded-lg shadow-lg bg-white flex items-center justify-center text-xl font-bold">
          <p className="text-gray-800">Front</p>
        </div>

        <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-lg shadow-lg bg-blue-500 flex items-center justify-center text-xl font-bold">
          <p className="text-white">Back Side</p>
        </div>
      </motion.div>
    </div>
  )
}

export default FlippingCard
```

### Les `variants` : des états nommés

Jusqu'ici, on passait directement des valeurs à `animate`. Avec `variants`, on **donne un nom** à chaque état :

```tsx
const cardVariants = {
  front: { rotateY: 0 },   // carte vue de face
  back:  { rotateY: 180 }, // carte retournée
}
```

On passe ensuite le **nom** de l'état à `initial` et `animate`, au lieu des valeurs :

```tsx
variants={cardVariants}
initial="front"
animate={isFlipped ? "back" : "front"}
```

Avantages :
- le JSX est plus lisible (`"back"` plutôt que `{ rotateY: 180 }`) ;
- les états peuvent être définis dans un fichier à part et réutilisés (voir `src/variants.tsx`) ;
- les enfants d'un `motion` héritent des noms de variants de leur parent.

### Piloter l'animation avec un état React

1. **`useState(false)`** : la carte commence de face.
2. **`onClick={handleFlip}`** : chaque clic inverse `isFlipped`.
3. **`animate={isFlipped ? "back" : "front"}`** : quand l'état change, React refait le rendu, `animate` reçoit une nouvelle cible, et Motion anime automatiquement de l'état actuel vers la nouvelle cible.

Pas de `repeat` ici : l'animation se joue **une fois à chaque clic**, dans un sens ou dans l'autre.

### La 3D : les quatre classes indispensables

Pour qu'un retournement ait l'air d'être en 3D, il faut quatre réglages CSS (classes Tailwind v4) :

| Classe                 | Où                    | Rôle                                                                 |
| ---------------------- | --------------------- | -------------------------------------------------------------------- |
| `perspective-[1000px]` | Conteneur parent      | Donne de la profondeur : sans elle, la rotation semble « écrasée »   |
| `transform-3d`         | La carte (`motion.div`) | Garde les faces dans l'espace 3D (`transform-style: preserve-3d`)  |
| `backface-hidden`      | Chaque face           | Cache une face quand elle est tournée dos à l'écran                  |
| `rotate-y-180`         | Face arrière          | La face arrière est retournée dès le départ, pour être lisible une fois la carte tournée |

### Ce qui se passe au clic

1. Au départ, la carte a `rotateY: 0` : on voit la face avant. La face arrière (déjà à 180°) est dos à l'écran, donc cachée par `backface-hidden`.
2. Au clic, Motion anime `rotateY` de `0` à `180` en 0,6 s.
3. À mi-chemin (90°), la carte est vue de profil. Ensuite, la face avant passe dos à l'écran et disparaît. La face arrière, elle, se retrouve face à l'écran (180° + 180° = 360°).
4. Un nouveau clic ramène `rotateY` à `0`.

> Plus la valeur de `perspective` est petite, plus l'effet 3D est marqué (et déformé). `1000px` donne un rendu naturel.

---

## 8. Cas pratique : `AnimatedCard` (survol, clic, glisser, ressort)

Fichier : `src/components/AnimatedCard.tsx`

```tsx
import { motion } from 'motion/react'

const AnimatedCard = () => {
  return (
    <motion.div
      initial={{ scale: 1, rotate: 0 }}
      whileHover={{ scale: 1.05, rotate: 3 }}
      whileTap={{ scale: 0.95, rotate: -3 }}
      animate={{ scale: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300 }}
      drag
      dragConstraints={{ left: -50, right: 50, top: -50, bottom: 50 }}
      className="max-w-sm bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer"
    >
      <img src="https://images.unsplash.com/photo-..." alt="Card images" />
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-2">Card Title</h2>
        <p className="text-gray-700">This is a simple animated card component built with React and Tailwind CSS.</p>
        <button className="px-4 py-2 text-white rounded bg-blue-500 hover:bg-blue-600 transition">Get Started</button>
      </div>
    </motion.div>
  )
}

export default AnimatedCard
```

Contrairement aux exemples précédents, cette carte ne bouge **pas toute seule** : elle réagit aux gestes de l'utilisateur (survol, clic, glisser). Pas de `repeat`, pas de `useState` : Motion gère lui-même ces états.

### Les props de geste

| Prop              | Quand                                 | Valeur ici                    | Ce qu'on voit                          |
| ----------------- | ------------------------------------- | ----------------------------- | -------------------------------------- |
| `whileHover`      | Tant que la souris est sur la carte   | `scale: 1.05`, `rotate: 3`    | Elle grossit de 5 % et penche à droite |
| `whileTap`        | Tant que le bouton de la souris est enfoncé | `scale: 0.95`, `rotate: -3` | Elle rétrécit et penche à gauche (effet « enfoncé ») |
| `drag`            | Quand on la fait glisser              | `true`                        | On peut la déplacer à la souris        |
| `dragConstraints` | Pendant le glisser                    | ±50 px dans chaque direction  | Elle ne peut pas sortir de cette zone  |

Quand le geste s'arrête (la souris quitte la carte, on relâche le clic), Motion **revient automatiquement** à l'état défini par `animate` (ici `scale: 1`). Pas besoin d'écrire l'animation de retour.

### Le rôle de `initial` et `animate`

- `initial={{ scale: 1, rotate: 0 }}` : au montage, la carte est droite et à sa taille normale.
- `animate={{ scale: 1, y: 0 }}` : c'est l'état « au repos », vers lequel la carte revient après chaque geste.

Comme `initial` et `animate` ont les mêmes valeurs, il n'y a **aucune animation au chargement** : la carte apparaît simplement. Ces deux props servent surtout de point de retour pour les gestes.

> `rotate` n'est pas dans `animate`, mais Motion le ramène quand même à sa valeur de départ (`0`) à la fin du survol ou du clic.

### `type: "spring"` : une animation physique

Jusqu'ici, les transitions utilisaient une **durée** (`duration`) et une **courbe** (`ease`). Avec `type: "spring"`, Motion simule un **ressort** : il n'y a pas de durée fixe, le mouvement dépend de la physique.

| Option      | Effet                                                                 |
| ----------- | --------------------------------------------------------------------- |
| `stiffness` | Raideur du ressort. Plus elle est **élevée**, plus le mouvement est **rapide et sec** (ici `300`) |
| `damping`   | Amortissement. Plus il est **faible**, plus ça **rebondit** avant de s'arrêter |
| `mass`      | Poids de l'élément. Plus il est lourd, plus le mouvement est lent     |

Le ressort donne un rendu plus vivant pour les interactions : la carte « rebondit » légèrement en atteignant sa cible au lieu de s'arrêter net.

### Le glisser (`drag`) en détail

1. **`drag`** seul autorise le déplacement dans toutes les directions. On peut limiter à un axe avec `drag="x"` ou `drag="y"`.
2. **`dragConstraints`** fixe une zone en pixels autour de la position de départ : 50 px vers la gauche, la droite, le haut et le bas.
3. Si on tire la carte au-delà de cette zone, elle résiste (effet élastique), puis **revient dans la zone** quand on la lâche.

> `whileTap` s'active aussi au début d'un glisser : la carte rétrécit et penche pendant qu'on la tient.

---

## 9. Cas pratique : `AnimatedShape` (variants + gestes)

Fichier : `src/components/AnimatedShape.tsx`

```tsx
import { motion } from 'motion/react'

const AnimatedShape = () => {
  const boxVariants = {
    initial: { scale: 1, rotate: 0, skew: 0 },
    hover: {
      scale: 1.2,
      rotate: 15,
      skew: '10deg',
      transition: { duration: 0.3 },
    },
    click: {
      scale: 0.8,
      rotate: -15,
      transition: { duration: 0.3 },
    },
  }

  return (
    <div className='flex items-center justify-center h-screen'>
      <motion.div
        className='w-40 h-40 bg-blue-500 rounded-lg'
        variants={boxVariants}
        initial="initial"
        whileHover="hover"
        whileTap="click"
      />
    </div>
  )
}

export default AnimatedShape
```

Ce composant combine deux notions vues plus haut : les **variants** (section 7) et les **props de geste** (section 8). Au lieu d'écrire les valeurs directement dans `whileHover` et `whileTap`, on leur passe le **nom** d'un variant.

### Les trois états

| Variant   | Utilisé par  | scale | rotate | skew  | Ce qu'on voit                                  |
| --------- | ------------ | ----- | ------ | ----- | ---------------------------------------------- |
| `initial` | `initial`    | 1     | 0°     | 0     | Carré bleu, droit, taille normale              |
| `hover`   | `whileHover` | 1.2   | 15°    | 10deg | Il grossit de 20 %, tourne et se déforme       |
| `click`   | `whileTap`   | 0.8   | -15°   | —     | Il rétrécit et tourne dans l'autre sens        |

### Une `transition` propre à chaque variant

Ici, `transition` n'est pas une prop du `motion.div` : elle est placée **dans le variant**. Chaque état peut ainsi avoir sa propre vitesse.

- Vers `hover` et `click` : `duration: 0.3`, une animation rapide.
- Vers `initial` (la souris quitte le carré) : pas de `transition` définie, Motion utilise sa transition **par défaut**.

### Pas de `animate` : retour à `initial`

Il n'y a pas de prop `animate`. Quand le geste se termine, Motion revient donc aux valeurs de `initial` (`scale: 1`, `rotate: 0`, `skew: 0`).

### Survol + clic en même temps

Pour cliquer, la souris est forcément déjà sur le carré : `whileHover` et `whileTap` sont **actifs ensemble**. `whileTap` est prioritaire, mais seulement pour les propriétés qu'il définit.

- `scale` et `rotate` : valeurs de `click` (0.8 et -15°).
- `skew` : absent de `click`, il **garde la valeur de `hover`** (10deg).

Quand on relâche le clic, le carré revient à l'état `hover` (la souris est toujours dessus), puis à `initial` quand la souris part.

### `skew` : incliner la forme

`skew` penche l'élément en le déformant (un carré devient un losange). On peut aussi n'incliner que sur un axe avec `skewX` ou `skewY`. La valeur s'écrit en degrés : `'10deg'` ou simplement `10`.

> Dans le fichier, la valeur est écrite `' 10deg'` (avec un espace au début). Mieux vaut l'écrire `'10deg'` sans espace.

---

## 10. Cas pratique : `StaggerAnimation` (parent, enfants et `staggerChildren`)

Fichier : `src/components/StaggerAnimation.tsx`

```tsx
import { motion } from 'motion/react'

const parentVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.8,
    },
  },
}

const childVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      repeat: Infinity,
      repeatType: 'reverse' as const,
    },
  },
}

const StaggerAnimation = () => {
  return (
    <motion.div
      className='stagger-container'
      variants={parentVariants}
      initial='hidden'
      animate='visible'
    >
      {[...Array(5)].map((_, index) => (
        <motion.div className='stagger-item' key={index} variants={childVariants} />
      ))}
    </motion.div>
  )
}

export default StaggerAnimation
```

Dans la section 6, on décalait les éléments **à la main** avec `delay: index * 0.2`. Ici, c'est le **parent** qui orchestre le décalage de ses enfants, grâce à `staggerChildren`.

### La propagation des variants

Seul le parent a `initial='hidden'` et `animate='visible'`. Les enfants n'ont que `variants={childVariants}`.

Ça suffit : un enfant `motion` **hérite des noms de variants de son parent**. Quand le parent passe à `'visible'`, chaque enfant cherche lui aussi un variant `visible` dans ses propres `variants` et l'applique.

| Élément | `hidden`                 | `visible`              |
| ------- | ------------------------ | ---------------------- |
| Parent  | `opacity: 0`             | `opacity: 1`           |
| Enfant  | `opacity: 0`, `y: 20`    | `opacity: 1`, `y: 0`   |

Les noms doivent donc être **identiques** dans les deux objets (`hidden` et `visible`).

### `staggerChildren` : l'échelonnement automatique

`staggerChildren: 0.8` est placé dans la `transition` du **parent**. Il dit : « démarre chaque enfant 0,8 s après le précédent ».

| Carré | Démarre à |
| ----- | --------- |
| 1     | 0 s       |
| 2     | 0,8 s     |
| 3     | 1,6 s     |
| 4     | 2,4 s     |
| 5     | 3,2 s     |

Pas besoin d'`index` ni de calcul : Motion compte les enfants lui-même.

### La boucle des enfants

La `transition` de l'enfant contient :

- `duration: 0.8` : un carré apparaît (et monte de 20 px) en 0,8 s ;
- `repeat: Infinity` : ça ne s'arrête jamais ;
- `repeatType: 'reverse'` : au lieu de recommencer depuis le début, l'animation **repart en arrière**. Le carré apparaît, puis disparaît en redescendant, puis réapparaît…

Comme le décalage (0,8 s) est égal à la durée d'un aller (0,8 s), un carré commence à apparaître au moment exact où le précédent commence à disparaître. Une fois les 5 carrés lancés, ils **clignotent en alternance** : les carrés 1, 3 et 5 sont visibles quand les carrés 2 et 4 sont cachés, et inversement.

> `as const` est nécessaire en TypeScript : sans lui, `'reverse'` serait vu comme un simple `string`, alors que Motion attend exactement `"loop"`, `"reverse"` ou `"mirror"`.

### Le style (`index.css`)

Les classes `stagger-container` et `stagger-item` sont définies en CSS classique dans `src/index.css` :

- `.stagger-container` : colonne flex centrée, avec 2rem d'espace entre les carrés ;
- `.stagger-item` : carré jaune de 100 px, coins arrondis (20 px) et ombre portée.

### À nettoyer dans le fichier

Le fichier contient deux lignes inutiles, retirées de l'exemple ci-dessus :

- `import { animate } from 'motion'` : la fonction `animate` n'est jamais utilisée ;
- `animate: { Infinity }` dans `childVariants` : ce n'est pas une propriété animable. Ce variant n'est jamais utilisé et peut être supprimé.

---

## 11. Intégration dans `App.tsx`

```tsx
import PulsingButton from "./components/PulsingButton"
import BouncingLoader from "./components/BouncingLoader"
import FlippingCard from "./components/FlippingCard"
import AnimatedCard from "./components/AnimatedCard"
import AnimatedShape from "./components/AnimatedShape"
import StaggerAnimation from "./components/StaggerAnimation"

function App() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900">
      <StaggerAnimation />
    </div>
  )
}
```

Le conteneur centre le composant sur un fond sombre (`bg-slate-900`). Pour voir une autre animation, remplace `<StaggerAnimation />` par `<AnimatedShape />`, `<AnimatedCard />`, `<FlippingCard />`, `<BouncingLoader />` ou `<PulsingButton />`.

---

## 12. Récapitulatif du processus

1. **Importer** `motion` depuis `"motion/react"`.
2. **Remplacer** la balise HTML par sa version `motion.xxx`.
3. **Définir l'état de départ** avec `initial` (facultatif).
4. **Définir la cible** avec `animate` : une valeur simple, ou un tableau de keyframes.
5. **Régler le mouvement** avec `transition` : `duration`, `ease`, `repeat`, `times`…
6. **Pour une boucle propre** : la dernière keyframe doit être égale à la première.
7. **Pour une pause** : répéter la même valeur deux fois de suite.
8. **Pour animer plusieurs éléments en décalé** : générer une liste avec `.map()` et calculer `delay` à partir de l'`index`.
9. **Pour une animation déclenchée par l'utilisateur** : nommer les états avec `variants`, stocker l'état dans `useState`, et choisir le variant dans `animate`.
10. **Pour réagir aux gestes** : `whileHover`, `whileTap` et `drag` (avec `dragConstraints`). Motion revient seul à l'état `animate` à la fin du geste. `type: "spring"` rend le mouvement plus naturel.
11. **Pour des gestes réutilisables** : définir les états dans des `variants` et passer leur nom à `whileHover` / `whileTap`. Chaque variant peut porter sa propre `transition`.
12. **Pour orchestrer une liste** : mettre `initial` / `animate` sur le parent seulement, donner les mêmes noms de variants aux enfants, et ajouter `staggerChildren` dans la `transition` du parent.

---

## 13. Pour aller plus loin

- `delayChildren`, `staggerDirection: -1` : attendre avant le premier enfant, ou échelonner du dernier au premier
- `whileFocus`, `whileDrag`, `whileInView` : d'autres états déclenchés par l'utilisateur ou le défilement
- `exit` + `<AnimatePresence>` : animation quand l'élément disparaît
- Documentation officielle : https://motion.dev
