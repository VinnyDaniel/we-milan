# We Milan — Smart AI Wardrobe & Styling Assistant

> **"Your wardrobe. Reimagined."**
> A modern AI-powered digital wardrobe and contextual styling assistant that integrates garment scanning, real-time weather forecasts, and wearable sensor mood telemetry.

---

## 🌟 Key Features

### 1. AI Clothing Scanner (`/scan`)
- **Camera & Device Upload**: Take a photo using your camera or upload any clothing image.
- **Visual Garment Analysis**: Automatically classifies clothing name, category (`TOPS`, `BOTTOMS`, `DRESSES`, `OUTERWEAR`, `SHOES`, `ACCESSORIES`), colour, fabric/material (linen, cotton, silk, denim, polyester), style aesthetic, suitable occasions, and seasons.
- **Editable Metadata**: Edit any AI-detected attribute prior to saving.
- **Actual Photo Persistence**: Preserves your actual uploaded image inside your digital closet.

### 2. 3D Digital Wardrobe Carousel (`/wardrobe`)
- **Luxury 3D Carousel**: Horizontal carousel built with CSS 3D transforms (`perspective`, `rotateY`, `scale`, and elevation).
- **Multi-Touch & Mouse Gestures**: Drag horizontally on desktop, swipe on mobile, or use sleek arrow buttons.
- **Category Filter**: `ALL`, `TOPS`, `BOTTOMS`, `DRESSES`, `OUTERWEAR`, `SHOES`, `ACCESSORIES`.
- **Occasion Tags & Clean Badges**: See item tags, fabric details, and clean status at a glance.
- **Laundry Status Tracker**: Toggle pieces between `CLEAN`, `IN LAUNDRY`, and `READY TO WEAR` with subtle visual indicators.
- **12 Curated Demo Garments**: Automatically pre-populated so the closet looks impressive immediately.

### 3. Context-Aware AI Styling Assistant (`/style`)
- **Multi-Factor Synthesis**:
  - **Occasion**: College, Work, Date, Party, Travel, Casual, Custom.
  - **Vibe**: Minimal, Elegant, Street, Comfy, Bold, Effortless.
  - **Weather Adaptation**: Evaluates temperature and 60% rain probability to pick rain-safe fabrics and footwear.
  - **Wearable Sensor Mood (BLE)**: Integrates real-time sensor signals (`Calm · 72%`, `Energetic`, `Confident`, `Cozy`, `Low-key`).
- **Anchor Item Styling ("Style This")**: Click "STYLE THIS" on any wardrobe item (e.g. *Black Pleated Skirt*) to generate matching outfits centered around that specific piece.
- **Why We Chose This**: Editorial bulleted breakdown explaining the harmony between fabrics, weather conditions, personal vibe, and mood telemetry.
- **Affiliate Missing Item Shop**: If your wardrobe lacks a complementary piece (such as a rain-safe trench coat or evening pump), suggests 2-3 pieces from independent emerging designers with direct "Shop" links.

### 4. Fashion Dashboard (`/`)
- Animated **WE MILAN** splash screen with smooth logo pop and fade.
- Personalized greeting and weather snapshot (`28°C · 60% rain chance · Rain-safe ✓`).
- Connected Wearable telemetry card (`Halo Band v1 · Calm 72%`).
- **"Today's Pick"** complete outfit with "WEAR THIS" (confetti micro-interaction) and "TRY ANOTHER".

---

## 🎨 Brand Design Identity
- Inspired directly by the [We Milan showcase](https://vinnydaniel.github.io/webby/#join).
- **Color Palette**:
  - `Ink`: `#181A31`
  - `Navy`: `#272A4B`, `#333866`, `#3E437A`
  - `Coral`: `#E44C4E`, `#B93A3C`
  - `Gold`: `#CCA166`, `#E2C78C`
  - `Cream`: `#F2ECDD`
  - `Muted`: `#9C9FBE`
- **Typography**: `Fraunces` (Editorial Serif), `Space Grotesk` (Clean Sans), `JetBrains Mono` (Monospace Data & Tags), `Pacifico` (Signature Accents).
- **Responsive Shell**: Centered 430px mobile application frame on desktop displays with ambient lighting and edge-to-edge mobile responsiveness.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (Node 20+ recommended)
- npm or yarn

### Installation & Run
```bash
# Navigate to project directory
cd /Users/andrew73/.gemini/antigravity/scratch/we-milan

# Install dependencies
npm install

# Run local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.
