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

## 7. Intégration dans `App.tsx`

```tsx
import PulsingButton from "./components/PulsingButton"
import BouncingLoader from "./components/BouncingLoader"

function App() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900">
      <BouncingLoader />
    </div>
  )
}
```

Le conteneur centre le composant sur un fond sombre (`bg-slate-900`). Pour voir l'autre animation, remplace `<BouncingLoader />` par `<PulsingButton />`.

---

## 8. Récapitulatif du processus

1. **Importer** `motion` depuis `"motion/react"`.
2. **Remplacer** la balise HTML par sa version `motion.xxx`.
3. **Définir l'état de départ** avec `initial` (facultatif).
4. **Définir la cible** avec `animate` : une valeur simple, ou un tableau de keyframes.
5. **Régler le mouvement** avec `transition` : `duration`, `ease`, `repeat`, `times`…
6. **Pour une boucle propre** : la dernière keyframe doit être égale à la première.
7. **Pour une pause** : répéter la même valeur deux fois de suite.
8. **Pour animer plusieurs éléments en décalé** : générer une liste avec `.map()` et calculer `delay` à partir de l'`index`.

---

## 9. Pour aller plus loin

- `whileHover={{ scale: 1.05 }}` : animation au survol de la souris
- `whileTap={{ scale: 0.95 }}` : animation au clic
- `exit` + `<AnimatePresence>` : animation quand l'élément disparaît
- `variants` : réutiliser des états d'animation entre plusieurs éléments
- Documentation officielle : https://motion.dev
