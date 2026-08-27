# Déploiement — Kukir1n

Site 100% statique (HTML/CSS/JS, aucun backend, aucune build step).
Déployable tel quel, sans configuration supplémentaire, sur n'importe quel hébergeur statique.

## Contenu ajouté pour la compatibilité universelle

| Fichier            | Rôle                                                              |
|---------------------|--------------------------------------------------------------------|
| `netlify.toml`      | Config Netlify : headers de sécurité, cache, page 404              |
| `vercel.json`        | Config Vercel : headers de sécurité, cache, URLs propres           |
| `.htaccess`         | Config Apache (IONOS, OVH, mutualisé classique) : cache, headers, HTTPS forcé |
| `.nojekyll`         | Désactive Jekyll sur GitHub Pages (sinon certains fichiers sont ignorés) |
| `.gitignore`        | Exclut uniquement les fichiers système/éditeur — jamais `css/js/assets` |
| `404.html`          | Page d'erreur personnalisée                                        |

Aucun de ces fichiers ne gêne les autres plateformes : Netlify ignore `.htaccess` et `vercel.json`, Vercel ignore `.htaccess` et `netlify.toml`, etc. Le site fonctionne à l'identique partout.

## ⚠️ Important — cache CSS/JS après une mise à jour

Les fichiers `css/main.css` et `js/*.js` sont mis en cache un an par le navigateur (pour la vitesse). Toutes leurs balises `<link>`/`<script>` dans le HTML utilisent un paramètre de version, ex: `css/main.css?v=20260822a`.

**À chaque nouvelle mise à jour du CSS ou du JS, il faut changer ce numéro de version dans tous les fichiers HTML**, sinon les visiteurs continueront de voir l'ancienne version en cache — même après un nouveau déploiement. Change simplement `20260822a` par la date du jour (ou incrémente la lettre) partout où il apparaît dans les fichiers `.html`.

## Netlify

1. **Glisser-déposer** : va sur https://app.netlify.com/drop et dépose ce dossier (pas le zip, le dossier décompressé).
2. **Ou via Git** : connecte le repo, laisse "Build command" vide, "Publish directory" = `.` (racine).

## Vercel

1. **Via Git** : importe le repo sur vercel.com/new.
   - Framework Preset : **Other**
   - Build Command : vide
   - Output Directory : vide (racine)
   - **Root Directory** : doit pointer vers le dossier qui contient `index.html` directement. Si `index.html` est à la racine du repo, laisse ce champ vide/`.`. Si tes fichiers sont dans un sous-dossier (ex: `/site`), indique `site` ici — c'est la cause n°1 des erreurs 404 sur les assets.
2. **Via CLI** : `vercel` depuis ce dossier.

## GitHub Pages

1. Repo public > Settings > Pages > Source : `main` branch, dossier `/ (root)`.
2. Le fichier `.nojekyll` est déjà présent, donc aucune configuration Jekyll supplémentaire n'est nécessaire.

## IONOS / OVH / hébergement mutualisé (Apache)

1. Upload de tous les fichiers (y compris `.htaccess`, qui commence par un point donc invisible par défaut — active "afficher les fichiers cachés" dans ton client FTP) dans le dossier racine web (souvent `htdocs` ou `www`).

## Cloudflare Pages

1. Connecte le repo, Build command vide, Output directory = `/` (racine).

## Checklist en cas de page blanche / CSS non chargé sur un nouvel hébergeur

- [ ] `index.html` est-il bien à la racine du dossier déployé (pas dans un sous-dossier imbriqué) ?
- [ ] Le dossier `css/` apparaît-il dans le repo/déploiement avec exactement cette casse (minuscules) ?
- [ ] Le champ "Root Directory" / "Publish directory" de la plateforme correspond-il à l'endroit réel où se trouve `index.html` ?
- [ ] Le `.gitignore` n'exclut-il pas `css/`, `js/`, `assets/` ou `*.css` ?
