# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the frontend for an Online Judge (OJ) system called XJU-OJ. It's a Vue 3 application with TypeScript, built using Vue CLI 5, featuring:
- Problem library browsing
- Contest participation
- Tutorials and learning resources
- Daily check-in (punch) system
- User management

## Development Commands

### Setup
```bash
yarn install
```

### Development Server
```bash
yarn serve
# Runs dev server with hot-reload at http://localhost:8080
```

### Build
```bash
yarn build
# Creates production build in /dist directory
```

### Linting
```bash
yarn lint
# Runs ESLint with Prettier integration
# Auto-fixes issues when possible
```

## Architecture

### Technology Stack
- **Vue 3** with Composition API support
- **TypeScript** (strict mode enabled)
- **Vue Router 4** (hash mode)
- **Vuex 4** for state management
- **PWA** support with service worker registration

### Project Structure
```
src/
├── App.vue                  # Root component with main navigation
├── main.ts                  # Application entry point
├── router/index.ts          # Route definitions (all routes eagerly loaded except /about)
├── store/index.ts           # Vuex store (currently empty, ready for state management)
├── views/                   # Page-level components
│   ├── HomeView.vue         # Landing page
│   ├── ProblemsView.vue     # Problem library
│   ├── ContestsView.vue     # Contest listings
│   ├── TutorialsView.vue    # Learning resources
│   ├── PunchView.vue        # Daily check-in
│   ├── UsrView.vue          # User profile/management
│   └── AboutView.vue        # About page (lazy-loaded)
├── components/              # Reusable components
│   └── HelloWorld.vue       # Example component
└── assets/                  # Static assets (images, styles)
```

### Routing Strategy
- **Hash mode** (`createWebHashHistory`) - all routes use `#/` prefix
- **Default route**: `/` redirects to `/home`
- **Lazy loading**: Only `/about` route is code-split; other routes are eagerly loaded
- All routes defined in `/src/router/index.ts` with explicit component imports

### Path Aliases
- `@/` maps to `src/` directory (configured in `tsconfig.json`)
- Use `@/components/`, `@/views/`, etc. for imports

### State Management
- Vuex store initialized but empty (`src/store/index.ts`)
- When adding state, follow Vuex 4 composition API patterns
- Structure: `state → getters → mutations → actions → modules`

### Styling
- Component-scoped styles with `<style scoped>`
- Global styles in `App.vue`
- Uses standard CSS (no preprocessor configured)

## Navigation Structure

The application has a persistent top navigation bar with these sections:
- **主页** (Home) - `/home`
- **题库** (Problems) - `/problems`
- **比赛** (Contests) - `/contests`
- **教程** (Tutorials) - `/tutorials`
- **打卡** (Punch/Check-in) - `/punch`
- **关于** (About) - `/about`
- **用户** (User) - `/usr`

Active route is highlighted with green color (`#42b983`).

## Development Notes

### TypeScript Configuration
- Strict mode enabled
- Target: ESNext
- Path aliases configured for clean imports
- Type checking includes all `.vue`, `.ts`, `.tsx` files in `src/`

### Code Quality
- ESLint configured with:
  - `plugin:vue/vue3-essential`
  - TypeScript recommended rules
  - Prettier integration
- Auto-formatting on lint with Prettier

### Browser Support
- Modern browsers only (> 1%, last 2 versions)
- IE11 explicitly excluded
- No legacy browser polyfills needed beyond core-js

### Service Worker
- PWA capabilities via `registerServiceWorker.ts`
- Service worker registered automatically in production builds

## Adding New Features

### Adding a New Route
1. Create view component in `src/views/`
2. Import in `src/router/index.ts`
3. Add route object to `routes` array
4. Add navigation link in `App.vue` if needed

### Adding State Management
When Vuex store is needed:
1. Define state shape and initial values
2. Add getters for computed state
3. Add mutations for synchronous state changes
4. Add actions for async operations or complex logic
5. Consider using modules for feature separation

### Component Development
- Use `defineComponent` from Vue 3
- Prefer Composition API for new components
- Use TypeScript for props and emits typing
- Keep components in `src/components/` for reusability
