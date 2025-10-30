# Minimalist/Brutalist Design Variant

## 🎨 Design Philosophy

**Swiss Design meets Brutalism** - A stark, high-contrast interface that prioritizes content over decoration. Inspired by Swiss typography and brutalist web design principles.

## Key Features

- **Monospaced Typography** - JetBrains Mono for technical precision
- **Stark Contrast** - Pure black (#000) on white (#FFF)
- **Bold Hierarchy** - Size and weight create clear visual order
- **Zero Decorations** - No shadows, no gradients, no rounded corners
- **Maximum Whitespace** - Breathing room for content
- **Red Accents** - Strategic use of #FF0000 for CTAs and alerts

## Color Palette

```css
--color-black: #000000;
--color-white: #FFFFFF;
--color-accent: #FF0000;
--color-gray-light: #CCCCCC;
--color-gray-mid: #666666;
--color-border: #E0E0E0;
```

## Typography Scale

- **Hero**: 64px / JetBrains Mono Bold
- **H1**: 48px / JetBrains Mono Bold
- **H2**: 32px / JetBrains Mono SemiBold
- **Body Large**: 18px / Inter Regular
- **Body**: 16px / Inter Regular
- **Small**: 14px / IBM Plex Mono Regular
- **Mono**: 14px / IBM Plex Mono Regular

## Spacing System

Uses 8px base unit (8, 16, 24, 32, 48, 64, 96, 128)

## Usage

### To Preview This Design:

1. Update your routing to point to these components temporarily
2. Or copy these files to `src/pages/` (backup your originals first!)

### To Use This Design:

```javascript
// In your App.js or routing file
import HighCourtJudgments from './pages/designs/minimalist/HighCourtJudgments';
import SupremeCourtJudgments from './pages/designs/minimalist/SupremeCourtJudgments';
```

## Design Principles Applied

### UX
- ✅ Minimal Cognitive Load - Clear hierarchy, no distractions
- ✅ Fitts' Law - Large click targets for important actions
- ✅ Consistency - Rigid grid and spacing system

### UI
- ✅ Gestalt Principles - Proximity, similarity through size/weight
- ✅ Visual Hierarchy - Size = Importance
- ✅ Affordances - Clear, obvious interactive elements

## Best For

- Legal professionals who want speed and clarity
- Desktop-first users
- Users who prefer minimal, distraction-free interfaces
- High-contrast preference users
- Technical/developer audiences

## Not Ideal For

- Users who need visual warmth
- Mobile-first experiences (works but optimized for desktop)
- Users who prefer softer, friendlier interfaces

---

**Created**: October 2025  
**Design Paradigm**: Minimalist/Brutalist  
**Status**: ✅ Complete

