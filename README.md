# Leso — Video Editor Portfolio

A premium 3D scroll-animated portfolio for video editor **Leso**.

## Features
- **Real 3D morphing objects** powered by Three.js — geometry shifts between an icosahedron, torus, octahedron, torus knot, and smooth sphere as you scroll through sections
- **Scroll-driven 3D transitions** with particle clouds during morphs
- **Mouse-parallax** — the 3D object tracks your cursor
- **Three-colour system** — Deep Black `#0a0a0f` · Electric Violet `#7c3aed` · Warm Gold `#f5c842`
- **Reveal animations**, counter stats, skill bars
- Fully responsive (mobile + desktop)
- Zero build tools — plain HTML/CSS/JS

## Deploy to GitHub Pages

1. Create a GitHub repository (e.g. `portfolio`)
2. Upload all 5 files:
   ```
   index.html
   style.css
   scene.js
   main.js
   README.md
   ```
3. Go to **Settings → Pages → Source → Deploy from branch → main / (root)**
4. Your site will be live at `https://<username>.github.io/<repo>/`

## Files
| File | Purpose |
|------|---------|
| `index.html` | Page structure, sections, YouTube embeds |
| `style.css` | All styles, colours, animations, responsive |
| `scene.js` | Three.js 3D scene — geometries, particles, morph system |
| `main.js` | Scroll detection, reveal animations, loader, nav |

## Tech Stack
- [Three.js r128](https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js) via CDN
- [Syne](https://fonts.google.com/specimen/Syne) + [DM Sans](https://fonts.google.com/specimen/DM+Sans) via Google Fonts
- Vanilla JS — no frameworks, no build step

## Contact / Social
- Discord: [Leso](https://discord.com/users/1247214360493822114)
- X/Twitter: [@LesoAron](https://x.com/LesoAron/)
- Email: leso.edits@gmail.com
