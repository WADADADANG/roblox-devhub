# ROBLOX.DEVHUB 🚀

> **Roblox Engine API Wiki • Hands-on Labs • Bug Arena • Luau Playground**

A modern, fast, and comprehensive developer documentation hub and interactive learning platform for Roblox Game Development & Luau.

![Roblox DevHub](https://img.shields.io/badge/Roblox-Engine%20Reference-00F5D4?style=for-the-badge&logo=roblox)
![Next.js](https://img.shields.io/badge/Next.js-16%20Turbopack-white?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)
![Tailwind](https://img.shields.io/badge/Tailwind-CSS%20v4-38BDF8?style=for-the-badge&logo=tailwindcss)

---

## 🌟 Key Features

### 1. 📖 Engine API Wiki (Mode 1)
- Comprehensive documentation for 29 core Roblox Engine methods, events, classes, and properties.
- Parameter breakdowns, return types, practical use cases, and production-tested Luau code.
- Bilingual explanations (Thai & English) with deep-linking support (`/wiki/[id]`).

### 2. 🎓 Hands-on Labs (Mode 2)
18 structured, step-by-step tutorial labs categorized into 8 distinct disciplines:
- **Basics & Architecture**: Instance lifecycle, Event-driven architecture, and ModuleScripts.
- **Building & 3D Math**: Screen-to-world Raycasting, surface normals, and 2-stud grid snapping.
- **Physics & Welds**: WeldConstraints, AssemblyLinearVelocity, and Spring suspension.
- **Vehicle Systems**: VehicleSeat inputs (Throttle/Steer) and nitrous boost mechanics.
- **Combat & Weapons**: Raycast hitscan weapons and spatial query melee hitboxes (`GetPartBoundsInBox`).
- **Networking & Remotes**: Secure RemoteEvents (anti-exploit validation) and two-way RemoteFunctions.
- **DataStore & Persistence**: Cloud saving with `pcall`, session caching, and `BindToClose` shutdown safety.
- **UI & Cross-Platform**: Smooth TweenService health bars and ContextActionService (PC/Gamepad/Mobile touch controls).

### 3. 🐛 Interactive Bug Arena (Mode 3)
- Real-world script debugging challenges based on common Roblox gotchas.
- Symptom diagnosis, broken code sandbox, hints, and verified solutions.

### 4. ⚡ Luau Playground (Mode 4)
- Live Luau execution environment with Developer Console log emulation and instance tree inspector.

---

## 🛠️ Tech Stack
- **Framework**: Next.js 16 (App Router + Turbopack)
- **UI & Components**: React 19 + Lucide Icons
- **Styling**: Tailwind CSS v4 + Blueprint Dot Grid Matrix theme
- **Static Generation**: Full SSG pre-rendering across 88 static routes with OpenGraph metadata

---

## 💻 Local Development

```bash
# Clone the repository
git clone https://github.com/WADADADANG/roblox-devhub.git
cd roblox-devhub

# Install dependencies
npm install

# Start local dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🚀 One-Click Deploy to Vercel

Deploy your own instance of Roblox DevHub in seconds with Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/WADADADANG/roblox-devhub)
