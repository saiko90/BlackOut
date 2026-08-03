# AUDIT SEO — Black Out ! — ÉTAPE 0

**Aucune modification de code n'a été faite pour produire ce rapport.**
Un `npm run build` + `npm run start` temporaire (port 3939, arrêté ensuite) a été
lancé pour inspecter le HTML réel envoyé par le serveur — lecture seule,
aucun fichier projet modifié.

---

## 1. Arborescence de `/app`

```
src/app/
├── layout.tsx                          [Server Component] — layout racine, metadata, viewport globale
├── page.tsx                            [use client] — MARKETING (écran "menu" d'accueil)
├── globals.css
├── robots.ts                           [Server] — déjà présent
├── sitemap.ts                          [Server] — déjà présent
├── global-error.tsx                    [use client] — TECHNIQUE (error boundary Sentry)
├── favicon.ico, icon.png
│
├── concept/page.tsx                    [use client] — MARKETING (hero, 4 étapes, FAQ)
├── cities/page.tsx                     [use client] — MARKETING (liste des villes + tarifs)
├── cgv/page.tsx                        [Server Component] — MARKETING/légal (a déjà `metadata`)
├── mentions-legales/page.tsx           [Server Component] — MARKETING/légal (a déjà `metadata`)
│
├── checkout/
│   ├── layout.tsx                      [use client] — TUNNEL PAIEMENT (garde d'auth)
│   └── page.tsx                        [use client] — TUNNEL PAIEMENT (Stripe)
├── dashboard/
│   ├── layout.tsx                      [use client] — COMPTE (garde d'auth)
│   └── page.tsx                        [use client] — COMPTE (inventaire, historique)
├── forgot-password/page.tsx            [use client] — COMPTE (formulaire)
├── reset-password/page.tsx             [use client] — COMPTE (formulaire)
├── admingodmode/page.tsx               [use client] — ADMIN (interne, non public)
│
├── play/[id]/page.tsx                  [use client] — JEU (moteur de jeu, GPS, caméra)
│
├── actions/                            Server Actions (session.ts, upload.ts, admin.ts, stripe.ts, promo.ts)
└── api/
    ├── video/render/route.ts           Route Handler — génération vidéo Shotstack
    ├── video/status/[id]/route.ts      Route Handler
    ├── webhooks/stripe/route.ts        Route Handler
    └── cron/cleanup-videos/route.ts    Route Handler (cron Vercel)
```

**Classification routes marketing vs jeu (pour le périmètre de la mission) :**

| Catégorie | Routes | Doit être indexé ? |
|---|---|---|
| **Marketing** | `/`, `/concept`, `/cities`, `/cgv`, `/mentions-legales` | ✅ Oui — cible de l'ÉTAPE 1 |
| **Compte / auth** | `/dashboard`, `/forgot-password`, `/reset-password` | ❌ Non |
| **Paiement** | `/checkout` | ❌ Non |
| **Jeu** | `/play/[id]` | ❌ Non — ne pas toucher (règle absolue) |
| **Admin** | `/admingodmode` | ❌ Non |
| **API / actions** | `api/*`, `actions/*` | N/A (pas de HTML) |

---

## 2. Fichiers `"use client"` — inventaire complet avec raison réelle

### Routes marketing (candidates ÉTAPE 1)

| Fichier | Raison réelle du `"use client"` | Contenu |
|---|---|---|
| `app/page.tsx` | `useState` (authOpen, **mounted**), `useEffect` (session Supabase), `useRouter`, `onClick` (bouton profil) | Marketing (écran menu, logo, CTA, liens) |
| `app/concept/page.tsx` | `useState` uniquement dans le sous-composant `FaqItem` (accordéon) ; le reste (hero, 4 étapes, FAQ list) n'a **aucun hook** — uniquement du `framer-motion` (`motion.header`, `motion.div`…) | Marketing (hero + 4 étapes + FAQ) |
| `app/cities/page.tsx` | `useState` (authOpen, **mounted**, pendingCity), `useEffect` (session + retour OAuth), `useRouter` | Marketing (liste des villes, tarifs) |

→ **Constat clé (voir §3)** : sur `concept/page.tsx`, le composant racine n'a besoin d'aucun state — seul `FaqItem` (accordéon) en a besoin. Le `"use client"` global est donc largement excessif ici : la majorité de la mission ÉTAPE 1 se résume à isoler `FaqItem` et à retirer `"use client"` du fichier racine, **si** `framer-motion` least fonctionne sans le boundary client (à vérifier dans les docs `node_modules/next/dist/docs/` avant toute implémentation, cf. `AGENTS.md`).

### Routes compte / paiement / admin (hors périmètre indexation, mais état des lieux)

| Fichier | Raison | Note |
|---|---|---|
| `app/checkout/page.tsx` | Stripe Embedded Checkout, `useState` multiples (promo, ville, vue), `useRouter` | Tunnel — restera client, `noindex` prévu |
| `app/checkout/layout.tsx` | `useEffect` garde d'auth + `router.replace` | idem |
| `app/dashboard/page.tsx` | `useState`/`useEffect` fetch Supabase, actions serveur | Compte — `noindex` prévu |
| `app/dashboard/layout.tsx` | `useEffect` garde d'auth | idem |
| `app/forgot-password/page.tsx` | Formulaire (`useState` email/loading/sent/error) | `noindex` prévu |
| `app/reset-password/page.tsx` | Formulaire + `useRouter` | `noindex` prévu |
| `app/admingodmode/page.tsx` | Dashboard interne, fetch de stats, formulaire login | Non public, déjà `disallow` dans `robots.ts` |
| `app/global-error.tsx` | `useEffect` (Sentry `captureException`) — obligatoire, error boundary React | Technique, aucune action possible |

### Routes jeu (ne pas toucher — règle absolue)

| Fichier | Raison |
|---|---|
| `app/play/[id]/page.tsx` | Moteur de jeu complet : GPS, upload Supabase, `useRouter`, `useParams`, state de session |
| `components/game/IntroStoryModal.tsx` | `framer-motion` (AnimatePresence) |
| `components/game/RouletteModal.tsx` | `useState/useEffect`, animation slot-machine |
| `components/game/VictoryScreen.tsx` | `useState/useEffect/useRef/useCallback`, polling rendu vidéo |
| `components/game/TopBar.tsx` | `useState/useEffect` (chrono), `useRouter` |
| `components/game/StepInterlude.tsx` | `framer-motion` uniquement |
| `components/game/StepCard.tsx` | `useState/useRef`, accès caméra/micro/GPS |
| `components/game/DecibelMeter.tsx` | Web Audio API (micro), `useState/useEffect/useRef` |

### Composants partagés (utilisés par marketing ET jeu — à traiter avec prudence)

| Fichier | Raison | Utilisé par |
|---|---|---|
| `components/auth/AuthOverlay.tsx` | Formulaire login/signup, `useState/useEffect`, Supabase | `/`, `/cities` (marketing) |
| `components/ui/PromoBanner.tsx` | `useState/useEffect` (session), overlay auth | `/`, `/concept` |
| `components/ui/TestimonialsCarousel.tsx` | `useMotionValue` + `useAnimationFrame` (défilement auto) | `/` |
| `components/ui/SocialLinks.tsx` | *(vérifié : pas de hook d'état ni handler — probablement classable "use client" par défaut/prudence, pas de raison technique stricte trouvée)* | `/` |
| `components/ui/PwaInstallPrompt.tsx` | `useState/useEffect`, `window.matchMedia`, `window.navigator.standalone` | `/` |
| `components/ui/Toast.tsx` | Store Zustand (`useToastStore`), `AnimatePresence` | Global (via `layout.tsx`) |
| `components/dashboard/TokenCard.tsx` | `useState`, `useMotionValue/useTransform`, `onClick` | `/dashboard` |
| `components/analytics/MetaPixel.tsx` | `useEffect`, `window.fbq`, `usePathname` | Global (via `layout.tsx`) |
| `components/analytics/TikTokPixel.tsx` | `useEffect`, `window.ttq`, `usePathname` | Global (via `layout.tsx`) |

### Composants UI génériques — **non utilisés actuellement**

| Fichier | Constat |
|---|---|
| `components/ui/CityCard.tsx` | Exporté depuis `components/ui/index.ts`, mais **aucun import ailleurs dans `src/`**. `cities/page.tsx` construit ses cartes en JSX inline, pas via ce composant. Code mort ou prévu pour un futur refactor — **signalé, non touché**. |
| `components/ui/Button.tsx` | Idem : exporté mais **aucun usage trouvé**. Signalé, non touché. |

**Total fichiers `"use client"` : 30** (13 dans `src/app`, 17 dans `src/components`).

---

## 3. Frontière client/serveur actuelle sur le marketing — et ce qui est *réellement* servi

Contrairement à l'hypothèse "le `<body>` ne contient que les meta pour toutes les pages",
la vérification par `curl` sur un build de production (`npm run build && npm run start`)
donne un résultat **différent selon la page** :

| Route | HTML réel dans `<body>` (hors `<script>` de flight data) |
|---|---|
| **`/`** | **Vide.** Le `<body>` ne contient que des `<div>` vides et des commentaires de boundary React (`<!--$--><!--/$-->`). Tout le texte (logo alt, tagline, boutons, liens légaux) n'existe que sous forme de chaîne échappée dans le payload RSC (`self.__next_f.push(...)`), invisible pour un crawler qui ne rend pas le JS. |
| **`/cities`** | **Vide**, même symptôme exact que `/`. |
| **`/concept`** | **Complet.** `<h1>`, les 4 étapes, les chiffres clés, les 7 questions de FAQ et leurs boutons sont bien présents en HTML texte, avec les bonnes classes Tailwind. Seul l'état d'animation initial (`style="opacity:0;transform:translateY(24px)"` de framer-motion) n'est pas encore résolu avant hydratation — comportement normal, sans impact sur l'indexation du texte. |

**Cause racine identifiée pour `/` et `/cities` (et seulement ces deux-là) :**
les deux fichiers partagent exactement le même pattern :

```ts
const [mounted, setMounted] = useState(false)
useEffect(() => { setMounted(true); ... }, [])
if (!mounted) return null   // ← rend `null` côté serveur (mounted vaut false au premier render)
```

Ce garde-fou (probablement mis en place à l'origine pour éviter un flash de contenu
avant vérification de la session Supabase) fait que **le rendu serveur de ces deux
pages est littéralement vide**, indépendamment de la présence de `"use client"` en tête
de fichier — `"use client"` seul n'empêche pas le SSR (`/concept` le prouve), c'est le
`if (!mounted) return null` qui bloque tout.

**Conséquence pour l'ÉTAPE 1** : la priorité n'est donc pas uniquement "remonter le
`use client`" en général, mais concrètement :
1. Sur `/` et `/cities` : supprimer (ou contourner) le garde `mounted` pour le contenu
   statique, en gardant la vérification de session uniquement pour les parties qui en
   dépendent réellement (bouton profil, overlay auth).
2. Sur `/concept` : le texte est déjà servi ; le travail restant est surtout
   d'alléger le bundle JS (isoler `FaqItem`) plutôt que de "sauver" du contenu déjà présent.

Ce constat sera à valider avec vous avant toute implémentation (ÉTAPE 1), notamment
parce que retirer le garde `mounted` peut changer l'ordre d'apparition visuelle du
`PwaInstallPrompt` / `AuthOverlay` — point à trancher ensemble pour respecter la
règle "zéro changement visuel".

---

## 4. Contenu de `layout.tsx`, `page.tsx`, metadata/viewport

**`src/app/layout.tsx`** (Server Component) contient déjà :
- `metadataBase: new URL('https://www.theblackoutgame.ch')` — ✅ déjà présent (l'ÉTAPE 3 n'a donc pas besoin de le créer, seulement de vérifier qu'il reste correct)
- `title` fixe : `"Black Out ! — Le jeu urbain qui détruit la dignité"` (pas de `title.template`)
- `description` unique, réutilisée telle quelle en `openGraph.description` et `twitter.description` (pas de description par route)
- `openGraph.images` / `twitter.images` → `/logo.png` (512×512) alors que `twitter:card` est `summary_large_image` (image carrée dans un format prévu pour du 1200×630 → ÉTAPE 4)
- `manifest: '/manifest.json'` — ✅ présent, contenu cohérent (voir §5)
- `<html lang="fr">` — pas `fr-CH` (ÉTAPE 3)
- `viewport` exporté une seule fois, globalement : `width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no` → s'applique à **toutes** les routes y compris marketing (ÉTAPE 2)
- Aucun JSON-LD
- Charge globalement `ToastContainer`, `Analytics` (Vercel), `MetaPixel`, `TikTokPixel`

**`src/app/page.tsx`** : voir §2/§3 — écran "menu" (logo, partage WhatsApp, 4 boutons de nav, liens légaux, réseaux sociaux, carrousel témoignages). Pas de `<h1>` du tout actuellement (voir §6).

**Metadata par route** : seules `cgv/page.tsx` et `mentions-legales/page.tsx` (les deux seuls Server Components parmi les pages) exportent un `metadata` propre. Toutes les autres routes marketing (`/`, `/concept`, `/cities`) étant en `"use client"`, elles **ne peuvent techniquement pas** exporter `metadata` aujourd'hui — c'est un pré-requis technique direct de l'ÉTAPE 1 pour pouvoir réaliser l'ÉTAPE 3 sur ces routes.

---

## 5. Présence des fichiers techniques SEO

| Élément | État |
|---|---|
| `app/robots.ts` | ✅ Présent. `allow: '/'`, `disallow` sur `/dashboard`, `/play/`, `/admingodmode`, `/forgot-password`, `/reset-password`. **Manquant** : `/checkout` n'est pas dans la liste des `disallow` (ÉTAPE 5). |
| `app/sitemap.ts` | ✅ Présent. Contient `/`, `/cities`, `/concept`, `/cgv`, `/mentions-legales`. Pas encore de pages par ville (normal, ÉTAPE 6 pas encore faite). |
| `public/manifest.json` | ✅ Présent, cohérent (nom, icônes, thème, `display: standalone`). |
| JSON-LD | ❌ Absent partout. |
| `opengraph-image` | ❌ Absent (`app/opengraph-image.tsx` n'existe pas). Utilise `logo.png` 512×512 statique en fallback (voir §4). |
| `metadataBase` | ✅ Déjà présent dans `layout.tsx`. |

---

## 6. Hiérarchie des titres réellement utilisés (pages marketing)

| Route | Titres trouvés |
|---|---|
| `/` (landing) | **Aucun `h1`/`h2`/`h3`.** Uniquement des `<p>` pour le logo/tagline. À corriger en ÉTAPE 7 (sémantique) — un `<h1>` devra être introduit **avec les classes visuelles existantes**, sans rien changer à l'apparence. |
| `/concept` | 1× `<h1>` ("Comment survivre au Black Out ?"). Pas de `<h2>`/`<h3>` — les titres de section ("Les 4 étapes", "Questions fréquentes") et les titres des 4 étapes sont des `<p>` stylés, pas des vraies balises de titre. |
| `/cities` | 1× `<h1>` ("Choisis ta zone de jeu"). Les noms de ville sont des `<span>`. |
| `/cgv`, `/mentions-legales` | 1× `<h1>` + plusieurs `<h2>` par section — hiérarchie déjà correcte (ce sont les deux seuls Server Components). |

**Constat global** : sur les 3 pages marketing "produit" (`/`, `/concept`, `/cities`),
il n'y a qu'**un seul `<h1>` réel au total** (sur `/concept`) et **aucun `<h2>`** —
la majorité des titres visuels sont des `<p>`/`<span>` stylés en gras. Sujet direct de l'ÉTAPE 7.

---

## 7. Taille du bundle JS

`npm run build` (Next 16.2.6, Turbopack) **ne produit pas** la table classique
"Route / Size / First Load JS" des anciennes versions de Next — cette build Turbopack
personnalisée n'affiche que la liste des routes avec leur statut ○ (statique) / ƒ (dynamique) :

```
Route (app)
┌ ○ /
├ ○ /_not-found
├ ○ /admingodmode
├ ƒ /api/cron/cleanup-videos
├ ƒ /api/video/render
├ ƒ /api/video/status/[id]
├ ƒ /api/webhooks/stripe
├ ○ /cgv
├ ○ /checkout
├ ○ /cities
├ ○ /concept
├ ○ /dashboard
├ ○ /forgot-password
├ ○ /icon.png
├ ○ /mentions-legales
├ ƒ /play/[id]
├ ○ /reset-password
├ ○ /robots.txt
└ ○ /sitemap.xml
```

Aucun `@next/bundle-analyzer` n'est installé (pas de dépendance présente dans
`package.json`, pas de config dans `next.config.ts`). Le fichier `.next/build-manifest.json`
généré par cette version n'expose pas non plus le détail par route (structure différente
de l'App Router classique).

**Pour obtenir une mesure fiable du JS initial de `/`**, deux options possibles à
valider avec vous en ÉTAPE 8 (aucune n'a été exécutée ni aucune dépendance ajoutée) :
- Chrome DevTools → onglet Network, filtre JS, `npm run start` en prod, hard reload sur `/`.
- Ajouter `@next/bundle-analyzer` (nouvelle dépendance → nécessite votre accord, règle absolue #3).

Ce que j'ai pu mesurer sans nouvelle dépendance : les chunks partagés globaux
(`rootMainFiles` du build) représentent **~448 KB non compressés** cumulés sur les
7 fichiers JS chargés par toutes les routes (framer-motion, Sentry, Supabase client,
Stripe.js, analytics, etc. sont mutualisés dans ces chunks partagés). Ce chiffre sera
la référence "avant" pour le rapport avant/après de l'ÉTAPE 8.

---

## Résumé — ce qui diffère de ce qui était supposé

1. ✅ `metadataBase` existe déjà — pas à créer, juste à vérifier en ÉTAPE 3.
2. ✅ `robots.ts` et `sitemap.ts` existent déjà — l'ÉTAPE 5 sera un ajustement, pas une création.
3. ⚠️ Le problème "body vide" ne touche **que `/` et `/cities`** (à cause du garde `mounted`), **pas `/concept`** qui sert déjà tout son texte en HTML.
4. ⚠️ `/` n'a **aucun `<h1>`** actuellement — à ajouter en ÉTAPE 7 sans rien changer visuellement.
5. ⚠️ Deux composants UI (`CityCard`, `Button`) semblent non utilisés — signalés, pas touchés.
6. ⚠️ Le rapport de bundle "avant/après" classique de Next n'est pas disponible tel quel avec cette version Turbopack — méthode alternative proposée en ÉTAPE 8, à valider.

---

**Fin de l'audit. Aucun fichier de code n'a été modifié.**
J'attends ta validation avant de commencer l'ÉTAPE 1.
